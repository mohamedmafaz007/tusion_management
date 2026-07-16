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

const authInfoPath = path.join(process.cwd(), "auth_info");
const logger = pino({ level: "silent" });

// Use globalThis to persist the singleton connection state across Vite HMR hot reloads
interface GlobalWhatsApp {
  sock: any;
  connectionStatus: "disconnected" | "connecting" | "qrcode" | "connected";
  qrCodeDataUrl: string;
  isInitializing: boolean;
}

const g = globalThis as unknown as { __whatsapp?: GlobalWhatsApp };

if (!g.__whatsapp) {
  g.__whatsapp = {
    sock: null,
    connectionStatus: "disconnected",
    qrCodeDataUrl: "",
    isInitializing: false,
  };
}

const wsState = g.__whatsapp;

/**
 * Clean phone number and convert to international format (adding 91 for India if 10 digits).
 */
export function formatPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/[\s\-\(\)\+]/g, "");
  if (cleaned.length === 10) {
    cleaned = "91" + cleaned;
  }
  return cleaned;
}

/**
 * Initializes the WhatsApp connection using Baileys and multi-file authentication state.
 */
export async function initWhatsApp(forceRestart = false) {
  if (wsState.isInitializing) return;
  if (wsState.sock && wsState.connectionStatus === "connected" && !forceRestart) {
    return;
  }

  wsState.isInitializing = true;
  wsState.connectionStatus = "connecting";
  wsState.qrCodeDataUrl = "";

  try {
    if (wsState.sock && forceRestart) {
      try {
        wsState.sock.end(undefined);
      } catch (e) {}
      wsState.sock = null;
    }

    if (!fs.existsSync(authInfoPath)) {
      fs.mkdirSync(authInfoPath, { recursive: true });
    }

    const { state, saveCreds } = await useMultiFileAuthState(authInfoPath);
    const { version } = await fetchLatestBaileysVersion();

    wsState.sock = makeWASocket({
      version,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, logger as any),
      },
      printQRInTerminal: false,
      logger: logger as any,
    });

    wsState.sock.ev.on("creds.update", saveCreds);

    wsState.sock.ev.on("connection.update", async (update: any) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        wsState.connectionStatus = "qrcode";
        try {
          wsState.qrCodeDataUrl = await QRCode.toDataURL(qr);
        } catch (err) {
          console.error("Failed to generate QR Data URL:", err);
        }
      }

      if (connection === "close") {
        const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut && statusCode !== 401;

        wsState.connectionStatus = "disconnected";
        wsState.qrCodeDataUrl = "";
        wsState.sock = null;

        console.log(`WhatsApp connection closed. StatusCode: ${statusCode}. Reconnecting: ${shouldReconnect}`);

        if (shouldReconnect) {
          setTimeout(() => {
            initWhatsApp().catch((err) => console.error("Error in auto-reconnect:", err));
          }, 3000);
        }
      } else if (connection === "open") {
        wsState.connectionStatus = "connected";
        wsState.qrCodeDataUrl = "";
        console.log("WhatsApp connection successfully opened!");
      }
    });
  } catch (err) {
    console.error("Failed to initialize WhatsApp connection:", err);
    wsState.connectionStatus = "disconnected";
    wsState.qrCodeDataUrl = "";
    wsState.sock = null;
  } finally {
    wsState.isInitializing = false;
  }
}

/**
 * Returns the current WhatsApp pairing status and QR code Data URL.
 */
export function getWhatsAppStatus() {
  if (wsState.sock === null && fs.existsSync(path.join(authInfoPath, "creds.json"))) {
    initWhatsApp().catch((e) => console.error("Failed to auto-init WhatsApp connection:", e));
  }

  return {
    status: wsState.connectionStatus,
    qr: wsState.qrCodeDataUrl,
  };
}

/**
 * Disconnects, logs out, and deletes persistent session storage.
 */
