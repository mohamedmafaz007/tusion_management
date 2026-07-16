import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
} from "@whiskeysockets/baileys";
import pino from "pino";
import fs from "fs";
import path from "path";
import QRCode from "qrcode";
import PDFDocument from "pdfkit";
import { fileURLToPath } from "url";

// Shim __dirname globally for PDFKit when bundled in ESM serverless/cloud environments (like Vercel/Render)
if (typeof globalThis !== "undefined") {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const targetDir = path.join(__dirname, "..");
    
    // Set __dirname on both globalThis and global to ensure compatibility across ESM/CJS bundling configurations
    (globalThis as any).__dirname = targetDir;
    if (typeof global !== "undefined") {
      (global as any).__dirname = targetDir;
    }
  } catch (e) {
    console.error("[WhatsApp] Failed to shim globalThis.__dirname:", e);
  }
}

const authInfoPath = path.join(process.cwd(), "auth_info");
const logger = pino({ level: "silent" });

// ────────────────────────────────────────────────────────────────
// Singleton state persisted across Vite HMR reloads via globalThis
// ────────────────────────────────────────────────────────────────
interface GlobalWhatsApp {
  sock: any;
  connectionStatus: "disconnected" | "connecting" | "qrcode" | "connected";
  qrCodeDataUrl: string;
  isInitializing: boolean;
  reconnectAttempts: number;
  adminDisconnected: boolean; // true = admin explicitly logged out; never auto-reconnect
}

const g = globalThis as unknown as { __whatsapp?: GlobalWhatsApp };

if (!g.__whatsapp) {
  g.__whatsapp = {
    sock: null,
    connectionStatus: "disconnected",
    qrCodeDataUrl: "",
    isInitializing: false,
    reconnectAttempts: 0,
    adminDisconnected: false,
  };
}

const ws = g.__whatsapp;

const MAX_RECONNECT_ATTEMPTS = 5;

// ────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────

/** Clean phone number → international format (adds 91 for India when 10 digits). */
export function formatPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/[\s\-\(\)\+]/g, "");
  if (cleaned.length === 10) cleaned = "91" + cleaned;
  return cleaned;
}

/** Safely close the current socket without triggering reconnect. */
function closeSocket() {
  if (ws.sock) {
    try { ws.sock.ev.removeAllListeners(); } catch (_) {}
    try { ws.sock.end(undefined); } catch (_) {}
    ws.sock = null;
  }
}

// ────────────────────────────────────────────────────────────────
// Core connection management
// ────────────────────────────────────────────────────────────────

/**
 * Initializes the WhatsApp connection.
 * Called ONLY when the admin clicks "Start Connection" in Settings,
 * or on limited auto-reconnect after a recoverable disconnect.
 */
