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

let sock: any = null;
let connectionStatus: "disconnected" | "connecting" | "qrcode" | "connected" = "disconnected";
let qrCodeDataUrl: string = "";
let isInitializing = false;

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
  if (isInitializing) return;
  if (sock && connectionStatus === "connected" && !forceRestart) {
    return;
  }

  isInitializing = true;
  connectionStatus = "connecting";
  qrCodeDataUrl = "";

  try {
    if (sock && forceRestart) {
      try {
        sock.end(undefined);
      } catch (e) {}
      sock = null;
    }

    if (!fs.existsSync(authInfoPath)) {
      fs.mkdirSync(authInfoPath, { recursive: true });
    }

    const { state, saveCreds } = await useMultiFileAuthState(authInfoPath);
    const { version } = await fetchLatestBaileysVersion();

    sock = makeWASocket({
      version,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, logger as any),
      },
      printQRInTerminal: false,
      logger: logger as any,
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async (update: any) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        connectionStatus = "qrcode";
        try {
          qrCodeDataUrl = await QRCode.toDataURL(qr);
        } catch (err) {
          console.error("Failed to generate QR Data URL:", err);
        }
      }

      if (connection === "close") {
        const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

        connectionStatus = "disconnected";
        qrCodeDataUrl = "";
        sock = null;

        console.log(`WhatsApp connection closed. StatusCode: ${statusCode}. Reconnecting: ${shouldReconnect}`);

        if (shouldReconnect) {
          setTimeout(() => {
            initWhatsApp().catch((err) => console.error("Error in auto-reconnect:", err));
          }, 3000);
        }
      } else if (connection === "open") {
        connectionStatus = "connected";
        qrCodeDataUrl = "";
        console.log("WhatsApp connection successfully opened!");
      }
    });
  } catch (err) {
    console.error("Failed to initialize WhatsApp connection:", err);
    connectionStatus = "disconnected";
    qrCodeDataUrl = "";
    sock = null;
  } finally {
    isInitializing = false;
  }
}

/**
 * Returns the current WhatsApp pairing status and QR code Data URL.
 */
export function getWhatsAppStatus() {
  if (sock === null && fs.existsSync(path.join(authInfoPath, "creds.json"))) {
    initWhatsApp().catch((e) => console.error("Failed to auto-init WhatsApp connection:", e));
  }

  return {
    status: connectionStatus,
    qr: qrCodeDataUrl,
  };
}

/**
 * Disconnects, logs out, and deletes persistent session storage.
 */
export async function disconnectWhatsApp() {
  console.log("Disconnecting WhatsApp client...");
  if (sock) {
    try {
      await sock.logout();
    } catch (e) {}
    try {
      sock.end(undefined);
    } catch (e) {}
    sock = null;
  }

  connectionStatus = "disconnected";
  qrCodeDataUrl = "";

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
      // A5 dimensions: width 595, height 420.
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
 * Sends a PDF receipt to a parent.
 */
export async function sendWhatsAppMessageWithPDF(
  phone: string,
  messageText: string,
  pdfBuffer: Buffer,
  fileName: string
) {
  if (!sock || connectionStatus !== "connected") {
    await initWhatsApp();
    let retries = 0;
    while (connectionStatus !== "connected" && retries < 5) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      retries++;
    }

    if (connectionStatus !== "connected") {
      throw new Error("WhatsApp client is not connected. Please scan the QR code first in settings.");
    }
  }

  const formattedPhone = formatPhoneNumber(phone);
  const jid = `${formattedPhone}@s.whatsapp.net`;

  const result = await sock.sendMessage(jid, {
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
  if (!sock || connectionStatus !== "connected") {
    await initWhatsApp();
    let retries = 0;
    while (connectionStatus !== "connected" && retries < 5) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      retries++;
    }

    if (connectionStatus !== "connected") {
      throw new Error("WhatsApp client is not connected. Please scan the QR code first in settings.");
    }
  }

  const formattedPhone = formatPhoneNumber(phone);
  const jid = `${formattedPhone}@s.whatsapp.net`;

  const result = await sock.sendMessage(jid, { text });
  return result;
}