export async function disconnectWhatsApp() {
  console.log("Disconnecting WhatsApp client...");
  if (wsState.sock) {
    try {
      await wsState.sock.logout();
    } catch (e) {}
    try {
      wsState.sock.end(undefined);
    } catch (e) {}
    wsState.sock = null;
  }

  wsState.connectionStatus = "disconnected";
  wsState.qrCodeDataUrl = "";

  if (fs.existsSync(authInfoPath)) {
    try {
      setTimeout(() => {
        fs.rmSync(authInfoPath, { recursive: true, force: true });
        console.log("Deleted auth_info credentials directory.");
      }, 500);
    } catch (err) {
      console.error("Failed to delete auth_info credentials:", err);
    }
  }
}

/**
 * Generates an A5 Landscape styled PDF receipt for fee payments.
 */
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

      const primaryColor = "#1e293b"; // dark slate
      const accentColor = "#4f46e5";  // indigo
      const textColor = "#334155";    // slate text
      const lightBg = "#f8fafc";      // light gray bg

      // Draw background border
      doc.rect(10, 10, doc.page.width - 20, doc.page.height - 20)
         .lineWidth(1.5)
         .strokeColor(accentColor)
         .stroke();

      // Top Header: Institute details
      doc.fillColor(accentColor)
         .font("Helvetica-Bold")
         .fontSize(16)
         .text(data.instituteName || "Vishwa Tuition Center", 25, 25);

      doc.fillColor(textColor)
         .font("Helvetica")
         .fontSize(8)
         .text(data.address || "", 25, 45, { lineGap: 2 });

      doc.text(`Contact: ${data.contact || ""}`, 25, 57);

      // Receipt Metadata (Top-Right)
      doc.fillColor(primaryColor)
         .font("Helvetica-Bold")
         .fontSize(13)
         .text("FEE PAYMENT RECEIPT", doc.page.width - 200, 25, { width: 175, align: "right" });

      doc.fillColor(textColor)
         .font("Helvetica")
         .fontSize(8.5)
         .text(`Receipt #: ${data.receiptId.toUpperCase()}`, doc.page.width - 200, 43, { width: 175, align: "right" });

      doc.text(`Date: ${data.paidDate || new Date().toISOString().slice(0, 10)}`, doc.page.width - 200, 55, { width: 175, align: "right" });

      // Separator Line
      doc.moveTo(25, 72)
         .lineTo(doc.page.width - 25, 72)
         .lineWidth(0.75)
         .strokeColor("#e2e8f0")
         .stroke();

      // Student and Receipt Details Grid
      const gridY = 82;
      
      // Left side: Student Info
      doc.fillColor("#64748b")
         .font("Helvetica-Bold")
         .fontSize(8)
         .text("STUDENT DETAILS", 25, gridY);

      doc.fillColor(primaryColor)
         .font("Helvetica-Bold")
         .fontSize(11)
         .text(data.studentName, 25, gridY + 12);

      doc.font("Helvetica")
         .fontSize(9)
         .fillColor(textColor)
         .text(`Standard & Section: ${data.standard} - ${data.section}`, 25, gridY + 26);

      // Right side: Payment Info
      doc.fillColor("#64748b")
         .font("Helvetica-Bold")
         .fontSize(8)
         .text("FEE & PAYMENT DETAILS", doc.page.width / 2, gridY);

      doc.fillColor(textColor)
         .font("Helvetica")
         .fontSize(9)
         .text(`For Month: ${data.month}`, doc.page.width / 2, gridY + 12);

      doc.text(`Total Monthly Fee: Rs. ${data.amount}`, doc.page.width / 2, gridY + 26);

      // Bottom Highlighted box
      const boxY = gridY + 48;
      const boxWidth = doc.page.width - 50;
      const boxHeight = 35;

      doc.rect(25, boxY, boxWidth, boxHeight)
         .fill(lightBg);

      // Highlight values inside box
      doc.fillColor(primaryColor)
         .font("Helvetica-Bold")
         .fontSize(11)
         .text(`Paid Amount: Rs. ${data.paidAmount}`, 35, boxY + 12);

      const balance = data.amount - data.paidAmount;
      const statusText = balance <= 0 ? "STATUS: FULLY PAID" : `STATUS: PARTIALLY PAID (Bal: Rs. ${balance})`;
      const statusColor = balance <= 0 ? "#059669" : "#dc2626"; // green or red

      doc.fillColor(statusColor)
         .font("Helvetica-Bold")
         .fontSize(10.5)
         .text(statusText, doc.page.width - 240, boxY + 12, { width: 215, align: "right" });

      // Footer disclaimer
      doc.fillColor("#94a3b8")
         .font("Helvetica-Oblique")
         .fontSize(7.5)
         .text("This is an automatically generated receipt. Thank you for your support!", 25, doc.page.height - 30, { align: "center" });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Generates an A4 student registration application form.
 */