export async function initWhatsApp(forceRestart = false) {
  // Guard: already initializing
  if (ws.isInitializing) return;

  // Guard: already connected and not forcing restart
  if (ws.sock && ws.connectionStatus === "connected" && !forceRestart) return;

  // Guard: admin explicitly logged out — do NOT reconnect
  if (ws.adminDisconnected && !forceRestart) return;

  ws.isInitializing = true;
  ws.connectionStatus = "connecting";
  ws.qrCodeDataUrl = "";

  // When admin explicitly triggers, reset flags
  if (forceRestart) {
    ws.adminDisconnected = false;
    ws.reconnectAttempts = 0;
    closeSocket();
  }

  try {
    if (!fs.existsSync(authInfoPath)) {
      fs.mkdirSync(authInfoPath, { recursive: true });
    }

    const { state, saveCreds } = await useMultiFileAuthState(authInfoPath);
    const { version } = await fetchLatestBaileysVersion();

    ws.sock = makeWASocket({
      version,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, logger as any),
      },
      printQRInTerminal: false,
      logger: logger as any,
      // Prevent Baileys from connecting multiple times internally
      syncFullHistory: false,
    });

    ws.sock.ev.on("creds.update", saveCreds);

    ws.sock.ev.on("connection.update", async (update: any) => {
      const { connection, lastDisconnect, qr } = update;

      // ── QR code received ─────────────────────────────────
      if (qr) {
        ws.connectionStatus = "qrcode";
        try {
          ws.qrCodeDataUrl = await QRCode.toDataURL(qr);
        } catch (err) {
          console.error("[WhatsApp] Failed to generate QR Data URL:", err);
        }
      }

      // ── Connection closed ────────────────────────────────
      if (connection === "close") {
        const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;
        const reason = DisconnectReason;

        console.log(`[WhatsApp] Connection closed. StatusCode: ${statusCode}`);

        // Clean up socket listeners to prevent ghost reconnections
        closeSocket();
        ws.connectionStatus = "disconnected";
        ws.qrCodeDataUrl = "";

        // Decide whether to auto-reconnect
        const loggedOut = statusCode === reason.loggedOut || statusCode === 401;
        const streamConflict = statusCode === 440;
        const badSession = statusCode === reason.badSession;

        if (loggedOut || ws.adminDisconnected) {
          // Admin logged out or was kicked — wipe session, do NOT reconnect
          console.log("[WhatsApp] Session logged out. Clearing credentials.");
          try {
            if (fs.existsSync(authInfoPath)) {
              fs.rmSync(authInfoPath, { recursive: true, force: true });
            }
          } catch (_) {}
          ws.reconnectAttempts = 0;
          return;
        }

        if (streamConflict) {
          // StatusCode 440 = another device/process took over the session.
          // Do NOT reconnect — reconnecting would steal it back and cause a loop.
          console.warn("[WhatsApp] Stream conflict (440). Another session is active. NOT reconnecting. Admin must re-pair.");
          ws.reconnectAttempts = 0;
          return;
        }

        if (badSession) {
          // Corrupted session — wipe and require re-pair
          console.warn("[WhatsApp] Bad session. Clearing credentials.");
          try {
            if (fs.existsSync(authInfoPath)) {
              fs.rmSync(authInfoPath, { recursive: true, force: true });
            }
          } catch (_) {}
          ws.reconnectAttempts = 0;
          return;
        }

        // For all other transient errors, reconnect with limits
        if (ws.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          ws.reconnectAttempts++;
          const delay = Math.min(3000 * ws.reconnectAttempts, 15000); // exponential backoff capped at 15s
          console.log(`[WhatsApp] Reconnecting in ${delay / 1000}s (attempt ${ws.reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
          setTimeout(() => {
            initWhatsApp().catch((err) => console.error("[WhatsApp] Reconnect error:", err));
          }, delay);
        } else {
          console.error(`[WhatsApp] Max reconnection attempts (${MAX_RECONNECT_ATTEMPTS}) reached. Giving up. Admin must reconnect manually.`);
          ws.reconnectAttempts = 0;
        }
      }

      // ── Connection opened ────────────────────────────────
      if (connection === "open") {
        ws.connectionStatus = "connected";
        ws.qrCodeDataUrl = "";
        ws.reconnectAttempts = 0;
        console.log("[WhatsApp] Connection successfully opened and stable!");
      }
    });
  } catch (err) {
    console.error("[WhatsApp] Failed to initialize:", err);
    closeSocket();
    ws.connectionStatus = "disconnected";
    ws.qrCodeDataUrl = "";
  } finally {
    ws.isInitializing = false;
  }
}

// ────────────────────────────────────────────────────────────────
// Public API
// ────────────────────────────────────────────────────────────────

/**
 * Returns the current connection status and QR code.
 * Does NOT auto-initiate connections — only reports state.
 */
export function getWhatsAppStatus() {
  return {
    status: ws.connectionStatus,
    qr: ws.qrCodeDataUrl,
  };
}

/**
 * Admin explicitly disconnects and logs out.
 * Clears credentials so the session is fully terminated.
 */
export async function disconnectWhatsApp() {
  console.log("[WhatsApp] Admin requested disconnect/logout.");

  // Flag so auto-reconnect never fires
  ws.adminDisconnected = true;
  ws.reconnectAttempts = 0;

  if (ws.sock) {
    try { await ws.sock.logout(); } catch (_) {}
    closeSocket();
  }

  ws.connectionStatus = "disconnected";
  ws.qrCodeDataUrl = "";

  // Wipe credentials after a brief delay (allows file handles to release)
  setTimeout(() => {
    try {
      if (fs.existsSync(authInfoPath)) {
        fs.rmSync(authInfoPath, { recursive: true, force: true });
        console.log("[WhatsApp] Deleted auth_info credentials.");
      }
    } catch (err) {
      console.error("[WhatsApp] Failed to delete auth_info:", err);
    }
  }, 500);
}

// ────────────────────────────────────────────────────────────────
// PDF generation
// ────────────────────────────────────────────────────────────────

/** Generates an A5 landscape fee receipt PDF. */
export function generateReceiptPdf(data: {
  instituteName: string;
  address: string;
  contact: string;
  studentName: string;
  standard: string;
  section: string;
  month: string;
  amount: number;
  paidAmount: number;
  paidDate: string;
  receiptId: string;
}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A5", margin: 25, layout: "landscape" });
      const chunks: Buffer[] = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err) => reject(err));

      const primaryColor = "#1e293b";
      const accentColor = "#4f46e5";
      const textColor = "#334155";
      const lightBg = "#f8fafc";

      doc.rect(10, 10, doc.page.width - 20, doc.page.height - 20)
         .lineWidth(1.5).strokeColor(accentColor).stroke();

      doc.fillColor(accentColor).font("Helvetica-Bold").fontSize(16)
         .text(data.instituteName || "Vishwa Tuition Center", 25, 25);

      doc.fillColor(textColor).font("Helvetica").fontSize(8)
         .text(data.address || "", 25, 45, { lineGap: 2 });
      doc.text(`Contact: ${data.contact || ""}`, 25, 57);

      doc.fillColor(primaryColor).font("Helvetica-Bold").fontSize(13)
         .text("FEE PAYMENT RECEIPT", doc.page.width - 200, 25, { width: 175, align: "right" });
      doc.fillColor(textColor).font("Helvetica").fontSize(8.5)
         .text(`Receipt #: ${data.receiptId.toUpperCase()}`, doc.page.width - 200, 43, { width: 175, align: "right" });
      doc.text(`Date: ${data.paidDate || new Date().toISOString().slice(0, 10)}`, doc.page.width - 200, 55, { width: 175, align: "right" });

      doc.moveTo(25, 72).lineTo(doc.page.width - 25, 72).lineWidth(0.75).strokeColor("#e2e8f0").stroke();

      const gridY = 82;
      doc.fillColor("#64748b").font("Helvetica-Bold").fontSize(8).text("STUDENT DETAILS", 25, gridY);
      doc.fillColor(primaryColor).font("Helvetica-Bold").fontSize(11).text(data.studentName, 25, gridY + 12);
      doc.font("Helvetica").fontSize(9).fillColor(textColor)
         .text(`Standard & Section: ${data.standard} - ${data.section}`, 25, gridY + 26);

      doc.fillColor("#64748b").font("Helvetica-Bold").fontSize(8).text("FEE & PAYMENT DETAILS", doc.page.width / 2, gridY);
      doc.fillColor(textColor).font("Helvetica").fontSize(9)
         .text(`For Month: ${data.month}`, doc.page.width / 2, gridY + 12);
      doc.text(`Total Monthly Fee: Rs. ${data.amount}`, doc.page.width / 2, gridY + 26);

      const boxY = gridY + 48;
      doc.rect(25, boxY, doc.page.width - 50, 35).fill(lightBg);
      doc.fillColor(primaryColor).font("Helvetica-Bold").fontSize(11)
         .text(`Paid Amount: Rs. ${data.paidAmount}`, 35, boxY + 12);

      const balance = data.amount - data.paidAmount;
      const statusText = balance <= 0 ? "STATUS: FULLY PAID" : `STATUS: PARTIALLY PAID (Bal: Rs. ${balance})`;
      doc.fillColor(balance <= 0 ? "#059669" : "#dc2626").font("Helvetica-Bold").fontSize(10.5)
         .text(statusText, doc.page.width - 240, boxY + 12, { width: 215, align: "right" });

      doc.fillColor("#94a3b8").font("Helvetica-Oblique").fontSize(7.5)
         .text("This is an automatically generated receipt. Thank you for your support!", 25, doc.page.height - 30, { align: "center" });

      doc.end();
    } catch (err) { reject(err); }
  });
}

/** Generates an A4 student registration application form PDF. */
export function generateRegistrationPdf(data: {
  instituteName: string;
  address: string;
  contact: string;
  student: {
    name: string; gender: string; dob: string; school: string;
    standard: string; section: string; parentName: string;
    fatherMobile: string; motherMobile: string; address: string;
    joiningDate: string; monthlyFees: number; admissionFees: number;
    notes?: string; photo?: string;
  }
}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 40 });
      const chunks: Buffer[] = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err) => reject(err));

      const primaryColor = "#1e293b";
      const accentColor = "#4f46e5";
      const textColor = "#334155";
      const dividerColor = "#e2e8f0";

      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(1).strokeColor(accentColor).stroke();

      doc.fillColor(accentColor).font("Helvetica-Bold").fontSize(22)
         .text(data.instituteName || "Vishwa Tuition Center", 45, 45, { align: "center" });
      doc.fillColor(textColor).font("Helvetica").fontSize(9)
         .text(data.address || "", 45, 75, { align: "center" });
      doc.text(`Contact: ${data.contact || ""}`, 45, 88, { align: "center" });

      doc.moveTo(45, 105).lineTo(doc.page.width - 45, 105).lineWidth(1.5).strokeColor(accentColor).stroke();
      doc.fillColor(primaryColor).font("Helvetica-Bold").fontSize(15)
         .text("STUDENT ADMISSION APPLICATION FORM", 45, 120, { align: "center" });

      const photoWidth = 90, photoHeight = 110;
      const photoX = doc.page.width - 45 - photoWidth, photoY = 150;
      doc.rect(photoX, photoY, photoWidth, photoHeight).lineWidth(1).strokeColor("#94a3b8").stroke();

      if (data.student.photo && data.student.photo.startsWith("data:image")) {
        try { doc.image(data.student.photo, photoX + 2, photoY + 2, { width: photoWidth - 4, height: photoHeight - 4 }); }
        catch (_) { doc.fillColor("#94a3b8").font("Helvetica").fontSize(8).text("PHOTO SLOT", photoX + 15, photoY + 50); }
      } else {
        doc.fillColor("#94a3b8").font("Helvetica").fontSize(8)
           .text("PASTE PHOTO\nHERE", photoX, photoY + 45, { width: photoWidth, align: "center" });
      }

      const fieldsX = 45;
      let currY = 155;
      const drawField = (label: string, value: string, gap = 18) => {
        doc.fillColor("#64748b").font("Helvetica-Bold").fontSize(9.5).text(`${label}:`, fieldsX, currY);
        doc.fillColor(primaryColor).font("Helvetica").fontSize(10).text(value || "—", fieldsX + 120, currY);
        currY += gap;
      };

      drawField("Application ID", `VTC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`);
      drawField("Full Name", data.student.name);
      drawField("Gender", data.student.gender);
      drawField("Date of Birth", data.student.dob);
      drawField("School", data.student.school);
      drawField("Standard", `${data.student.standard} (${data.student.section || "A"})`);
      drawField("Date of Joining", data.student.joiningDate);

      currY = Math.max(currY, photoY + photoHeight + 15);
      doc.moveTo(45, currY).lineTo(doc.page.width - 45, currY).lineWidth(0.5).strokeColor(dividerColor).stroke();
      currY += 12;

      doc.fillColor(accentColor).font("Helvetica-Bold").fontSize(11).text("PARENT & CONTACT INFORMATION", 45, currY);
      currY += 18;
      drawField("Parent/Guardian", data.student.parentName);
      drawField("Father Mobile", data.student.fatherMobile);
      drawField("Mother Mobile", data.student.motherMobile);
      drawField("Residential Address", data.student.address, 24);

      doc.moveTo(45, currY).lineTo(doc.page.width - 45, currY).lineWidth(0.5).strokeColor(dividerColor).stroke();
      currY += 12;

      doc.fillColor(accentColor).font("Helvetica-Bold").fontSize(11).text("FEE STRUCTURE & NOTES", 45, currY);
      currY += 18;
      drawField("Admission Fee", `Rs. ${data.student.admissionFees}`);
      drawField("Monthly Tuition Fee", `Rs. ${data.student.monthlyFees}`);
      if (data.student.notes) drawField("Additional Notes", data.student.notes, 24);

      const sigY = doc.page.height - 95;
      doc.moveTo(45, sigY).lineTo(175, sigY).moveTo(doc.page.width - 175, sigY)
         .lineTo(doc.page.width - 45, sigY).lineWidth(0.5).strokeColor("#94a3b8").stroke();
      doc.fillColor("#64748b").font("Helvetica").fontSize(8.5)
         .text("Parent/Guardian Signature", 45, sigY + 5, { width: 130, align: "center" })
         .text("Office Administrator", doc.page.width - 175, sigY + 5, { width: 130, align: "center" });
      doc.fillColor("#94a3b8").font("Helvetica-Oblique").fontSize(7.5)
         .text("This application form details the registered profile in Vishwa Tuition Center database.", 45, doc.page.height - 35, { align: "center" });

      doc.end();
    } catch (err) { reject(err); }
  });
}

// ────────────────────────────────────────────────────────────────
// Messaging
// ────────────────────────────────────────────────────────────────

/** Sends a PDF document via WhatsApp. */
export async function sendWhatsAppMessageWithPDF(
  phone: string, messageText: string, pdfBuffer: Buffer, fileName: string
) {
  if (!ws.sock || ws.connectionStatus !== "connected") {
    throw new Error("WhatsApp client is not connected. Please scan the QR code first in Settings.");
  }
  const jid = `${formatPhoneNumber(phone)}@s.whatsapp.net`;
  return await ws.sock.sendMessage(jid, {
    document: pdfBuffer, mimetype: "application/pdf", fileName, caption: messageText,
  });
}

/** Sends a text message via WhatsApp. */
export async function sendWhatsAppTextMessage(phone: string, text: string) {
  if (!ws.sock || ws.connectionStatus !== "connected") {
    throw new Error("WhatsApp client is not connected. Please scan the QR code first in Settings.");
  }
  const jid = `${formatPhoneNumber(phone)}@s.whatsapp.net`;
  return await ws.sock.sendMessage(jid, { text });
}
