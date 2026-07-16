import { o as __toESM } from "../_runtime.mjs";
import { c as useMultiFileAuthState, d as DisconnectReason, l as makeCacheableSignalKeyStore, t as lib_default, u as fetchLatestBaileysVersion } from "../_libs/@whiskeysockets/baileys.mjs";
import { t as require_pino } from "../_libs/pino+thread-stream.mjs";
import { t as require_lib } from "../_libs/qrcode.mjs";
import { t as PDFDocument } from "../_libs/pdfkit+png-js.mjs";
import $52ZIf$fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
//#region node_modules/.nitro/vite/services/ssr/assets/whatsappService-D1S4el9J.js
var import_pino = /* @__PURE__ */ __toESM(require_pino());
var import_lib = /* @__PURE__ */ __toESM(require_lib());
if (typeof globalThis !== "undefined" && !("__dirname" in globalThis)) try {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	globalThis.__dirname = path.join(__dirname, "..");
} catch (e) {
	console.error("[WhatsApp] Failed to shim globalThis.__dirname:", e);
}
var authInfoPath = path.join(process.cwd(), "auth_info");
var logger = (0, import_pino.default)({ level: "silent" });
var g = globalThis;
if (!g.__whatsapp) g.__whatsapp = {
	sock: null,
	connectionStatus: "disconnected",
	qrCodeDataUrl: "",
	isInitializing: false,
	reconnectAttempts: 0,
	adminDisconnected: false
};
var ws = g.__whatsapp;
var MAX_RECONNECT_ATTEMPTS = 5;
/** Clean phone number → international format (adds 91 for India when 10 digits). */
function formatPhoneNumber(phone) {
	let cleaned = phone.replace(/[\s\-\(\)\+]/g, "");
	if (cleaned.length === 10) cleaned = "91" + cleaned;
	return cleaned;
}
/** Safely close the current socket without triggering reconnect. */
function closeSocket() {
	if (ws.sock) {
		try {
			ws.sock.ev.removeAllListeners();
		} catch (_) {}
		try {
			ws.sock.end(void 0);
		} catch (_) {}
		ws.sock = null;
	}
}
/**
* Initializes the WhatsApp connection.
* Called ONLY when the admin clicks "Start Connection" in Settings,
* or on limited auto-reconnect after a recoverable disconnect.
*/
async function initWhatsApp(forceRestart = false) {
	if (ws.isInitializing) return;
	if (ws.sock && ws.connectionStatus === "connected" && !forceRestart) return;
	if (ws.adminDisconnected && !forceRestart) return;
	ws.isInitializing = true;
	ws.connectionStatus = "connecting";
	ws.qrCodeDataUrl = "";
	if (forceRestart) {
		ws.adminDisconnected = false;
		ws.reconnectAttempts = 0;
		closeSocket();
	}
	try {
		if (!$52ZIf$fs.existsSync(authInfoPath)) $52ZIf$fs.mkdirSync(authInfoPath, { recursive: true });
		const { state, saveCreds } = await useMultiFileAuthState(authInfoPath);
		const { version } = await fetchLatestBaileysVersion();
		ws.sock = lib_default({
			version,
			auth: {
				creds: state.creds,
				keys: makeCacheableSignalKeyStore(state.keys, logger)
			},
			printQRInTerminal: false,
			logger,
			syncFullHistory: false
		});
		ws.sock.ev.on("creds.update", saveCreds);
		ws.sock.ev.on("connection.update", async (update) => {
			const { connection, lastDisconnect, qr } = update;
			if (qr) {
				ws.connectionStatus = "qrcode";
				try {
					ws.qrCodeDataUrl = await import_lib.toDataURL(qr);
				} catch (err) {
					console.error("[WhatsApp] Failed to generate QR Data URL:", err);
				}
			}
			if (connection === "close") {
				const statusCode = (lastDisconnect?.error)?.output?.statusCode;
				const reason = DisconnectReason;
				console.log(`[WhatsApp] Connection closed. StatusCode: ${statusCode}`);
				closeSocket();
				ws.connectionStatus = "disconnected";
				ws.qrCodeDataUrl = "";
				const loggedOut = statusCode === reason.loggedOut || statusCode === 401;
				const streamConflict = statusCode === 440;
				const badSession = statusCode === reason.badSession;
				if (loggedOut || ws.adminDisconnected) {
					console.log("[WhatsApp] Session logged out. Clearing credentials.");
					try {
						if ($52ZIf$fs.existsSync(authInfoPath)) $52ZIf$fs.rmSync(authInfoPath, {
							recursive: true,
							force: true
						});
					} catch (_) {}
					ws.reconnectAttempts = 0;
					return;
				}
				if (streamConflict) {
					console.warn("[WhatsApp] Stream conflict (440). Another session is active. NOT reconnecting. Admin must re-pair.");
					ws.reconnectAttempts = 0;
					return;
				}
				if (badSession) {
					console.warn("[WhatsApp] Bad session. Clearing credentials.");
					try {
						if ($52ZIf$fs.existsSync(authInfoPath)) $52ZIf$fs.rmSync(authInfoPath, {
							recursive: true,
							force: true
						});
					} catch (_) {}
					ws.reconnectAttempts = 0;
					return;
				}
				if (ws.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
					ws.reconnectAttempts++;
					const delay = Math.min(3e3 * ws.reconnectAttempts, 15e3);
					console.log(`[WhatsApp] Reconnecting in ${delay / 1e3}s (attempt ${ws.reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
					setTimeout(() => {
						initWhatsApp().catch((err) => console.error("[WhatsApp] Reconnect error:", err));
					}, delay);
				} else {
					console.error(`[WhatsApp] Max reconnection attempts (${MAX_RECONNECT_ATTEMPTS}) reached. Giving up. Admin must reconnect manually.`);
					ws.reconnectAttempts = 0;
				}
			}
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
/**
* Returns the current connection status and QR code.
* Does NOT auto-initiate connections — only reports state.
*/
function getWhatsAppStatus() {
	return {
		status: ws.connectionStatus,
		qr: ws.qrCodeDataUrl
	};
}
/**
* Admin explicitly disconnects and logs out.
* Clears credentials so the session is fully terminated.
*/
async function disconnectWhatsApp() {
	console.log("[WhatsApp] Admin requested disconnect/logout.");
	ws.adminDisconnected = true;
	ws.reconnectAttempts = 0;
	if (ws.sock) {
		try {
			await ws.sock.logout();
		} catch (_) {}
		closeSocket();
	}
	ws.connectionStatus = "disconnected";
	ws.qrCodeDataUrl = "";
	setTimeout(() => {
		try {
			if ($52ZIf$fs.existsSync(authInfoPath)) {
				$52ZIf$fs.rmSync(authInfoPath, {
					recursive: true,
					force: true
				});
				console.log("[WhatsApp] Deleted auth_info credentials.");
			}
		} catch (err) {
			console.error("[WhatsApp] Failed to delete auth_info:", err);
		}
	}, 500);
}
/** Generates an A5 landscape fee receipt PDF. */
function generateReceiptPdf(data) {
	return new Promise((resolve, reject) => {
		try {
			const doc = new PDFDocument({
				size: "A5",
				margin: 25,
				layout: "landscape"
			});
			const chunks = [];
			doc.on("data", (chunk) => chunks.push(chunk));
			doc.on("end", () => resolve(Buffer.concat(chunks)));
			doc.on("error", (err) => reject(err));
			const primaryColor = "#1e293b";
			const accentColor = "#4f46e5";
			const textColor = "#334155";
			const lightBg = "#f8fafc";
			doc.rect(10, 10, doc.page.width - 20, doc.page.height - 20).lineWidth(1.5).strokeColor(accentColor).stroke();
			doc.fillColor(accentColor).font("Helvetica-Bold").fontSize(16).text(data.instituteName || "Vishwa Tuition Center", 25, 25);
			doc.fillColor(textColor).font("Helvetica").fontSize(8).text(data.address || "", 25, 45, { lineGap: 2 });
			doc.text(`Contact: ${data.contact || ""}`, 25, 57);
			doc.fillColor(primaryColor).font("Helvetica-Bold").fontSize(13).text("FEE PAYMENT RECEIPT", doc.page.width - 200, 25, {
				width: 175,
				align: "right"
			});
			doc.fillColor(textColor).font("Helvetica").fontSize(8.5).text(`Receipt #: ${data.receiptId.toUpperCase()}`, doc.page.width - 200, 43, {
				width: 175,
				align: "right"
			});
			doc.text(`Date: ${data.paidDate || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}`, doc.page.width - 200, 55, {
				width: 175,
				align: "right"
			});
			doc.moveTo(25, 72).lineTo(doc.page.width - 25, 72).lineWidth(.75).strokeColor("#e2e8f0").stroke();
			const gridY = 82;
			doc.fillColor("#64748b").font("Helvetica-Bold").fontSize(8).text("STUDENT DETAILS", 25, gridY);
			doc.fillColor(primaryColor).font("Helvetica-Bold").fontSize(11).text(data.studentName, 25, 94);
			doc.font("Helvetica").fontSize(9).fillColor(textColor).text(`Standard & Section: ${data.standard} - ${data.section}`, 25, 108);
			doc.fillColor("#64748b").font("Helvetica-Bold").fontSize(8).text("FEE & PAYMENT DETAILS", doc.page.width / 2, gridY);
			doc.fillColor(textColor).font("Helvetica").fontSize(9).text(`For Month: ${data.month}`, doc.page.width / 2, 94);
			doc.text(`Total Monthly Fee: Rs. ${data.amount}`, doc.page.width / 2, 108);
			doc.rect(25, 130, doc.page.width - 50, 35).fill(lightBg);
			doc.fillColor(primaryColor).font("Helvetica-Bold").fontSize(11).text(`Paid Amount: Rs. ${data.paidAmount}`, 35, 142);
			const balance = data.amount - data.paidAmount;
			const statusText = balance <= 0 ? "STATUS: FULLY PAID" : `STATUS: PARTIALLY PAID (Bal: Rs. ${balance})`;
			doc.fillColor(balance <= 0 ? "#059669" : "#dc2626").font("Helvetica-Bold").fontSize(10.5).text(statusText, doc.page.width - 240, 142, {
				width: 215,
				align: "right"
			});
			doc.fillColor("#94a3b8").font("Helvetica-Oblique").fontSize(7.5).text("This is an automatically generated receipt. Thank you for your support!", 25, doc.page.height - 30, { align: "center" });
			doc.end();
		} catch (err) {
			reject(err);
		}
	});
}
/** Generates an A4 student registration application form PDF. */
function generateRegistrationPdf(data) {
	return new Promise((resolve, reject) => {
		try {
			const doc = new PDFDocument({
				size: "A4",
				margin: 40
			});
			const chunks = [];
			doc.on("data", (chunk) => chunks.push(chunk));
			doc.on("end", () => resolve(Buffer.concat(chunks)));
			doc.on("error", (err) => reject(err));
			const primaryColor = "#1e293b";
			const accentColor = "#4f46e5";
			const textColor = "#334155";
			const dividerColor = "#e2e8f0";
			doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(1).strokeColor(accentColor).stroke();
			doc.fillColor(accentColor).font("Helvetica-Bold").fontSize(22).text(data.instituteName || "Vishwa Tuition Center", 45, 45, { align: "center" });
			doc.fillColor(textColor).font("Helvetica").fontSize(9).text(data.address || "", 45, 75, { align: "center" });
			doc.text(`Contact: ${data.contact || ""}`, 45, 88, { align: "center" });
			doc.moveTo(45, 105).lineTo(doc.page.width - 45, 105).lineWidth(1.5).strokeColor(accentColor).stroke();
			doc.fillColor(primaryColor).font("Helvetica-Bold").fontSize(15).text("STUDENT ADMISSION APPLICATION FORM", 45, 120, { align: "center" });
			const photoWidth = 90, photoHeight = 110;
			const photoX = doc.page.width - 45 - photoWidth;
			doc.rect(photoX, 150, photoWidth, photoHeight).lineWidth(1).strokeColor("#94a3b8").stroke();
			if (data.student.photo && data.student.photo.startsWith("data:image")) try {
				doc.image(data.student.photo, photoX + 2, 152, {
					width: photoWidth - 4,
					height: photoHeight - 4
				});
			} catch (_) {
				doc.fillColor("#94a3b8").font("Helvetica").fontSize(8).text("PHOTO SLOT", photoX + 15, 200);
			}
			else doc.fillColor("#94a3b8").font("Helvetica").fontSize(8).text("PASTE PHOTO\nHERE", photoX, 195, {
				width: photoWidth,
				align: "center"
			});
			const fieldsX = 45;
			let currY = 155;
			const drawField = (label, value, gap = 18) => {
				doc.fillColor("#64748b").font("Helvetica-Bold").fontSize(9.5).text(`${label}:`, fieldsX, currY);
				doc.fillColor(primaryColor).font("Helvetica").fontSize(10).text(value || "—", 165, currY);
				currY += gap;
			};
			drawField("Application ID", `VTC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`);
			drawField("Full Name", data.student.name);
			drawField("Gender", data.student.gender);
			drawField("Date of Birth", data.student.dob);
			drawField("School", data.student.school);
			drawField("Standard", `${data.student.standard} (${data.student.section || "A"})`);
			drawField("Date of Joining", data.student.joiningDate);
			currY = Math.max(currY, 275);
			doc.moveTo(45, currY).lineTo(doc.page.width - 45, currY).lineWidth(.5).strokeColor(dividerColor).stroke();
			currY += 12;
			doc.fillColor(accentColor).font("Helvetica-Bold").fontSize(11).text("PARENT & CONTACT INFORMATION", 45, currY);
			currY += 18;
			drawField("Parent/Guardian", data.student.parentName);
			drawField("Father Mobile", data.student.fatherMobile);
			drawField("Mother Mobile", data.student.motherMobile);
			drawField("Residential Address", data.student.address, 24);
			doc.moveTo(45, currY).lineTo(doc.page.width - 45, currY).lineWidth(.5).strokeColor(dividerColor).stroke();
			currY += 12;
			doc.fillColor(accentColor).font("Helvetica-Bold").fontSize(11).text("FEE STRUCTURE & NOTES", 45, currY);
			currY += 18;
			drawField("Admission Fee", `Rs. ${data.student.admissionFees}`);
			drawField("Monthly Tuition Fee", `Rs. ${data.student.monthlyFees}`);
			if (data.student.notes) drawField("Additional Notes", data.student.notes, 24);
			const sigY = doc.page.height - 95;
			doc.moveTo(45, sigY).lineTo(175, sigY).moveTo(doc.page.width - 175, sigY).lineTo(doc.page.width - 45, sigY).lineWidth(.5).strokeColor("#94a3b8").stroke();
			doc.fillColor("#64748b").font("Helvetica").fontSize(8.5).text("Parent/Guardian Signature", 45, sigY + 5, {
				width: 130,
				align: "center"
			}).text("Office Administrator", doc.page.width - 175, sigY + 5, {
				width: 130,
				align: "center"
			});
			doc.fillColor("#94a3b8").font("Helvetica-Oblique").fontSize(7.5).text("This application form details the registered profile in Vishwa Tuition Center database.", 45, doc.page.height - 35, { align: "center" });
			doc.end();
		} catch (err) {
			reject(err);
		}
	});
}
/** Sends a PDF document via WhatsApp. */
async function sendWhatsAppMessageWithPDF(phone, messageText, pdfBuffer, fileName) {
	if (!ws.sock || ws.connectionStatus !== "connected") throw new Error("WhatsApp client is not connected. Please scan the QR code first in Settings.");
	const jid = `${formatPhoneNumber(phone)}@s.whatsapp.net`;
	return await ws.sock.sendMessage(jid, {
		document: pdfBuffer,
		mimetype: "application/pdf",
		fileName,
		caption: messageText
	});
}
/** Sends a text message via WhatsApp. */
async function sendWhatsAppTextMessage(phone, text) {
	if (!ws.sock || ws.connectionStatus !== "connected") throw new Error("WhatsApp client is not connected. Please scan the QR code first in Settings.");
	const jid = `${formatPhoneNumber(phone)}@s.whatsapp.net`;
	return await ws.sock.sendMessage(jid, { text });
}
//#endregion
export { disconnectWhatsApp, formatPhoneNumber, generateReceiptPdf, generateRegistrationPdf, getWhatsAppStatus, initWhatsApp, sendWhatsAppMessageWithPDF, sendWhatsAppTextMessage };