export function generateRegistrationPdf(data: {
  instituteName: string;
  address: string;
  contact: string;
  student: {
    name: string;
    gender: string;
    dob: string;
    school: string;
    standard: string;
    section: string;
    parentName: string;
    fatherMobile: string;
    motherMobile: string;
    address: string;
    joiningDate: string;
    monthlyFees: number;
    admissionFees: number;
    notes?: string;
    photo?: string;
  }
}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 40 });
      const chunks: Buffer[] = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err) => reject(err));

      const primaryColor = "#1e293b"; // dark slate
      const accentColor = "#4f46e5";  // indigo
      const textColor = "#334155";    // slate text
      const dividerColor = "#e2e8f0";

      // Background decorative border
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
         .lineWidth(1)
         .strokeColor(accentColor)
         .stroke();

      // Header Banner
      doc.fillColor(accentColor)
         .font("Helvetica-Bold")
         .fontSize(22)
         .text(data.instituteName || "Vishwa Tuition Center", 45, 45, { align: "center" });

      doc.fillColor(textColor)
         .font("Helvetica")
         .fontSize(9)
         .text(data.address || "", 45, 75, { align: "center" });
      doc.text(`Contact: ${data.contact || ""}`, 45, 88, { align: "center" });

      doc.moveTo(45, 105)
         .lineTo(doc.page.width - 45, 105)
         .lineWidth(1.5)
         .strokeColor(accentColor)
         .stroke();

      // Form Title
      doc.fillColor(primaryColor)
         .font("Helvetica-Bold")
         .fontSize(15)
         .text("STUDENT ADMISSION APPLICATION FORM", 45, 120, { align: "center" });

      // If student photo is present, draw it, otherwise draw a box
      const photoWidth = 90;
      const photoHeight = 110;
      const photoX = doc.page.width - 45 - photoWidth;
      const photoY = 150;

      doc.rect(photoX, photoY, photoWidth, photoHeight)
         .lineWidth(1)
         .strokeColor("#94a3b8")
         .stroke();

      if (data.student.photo && data.student.photo.startsWith("data:image")) {
        try {
          doc.image(data.student.photo, photoX + 2, photoY + 2, { width: photoWidth - 4, height: photoHeight - 4 });
        } catch (e) {
          doc.fillColor("#94a3b8")
             .font("Helvetica")
             .fontSize(8)
             .text("PHOTO SLOT", photoX + 15, photoY + 50);
        }
      } else {
        doc.fillColor("#94a3b8")
           .font("Helvetica")
           .fontSize(8)
           .text("PASTE PHOTO\nHERE", photoX, photoY + 45, { width: photoWidth, align: "center" });
      }

      // Fields left column
      const fieldsX = 45;
      let currY = 155;

      const drawField = (label: string, value: string, gap = 18) => {
        doc.fillColor("#64748b")
           .font("Helvetica-Bold")
           .fontSize(9.5)
           .text(`${label}:`, fieldsX, currY);

        doc.fillColor(primaryColor)
           .font("Helvetica")
           .fontSize(10)
           .text(value || "—", fieldsX + 120, currY);

        currY += gap;
      };

      drawField("Application ID", `VTC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`);
      drawField("Full Name", data.student.name);
      drawField("Gender", data.student.gender);
      drawField("Date of Birth", data.student.dob);
      drawField("School", data.student.school);
      drawField("Standard", `${data.student.standard} (${data.student.section || "A"})`);
      drawField("Date of Joining", data.student.joiningDate);

      // Section divider
      currY = Math.max(currY, photoY + photoHeight + 15);
      doc.moveTo(45, currY)
         .lineTo(doc.page.width - 45, currY)
         .lineWidth(0.5)
         .strokeColor(dividerColor)
         .stroke();
      currY += 12;

      // Parent Details Section
      doc.fillColor(accentColor)
         .font("Helvetica-Bold")
         .fontSize(11)
         .text("PARENT & CONTACT INFORMATION", 45, currY);
      currY += 18;

      drawField("Parent/Guardian", data.student.parentName);
      drawField("Father Mobile", data.student.fatherMobile);
      drawField("Mother Mobile", data.student.motherMobile);
      drawField("Residential Address", data.student.address, 24);

      // Section divider
      doc.moveTo(45, currY)
         .lineTo(doc.page.width - 45, currY)
         .lineWidth(0.5)
         .strokeColor(dividerColor)
         .stroke();
      currY += 12;

      // Fee details
      doc.fillColor(accentColor)
         .font("Helvetica-Bold")
         .fontSize(11)
         .text("FEE STRUCTURE & NOTES", 45, currY);
      currY += 18;

      drawField("Admission Fee", `Rs. ${data.student.admissionFees}`);
      drawField("Monthly Tuition Fee", `Rs. ${data.student.monthlyFees}`);
      if (data.student.notes) {
        drawField("Additional Notes", data.student.notes, 24);
      }

      // Signatures at bottom
      const sigY = doc.page.height - 95;
      doc.moveTo(45, sigY)
         .lineTo(175, sigY)
         .moveTo(doc.page.width - 175, sigY)
         .lineTo(doc.page.width - 45, sigY)
         .lineWidth(0.5)
         .strokeColor("#94a3b8")
         .stroke();

      doc.fillColor("#64748b")
         .font("Helvetica")
         .fontSize(8.5)
         .text("Parent/Guardian Signature", 45, sigY + 5, { width: 130, align: "center" })
         .text("Office Administrator", doc.page.width - 175, sigY + 5, { width: 130, align: "center" });

      // Footer
      doc.fillColor("#94a3b8")
         .font("Helvetica-Oblique")
         .fontSize(7.5)
         .text("This application form details the registered profile in Vishwa Tuition Center database.", 45, doc.page.height - 35, { align: "center" });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Sends a PDF receipt to a parent.
 */
export async function sendWhatsAppMessageWithPDF(
  phone: string,
  messageText: string,
  pdfBuffer: Buffer,
  fileName: string
) {
  if (!wsState.sock || wsState.connectionStatus !== "connected") {
    await initWhatsApp();
    let retries = 0;
    while (wsState.connectionStatus !== "connected" && retries < 5) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      retries++;
    }

    if (wsState.connectionStatus !== "connected") {
      throw new Error("WhatsApp client is not connected. Please scan the QR code first in settings.");
    }
  }

  const formattedPhone = formatPhoneNumber(phone);
  const jid = `${formattedPhone}@s.whatsapp.net`;

  const result = await wsState.sock.sendMessage(jid, {
    document: pdfBuffer,
    mimetype: "application/pdf",
    fileName: fileName,
    caption: messageText,
  });

  return result;
}

/**
 * Sends a standard text alert (welcome or attendance).
 */
export async function sendWhatsAppTextMessage(phone: string, text: string) {
  if (!wsState.sock || wsState.connectionStatus !== "connected") {
    await initWhatsApp();
    let retries = 0;
    while (wsState.connectionStatus !== "connected" && retries < 5) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      retries++;
    }

    if (wsState.connectionStatus !== "connected") {
      throw new Error("WhatsApp client is not connected. Please scan the QR code first in settings.");
    }
  }

  const formattedPhone = formatPhoneNumber(phone);
  const jid = `${formattedPhone}@s.whatsapp.net`;

  const result = await wsState.sock.sendMessage(jid, { text });
  return result;
}
