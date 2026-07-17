import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/db-D4OraJw9.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var isServer = typeof window === "undefined";
var cachedSql = null;
async function getSql() {
	if (typeof window !== "undefined") return null;
	if (cachedSql) return cachedSql;
	const connectionString = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL;
	if (!connectionString) return null;
	try {
		const { default: postgres } = await import("../_libs/postgres.mjs").then((n) => n.t);
		cachedSql = postgres(connectionString.replace(/^["']|["']$/g, ""), {
			ssl: "require",
			max: 10,
			idle_timeout: 20,
			connect_timeout: 10
		});
		return cachedSql;
	} catch (err) {
		console.error("Failed to dynamically import postgres driver:", err);
		return null;
	}
}
async function initDb() {
	const sql = await getSql();
	if (!sql) {
		console.log("Database connection string not configured. Skipping initialization.");
		return;
	}
	try {
		if ((await sql`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'students' AND column_name = 'gender'
    `).length === 0) {
			console.log("Migrating database schemas to match TypeScript interfaces...");
			await sql`DROP TABLE IF EXISTS students CASCADE`;
			await sql`DROP TABLE IF EXISTS attendance CASCADE`;
			await sql`DROP TABLE IF EXISTS fees CASCADE`;
			await sql`DROP TABLE IF EXISTS materials CASCADE`;
			await sql`DROP TABLE IF EXISTS settings CASCADE`;
		}
		await sql`
      CREATE TABLE IF NOT EXISTS students (
        "id" TEXT PRIMARY KEY,
        "photo" TEXT,
        "name" TEXT NOT NULL,
        "gender" TEXT NOT NULL,
        "dob" TEXT NOT NULL,
        "school" TEXT NOT NULL,
        "standard" TEXT NOT NULL,
        "section" TEXT NOT NULL,
        "parentName" TEXT NOT NULL,
        "fatherMobile" TEXT NOT NULL,
        "motherMobile" TEXT NOT NULL,
        "address" TEXT NOT NULL,
        "joiningDate" TEXT NOT NULL,
        "monthlyFees" INTEGER NOT NULL,
        "admissionFees" INTEGER NOT NULL,
        "notes" TEXT,
        "createdAt" TEXT NOT NULL
      )
    `;
		await sql`
      CREATE TABLE IF NOT EXISTS attendance (
        "id" TEXT PRIMARY KEY,
        "studentId" TEXT NOT NULL,
        "date" TEXT NOT NULL,
        "status" TEXT NOT NULL,
        "remarks" TEXT
      )
    `;
		await sql`
      CREATE TABLE IF NOT EXISTS fees (
        "id" TEXT PRIMARY KEY,
        "studentId" TEXT NOT NULL,
        "month" TEXT NOT NULL,
        "amount" INTEGER NOT NULL,
        "paidAmount" INTEGER NOT NULL,
        "paidDate" TEXT,
        "status" TEXT NOT NULL
      )
    `;
		await sql`
      CREATE TABLE IF NOT EXISTS materials (
        "id" TEXT PRIMARY KEY,
        "standard" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "fileName" TEXT NOT NULL,
        "fileType" TEXT NOT NULL,
        "size" INTEGER NOT NULL,
        "driveUrl" TEXT NOT NULL,
        "driveFileId" TEXT NOT NULL,
        "createdAt" TEXT NOT NULL
      )
    `;
		await sql`
      CREATE TABLE IF NOT EXISTS settings (
        "key" TEXT PRIMARY KEY,
        "value" TEXT NOT NULL
      )
    `;
		await sql`
      CREATE TABLE IF NOT EXISTS message_logs (
        "id" TEXT PRIMARY KEY,
        "type" TEXT NOT NULL,
        "studentId" TEXT NOT NULL,
        "studentName" TEXT NOT NULL,
        "recipientPhone" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "status" TEXT NOT NULL,
        "error" TEXT,
        "timestamp" TEXT NOT NULL
      )
    `;
		console.log("Neon Postgres Database tables checked/initialized successfully!");
	} catch (err) {
		console.error("Neon Postgres Database initialization failed:", err);
	}
}
if (isServer) initDb();
var isDbConfigured_createServerFn_handler = createServerRpc({
	id: "c5eb8a68e4ec900442dce8a00888e100157bc1876de6aeed1aae613bc9cda6f0",
	name: "isDbConfigured",
	filename: "src/lib/db.ts"
}, (opts) => isDbConfigured.__executeServer(opts));
var isDbConfigured = createServerFn({ method: "GET" }).handler(isDbConfigured_createServerFn_handler, async () => {
	return !!(process.env.DATABASE_URL || process.env.VITE_DATABASE_URL);
});
var getDbStudents_createServerFn_handler = createServerRpc({
	id: "ef01ed4999ef9934a8ac9c2cd2b8185094865576b81122715a0d6094abc82017",
	name: "getDbStudents",
	filename: "src/lib/db.ts"
}, (opts) => getDbStudents.__executeServer(opts));
var getDbStudents = createServerFn({ method: "GET" }).handler(getDbStudents_createServerFn_handler, async () => {
	const sql = await getSql();
	if (!sql) return [];
	try {
		return (await sql`SELECT * FROM students`).map((r) => ({
			id: r.id,
			photo: r.photo,
			name: r.name,
			gender: r.gender,
			dob: r.dob,
			school: r.school,
			standard: r.standard,
			section: r.section,
			parentName: r.parentName,
			fatherMobile: r.fatherMobile,
			motherMobile: r.motherMobile,
			address: r.address,
			joiningDate: r.joiningDate,
			monthlyFees: Number(r.monthlyFees),
			admissionFees: Number(r.admissionFees),
			notes: r.notes,
			createdAt: r.createdAt
		}));
	} catch (e) {
		console.error("Failed to get students from DB:", e);
		return [];
	}
});
var syncDbStudents_createServerFn_handler = createServerRpc({
	id: "aa8ae33754abdd005f7751348dd9d155619066b4e57f5237315066d57ddeadea",
	name: "syncDbStudents",
	filename: "src/lib/db.ts"
}, (opts) => syncDbStudents.__executeServer(opts));
var syncDbStudents = createServerFn({ method: "POST" }).validator((students) => students).handler(syncDbStudents_createServerFn_handler, async ({ data: students }) => {
	const sql = await getSql();
	if (!sql) return;
	const sanitized = students.map((s) => ({
		id: s.id || "",
		photo: s.photo === void 0 ? null : s.photo,
		name: s.name || "",
		gender: s.gender || "Male",
		dob: s.dob || "",
		school: s.school || "",
		standard: s.standard || "8th",
		section: s.section || "A",
		parentName: s.parentName || "",
		fatherMobile: s.fatherMobile || "",
		motherMobile: s.motherMobile || "",
		address: s.address || "",
		joiningDate: s.joiningDate || "",
		monthlyFees: s.monthlyFees === void 0 ? 0 : Number(s.monthlyFees),
		admissionFees: s.admissionFees === void 0 ? 0 : Number(s.admissionFees),
		notes: s.notes === void 0 ? null : s.notes,
		createdAt: s.createdAt || (/* @__PURE__ */ new Date()).toISOString()
	}));
	const uniqueStudents = /* @__PURE__ */ new Map();
	for (const item of sanitized) if (item.id) uniqueStudents.set(item.id, item);
	const deduplicated = Array.from(uniqueStudents.values());
	try {
		await sql.begin(async (sql) => {
			await sql`DELETE FROM students`;
			if (deduplicated.length > 0) await sql`
            INSERT INTO students ${sql(deduplicated, [
				"id",
				"photo",
				"name",
				"gender",
				"dob",
				"school",
				"standard",
				"section",
				"parentName",
				"fatherMobile",
				"motherMobile",
				"address",
				"joiningDate",
				"monthlyFees",
				"admissionFees",
				"notes",
				"createdAt"
			])}
          `;
		});
	} catch (e) {
		console.error("Failed to sync students to DB:", e);
		throw e;
	}
});
var getDbAttendance_createServerFn_handler = createServerRpc({
	id: "6207d2bdafd8de10423a08fa3b76fa9832b35b4bfa8e6f5773fdcb2c581bb555",
	name: "getDbAttendance",
	filename: "src/lib/db.ts"
}, (opts) => getDbAttendance.__executeServer(opts));
var getDbAttendance = createServerFn({ method: "GET" }).handler(getDbAttendance_createServerFn_handler, async () => {
	const sql = await getSql();
	if (!sql) return [];
	try {
		return (await sql`SELECT * FROM attendance`).map((r) => ({
			id: r.id,
			studentId: r.studentId,
			date: r.date,
			status: r.status,
			remarks: r.remarks
		}));
	} catch (e) {
		console.error("Failed to get attendance from DB:", e);
		return [];
	}
});
var syncDbAttendance_createServerFn_handler = createServerRpc({
	id: "fed33b670184b4a477a31eb9cf33f2f500e195e50fd132a81598e2aa1f6ee06c",
	name: "syncDbAttendance",
	filename: "src/lib/db.ts"
}, (opts) => syncDbAttendance.__executeServer(opts));
var syncDbAttendance = createServerFn({ method: "POST" }).validator((attendance) => attendance).handler(syncDbAttendance_createServerFn_handler, async ({ data: attendance }) => {
	const sql = await getSql();
	if (!sql) return;
	const sanitized = attendance.map((a) => ({
		id: a.id || "",
		studentId: a.studentId || "",
		date: a.date || "",
		status: a.status || "Present",
		remarks: a.remarks === void 0 ? null : a.remarks
	}));
	const uniqueAttendance = /* @__PURE__ */ new Map();
	for (const item of sanitized) if (item.id) uniqueAttendance.set(item.id, item);
	const deduplicated = Array.from(uniqueAttendance.values());
	try {
		await sql.begin(async (sql) => {
			await sql`DELETE FROM attendance`;
			if (deduplicated.length > 0) await sql`
            INSERT INTO attendance ${sql(deduplicated, [
				"id",
				"studentId",
				"date",
				"status",
				"remarks"
			])}
          `;
		});
	} catch (e) {
		console.error("Failed to sync attendance to DB:", e);
		throw e;
	}
});
var getDbFees_createServerFn_handler = createServerRpc({
	id: "52066844ace69045f2c28451d013fa29c371a9f68b25781593b896e5aa768c59",
	name: "getDbFees",
	filename: "src/lib/db.ts"
}, (opts) => getDbFees.__executeServer(opts));
var getDbFees = createServerFn({ method: "GET" }).handler(getDbFees_createServerFn_handler, async () => {
	const sql = await getSql();
	if (!sql) return [];
	try {
		return (await sql`SELECT * FROM fees`).map((r) => ({
			id: r.id,
			studentId: r.studentId,
			month: r.month,
			amount: Number(r.amount),
			paidAmount: Number(r.paidAmount),
			paidDate: r.paidDate,
			status: r.status
		}));
	} catch (e) {
		console.error("Failed to get fees from DB:", e);
		return [];
	}
});
var syncDbFees_createServerFn_handler = createServerRpc({
	id: "ffe37f11922aea0eed5ce0e1c85a59696529f381da248a76ec5298dfcd2aad64",
	name: "syncDbFees",
	filename: "src/lib/db.ts"
}, (opts) => syncDbFees.__executeServer(opts));
var syncDbFees = createServerFn({ method: "POST" }).validator((fees) => fees).handler(syncDbFees_createServerFn_handler, async ({ data: fees }) => {
	const sql = await getSql();
	if (!sql) return;
	const sanitized = fees.map((f) => ({
		id: f.id || "",
		studentId: f.studentId || "",
		month: f.month || "",
		amount: f.amount === void 0 ? 0 : Number(f.amount),
		paidAmount: f.paidAmount === void 0 ? 0 : Number(f.paidAmount),
		paidDate: f.paidDate === void 0 ? null : f.paidDate,
		status: f.status || "Pending"
	}));
	const uniqueFees = /* @__PURE__ */ new Map();
	for (const item of sanitized) if (item.id) uniqueFees.set(item.id, item);
	const deduplicated = Array.from(uniqueFees.values());
	try {
		await sql.begin(async (sql) => {
			await sql`DELETE FROM fees`;
			if (deduplicated.length > 0) await sql`
            INSERT INTO fees ${sql(deduplicated, [
				"id",
				"studentId",
				"month",
				"amount",
				"paidAmount",
				"paidDate",
				"status"
			])}
          `;
		});
	} catch (e) {
		console.error("Failed to sync fees to DB:", e);
		throw e;
	}
});
var getDbMaterials_createServerFn_handler = createServerRpc({
	id: "039f1c84c7d3e5a9d36b54c2246e98ed21558a5a3e724bf6aac138005dccd739",
	name: "getDbMaterials",
	filename: "src/lib/db.ts"
}, (opts) => getDbMaterials.__executeServer(opts));
var getDbMaterials = createServerFn({ method: "GET" }).handler(getDbMaterials_createServerFn_handler, async () => {
	const sql = await getSql();
	if (!sql) return [];
	try {
		return (await sql`SELECT * FROM materials`).map((r) => ({
			id: r.id,
			standard: r.standard,
			type: r.type,
			title: r.title,
			fileName: r.fileName,
			fileType: r.fileType,
			size: Number(r.size),
			driveUrl: r.driveUrl,
			driveFileId: r.driveFileId,
			createdAt: r.createdAt
		}));
	} catch (e) {
		console.error("Failed to get materials from DB:", e);
		return [];
	}
});
var syncDbMaterials_createServerFn_handler = createServerRpc({
	id: "fcfa01bb33417347dd9afa325159acc162b3decf91fb70e5d51bbd8e42fccb0c",
	name: "syncDbMaterials",
	filename: "src/lib/db.ts"
}, (opts) => syncDbMaterials.__executeServer(opts));
var syncDbMaterials = createServerFn({ method: "POST" }).validator((materials) => materials).handler(syncDbMaterials_createServerFn_handler, async ({ data: materials }) => {
	const sql = await getSql();
	if (!sql) return;
	const sanitized = materials.map((m) => ({
		id: m.id || "",
		standard: m.standard || "8th",
		type: m.type || "Notes",
		title: m.title || "",
		fileName: m.fileName || "",
		fileType: m.fileType || "",
		size: m.size === void 0 ? 0 : Number(m.size),
		driveUrl: m.driveUrl === void 0 ? "" : m.driveUrl,
		driveFileId: m.driveFileId === void 0 ? "" : m.driveFileId,
		createdAt: m.createdAt || (/* @__PURE__ */ new Date()).toISOString()
	}));
	const uniqueMaterials = /* @__PURE__ */ new Map();
	for (const item of sanitized) if (item.id) uniqueMaterials.set(item.id, item);
	const deduplicated = Array.from(uniqueMaterials.values());
	try {
		await sql.begin(async (sql) => {
			await sql`DELETE FROM materials`;
			if (deduplicated.length > 0) await sql`
            INSERT INTO materials ${sql(deduplicated, [
				"id",
				"standard",
				"type",
				"title",
				"fileName",
				"fileType",
				"size",
				"driveUrl",
				"driveFileId",
				"createdAt"
			])}
          `;
		});
	} catch (e) {
		console.error("Failed to sync materials to DB:", e);
		throw e;
	}
});
var DEFAULT_SERVER_SETTINGS = {
	standards: [
		"6th",
		"7th",
		"8th",
		"9th",
		"10th",
		"11th",
		"12th"
	],
	instituteName: "Vishwa Tuition Center",
	teacherName: "Prof. Anita Sharma",
	contact: "+91 98765 43210",
	address: "12 MG Road, Bengaluru, IN",
	whatsappProvider: "manual",
	whatsappTemplatePresent: "Dear Parent, your child [student_name] was marked ✅ PRESENT at Vishwa Tuition Center today ([date]) at [time]. Regards, Vishwa Tuition Center.",
	whatsappTemplateAbsent: "Dear Parent, your child [student_name] was marked ❌ ABSENT from Vishwa Tuition Center today ([date]). Please check with them. Regards, Vishwa Tuition Center.",
	whatsappTemplateLate: "Dear Parent, your child [student_name] arrived ⏰ LATE at Vishwa Tuition Center today ([date]) at [time]. Regards, Vishwa Tuition Center.",
	whatsappTemplateWelcome: "Dear Parent, thank you for registering [student_name] at Vishwa Tuition Center. We are excited to guide them on their academic journey. Regards, Prof. Anita Sharma.",
	whatsappTemplateFeeReminder: "Dear Parent, this is a reminder that the tuition fee of Rs. [amount] for [student_name] (Std: [standard]) for [month] is pending. Please arrange payment at your earliest convenience. Regards, Vishwa Tuition Center.",
	whatsappTemplateFeeOverdue: "Dear Parent, the tuition fee of Rs. [amount] for [student_name] for [month] is overdue. Kindly clear the dues to avoid any inconvenience. Regards, Vishwa Tuition Center.",
	whatsappTemplateBirthday: "Dear Parent, Vishwa Tuition Center wishes [student_name] a very Happy Birthday! 🎉🎂 May this year bring them great success. Regards, Vishwa Tuition Center."
};
var getDbSettings_createServerFn_handler = createServerRpc({
	id: "8c314cc40ab74b642ec11974ee9e82f2bacbda17ce4c76c45f3be27fd9530a57",
	name: "getDbSettings",
	filename: "src/lib/db.ts"
}, (opts) => getDbSettings.__executeServer(opts));
var getDbSettings = createServerFn({ method: "GET" }).handler(getDbSettings_createServerFn_handler, async () => {
	const sql = await getSql();
	if (!sql) return DEFAULT_SERVER_SETTINGS;
	try {
		const rows = await sql`SELECT "value" FROM settings WHERE "key" = 'app_settings'`;
		if (rows.length === 0) return DEFAULT_SERVER_SETTINGS;
		return {
			...DEFAULT_SERVER_SETTINGS,
			...JSON.parse(rows[0].value)
		};
	} catch (e) {
		console.error("Failed to get settings from DB:", e);
		return DEFAULT_SERVER_SETTINGS;
	}
});
var syncDbSettings_createServerFn_handler = createServerRpc({
	id: "fc4cb5544d6e8ad5f1d76da0e7848034ce2a5a66a1f2da46a5074d7a3d2071af",
	name: "syncDbSettings",
	filename: "src/lib/db.ts"
}, (opts) => syncDbSettings.__executeServer(opts));
var syncDbSettings = createServerFn({ method: "POST" }).validator((settings) => settings).handler(syncDbSettings_createServerFn_handler, async ({ data: settings }) => {
	const sql = await getSql();
	if (!sql) return;
	try {
		await sql`
        INSERT INTO settings ("key", "value")
        VALUES ('app_settings', ${JSON.stringify(settings)})
        ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value"
      `;
	} catch (e) {
		console.error("Failed to sync settings to DB:", e);
		throw e;
	}
});
var sendWhatsAppAlert_createServerFn_handler = createServerRpc({
	id: "6550f40d0d6bd6fc3c0ec9ee35d7f6610d97916e42d3cfb1d876d5f5a2b88aa7",
	name: "sendWhatsAppAlert",
	filename: "src/lib/db.ts"
}, (opts) => sendWhatsAppAlert.__executeServer(opts));
var sendWhatsAppAlert = createServerFn({ method: "POST" }).validator((data) => data).handler(sendWhatsAppAlert_createServerFn_handler, async ({ data }) => {
	const settings = await getDbSettings();
	if (!settings) throw new Error("Settings not configured");
	const provider = settings.whatsappProvider || "manual";
	if (provider === "manual") return {
		success: true,
		manual: true
	};
	const { recipientPhone, studentName, status, studentId, date } = data;
	let template = "";
	if (status === "Present") template = settings.whatsappTemplatePresent || "";
	else if (status === "Absent") template = settings.whatsappTemplateAbsent || "";
	else if (status === "Welcome") template = settings.whatsappTemplateWelcome || "";
	if (!template) template = status === "Welcome" ? `Dear Parent, thank you for registering [student_name] at Vishwa Tuition Center.` : `Dear Parent, your child [student_name] was marked [status] today on [date] at [time].`;
	let formattedDate = "";
	if (date) formattedDate = date.split("-").reverse().join("/");
	else formattedDate = (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
		timeZone: "Asia/Kolkata",
		day: "2-digit",
		month: "2-digit",
		year: "numeric"
	});
	const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-IN", {
		timeZone: "Asia/Kolkata",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true
	}).toUpperCase();
	const messageText = template.replace("[student_name]", studentName).replace("[status]", status).replace("[date]", formattedDate).replace("[time]", formattedTime);
	let phone = recipientPhone.replace(/[\s\-\(\)\+]/g, "");
	if (phone.length === 10) phone = "91" + phone;
	const apiKey = settings.whatsappApiKey;
	const instanceId = settings.whatsappInstanceId;
	if (provider === "ultramsg") {
		if (!instanceId || !apiKey) throw new Error("UltraMsg credentials missing");
		const url = `https://api.ultramsg.com/${instanceId}/messages/chat`;
		const response = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				token: apiKey,
				to: phone,
				body: messageText
			})
		});
		if (!response.ok) {
			const text = await response.text();
			throw new Error(`UltraMsg returned error: ${text}`);
		}
		return {
			success: true,
			automated: true
		};
	}
	if (provider === "twilio") {
		if (!instanceId || !apiKey || !settings.whatsappSenderNumber) throw new Error("Twilio credentials missing");
		const accountSid = instanceId;
		const authToken = apiKey;
		const sender = settings.whatsappSenderNumber.replace(/[\s\-\(\)\+]/g, "");
		const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
		const auth = btoa(`${accountSid}:${authToken}`);
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Authorization": `Basic ${auth}`,
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: new URLSearchParams({
				From: `whatsapp:+${sender}`,
				To: `whatsapp:+${phone}`,
				Body: messageText
			})
		});
		if (!response.ok) {
			const text = await response.text();
			throw new Error(`Twilio returned error: ${text}`);
		}
		return {
			success: true,
			automated: true
		};
	}
	if (provider === "baileys") {
		const ws = await getWhatsAppService();
		if (!ws) throw new Error("WhatsApp service only available on server");
		if (status === "Welcome") {
			const sql = await getSql();
			let student = null;
			if (sql) {
				let rows = [];
				if (studentId) rows = await sql`SELECT * FROM students WHERE id = ${studentId}`;
				else rows = await sql`SELECT * FROM students WHERE name = ${studentName} ORDER BY "createdAt" DESC LIMIT 1`;
				if (rows.length > 0) student = rows[0];
			}
			if (student) try {
				const pdfBuffer = await ws.generateRegistrationPdf({
					instituteName: settings.instituteName || "Vishwa Tuition Center",
					address: settings.address || "",
					contact: settings.contact || "",
					student: {
						name: student.name,
						gender: student.gender,
						dob: student.dob,
						school: student.school,
						standard: student.standard,
						section: student.section,
						parentName: student.parentName,
						fatherMobile: student.fatherMobile,
						motherMobile: student.motherMobile,
						address: student.address,
						joiningDate: student.joiningDate,
						monthlyFees: Number(student.monthlyFees),
						admissionFees: Number(student.admissionFees),
						notes: student.notes || "",
						photo: student.photo || ""
					}
				});
				await ws.sendWhatsAppTextMessage(phone, messageText);
				await ws.sendWhatsAppMessageWithPDF(phone, "Admission Application Form PDF", pdfBuffer, `Application_Form_${student.name.replace(/\s+/g, "_")}.pdf`);
				await logMessage({
					type: "welcome",
					studentId: studentId || student.id,
					studentName,
					recipientPhone: phone,
					message: messageText + " [+ Application Form PDF]",
					status: "sent"
				});
				return {
					success: true,
					automated: true
				};
			} catch (pdfErr) {
				console.error("Failed to generate and send welcome registration PDF, falling back to text:", pdfErr);
			}
		}
		await ws.sendWhatsAppTextMessage(phone, messageText);
		await logMessage({
			type: status === "Welcome" ? "welcome" : "attendance",
			studentId: studentId || "",
			studentName,
			recipientPhone: phone,
			message: messageText,
			status: "sent"
		});
		return {
			success: true,
			automated: true
		};
	}
	return {
		success: false,
		error: "Unsupported provider"
	};
});
async function getWhatsAppService() {
	if (typeof window === "undefined") return await import("./whatsappService-a6xTCnnO.mjs");
	return null;
}
var getBaileysStatus_createServerFn_handler = createServerRpc({
	id: "cbb6d0a066e9cd203ec8a282513e97fef76181da468af218e37e4d6c17379f5f",
	name: "getBaileysStatus",
	filename: "src/lib/db.ts"
}, (opts) => getBaileysStatus.__executeServer(opts));
var getBaileysStatus = createServerFn({ method: "GET" }).handler(getBaileysStatus_createServerFn_handler, async () => {
	const ws = await getWhatsAppService();
	if (!ws) return {
		status: "disconnected",
		qr: ""
	};
	return ws.getWhatsAppStatus();
});
var connectBaileys_createServerFn_handler = createServerRpc({
	id: "d45ac4fa59cfed8f508f7a3df567d9c2a2498f98f204353b09ea8425b6803156",
	name: "connectBaileys",
	filename: "src/lib/db.ts"
}, (opts) => connectBaileys.__executeServer(opts));
var connectBaileys = createServerFn({ method: "POST" }).handler(connectBaileys_createServerFn_handler, async () => {
	const ws = await getWhatsAppService();
	if (!ws) return;
	await ws.initWhatsApp(true);
});
var disconnectBaileys_createServerFn_handler = createServerRpc({
	id: "d9e5634cd66743fd04ea6d7ea2e0e17257eb7e79a593574f42517290d41ce6e8",
	name: "disconnectBaileys",
	filename: "src/lib/db.ts"
}, (opts) => disconnectBaileys.__executeServer(opts));
var disconnectBaileys = createServerFn({ method: "POST" }).handler(disconnectBaileys_createServerFn_handler, async () => {
	const ws = await getWhatsAppService();
	if (!ws) return;
	await ws.disconnectWhatsApp();
});
var sendWhatsAppReceipt_createServerFn_handler = createServerRpc({
	id: "5f1038d906fe4e903f229fcadab432689aebbe3076d0dd633006d57ae6dc2dad",
	name: "sendWhatsAppReceipt",
	filename: "src/lib/db.ts"
}, (opts) => sendWhatsAppReceipt.__executeServer(opts));
var sendWhatsAppReceipt = createServerFn({ method: "POST" }).validator((data) => data).handler(sendWhatsAppReceipt_createServerFn_handler, async ({ data }) => {
	const ws = await getWhatsAppService();
	if (!ws) throw new Error("Server only function");
	const settings = await getDbSettings();
	if (!settings) throw new Error("Settings not configured");
	const sql = await getSql();
	if (!sql) throw new Error("Database not connected");
	const studentRows = await sql`SELECT * FROM students WHERE id = ${data.studentId}`;
	if (studentRows.length === 0) throw new Error("Student not found");
	const s = studentRows[0];
	const feeRows = await sql`SELECT * FROM fees WHERE id = ${data.feeId}`;
	if (feeRows.length === 0) throw new Error("Fee record not found");
	const f = feeRows[0];
	const parentMobile = s.fatherMobile || s.motherMobile;
	if (!parentMobile) throw new Error("No parent mobile number registered");
	const pdfBuffer = await ws.generateReceiptPdf({
		instituteName: settings.instituteName || "Vishwa Tuition Center",
		address: settings.address || "",
		contact: settings.contact || "",
		studentName: s.name,
		standard: s.standard,
		section: s.section,
		month: f.month,
		amount: Number(f.amount),
		paidAmount: Number(f.paidAmount),
		paidDate: f.paidDate || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
		receiptId: f.id
	});
	const formatCurrency = (val) => `Rs. ${val.toLocaleString()}`;
	const textMessage = `Dear Parent, please find attached the fee receipt for ${s.name} for the month of ${f.month}.\n\nAmount Paid: ${formatCurrency(Number(f.paidAmount))}\nStatus: ${Number(f.amount) - Number(f.paidAmount) <= 0 ? "Paid" : "Partially Paid"}\nReceipt ID: ${f.id.slice(0, 8).toUpperCase()}\n\nThank you,\n${settings.instituteName || "Vishwa Tuition Center"}`;
	await ws.sendWhatsAppTextMessage(parentMobile, textMessage);
	await ws.sendWhatsAppMessageWithPDF(parentMobile, "Fee Payment Receipt PDF", pdfBuffer, `Receipt_${f.id.slice(0, 8).toUpperCase()}.pdf`);
	await logMessage({
		type: "fee_receipt",
		studentId: s.id,
		studentName: s.name,
		recipientPhone: parentMobile,
		message: textMessage + " [+ Fee Receipt PDF]",
		status: "sent"
	});
	return { success: true };
});
async function logMessage(data) {
	const sql = await getSql();
	if (!sql) return;
	const id = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
	try {
		await sql`
      INSERT INTO message_logs ("id", "type", "studentId", "studentName", "recipientPhone", "message", "status", "error", "timestamp")
      VALUES (${id}, ${data.type}, ${data.studentId}, ${data.studentName}, ${data.recipientPhone}, ${data.message}, ${data.status}, ${data.error || null}, ${(/* @__PURE__ */ new Date()).toISOString()})
    `;
	} catch (err) {
		console.error("[MessageLog] Failed to log message:", err);
	}
}
var getMessageLogs_createServerFn_handler = createServerRpc({
	id: "d6ac73139492144ab665712d21dbfe25698970e7bee47dc17360cdfbe8c367f2",
	name: "getMessageLogs",
	filename: "src/lib/db.ts"
}, (opts) => getMessageLogs.__executeServer(opts));
var getMessageLogs = createServerFn({ method: "POST" }).validator((data) => data).handler(getMessageLogs_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	if (!sql) return {
		logs: [],
		total: 0
	};
	const limit = data.limit || 50;
	const offset = data.offset || 0;
	let logs;
	let countResult;
	if (data.type && data.status) {
		logs = await sql`SELECT * FROM message_logs WHERE "type" = ${data.type} AND "status" = ${data.status} ORDER BY "timestamp" DESC LIMIT ${limit} OFFSET ${offset}`;
		countResult = await sql`SELECT COUNT(*) as count FROM message_logs WHERE "type" = ${data.type} AND "status" = ${data.status}`;
	} else if (data.type) {
		logs = await sql`SELECT * FROM message_logs WHERE "type" = ${data.type} ORDER BY "timestamp" DESC LIMIT ${limit} OFFSET ${offset}`;
		countResult = await sql`SELECT COUNT(*) as count FROM message_logs WHERE "type" = ${data.type}`;
	} else if (data.status) {
		logs = await sql`SELECT * FROM message_logs WHERE "status" = ${data.status} ORDER BY "timestamp" DESC LIMIT ${limit} OFFSET ${offset}`;
		countResult = await sql`SELECT COUNT(*) as count FROM message_logs WHERE "status" = ${data.status}`;
	} else {
		logs = await sql`SELECT * FROM message_logs ORDER BY "timestamp" DESC LIMIT ${limit} OFFSET ${offset}`;
		countResult = await sql`SELECT COUNT(*) as count FROM message_logs`;
	}
	return {
		logs: logs.map((r) => ({
			id: r.id,
			type: r.type,
			studentId: r.studentId,
			studentName: r.studentName,
			recipientPhone: r.recipientPhone,
			message: r.message,
			status: r.status,
			error: r.error || void 0,
			timestamp: r.timestamp
		})),
		total: Number(countResult[0]?.count || 0)
	};
});
var getMessageLogStats_createServerFn_handler = createServerRpc({
	id: "6cd6b42355a0e909586427fea7b9d4ced6e3da0d6b7bca7d5b72d2e8b90347c3",
	name: "getMessageLogStats",
	filename: "src/lib/db.ts"
}, (opts) => getMessageLogStats.__executeServer(opts));
var getMessageLogStats = createServerFn({ method: "GET" }).handler(getMessageLogStats_createServerFn_handler, async () => {
	const sql = await getSql();
	if (!sql) return {
		total: 0,
		sent: 0,
		failed: 0,
		today: 0,
		byType: {}
	};
	const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const totalR = await sql`SELECT COUNT(*) as c FROM message_logs`;
	const sentR = await sql`SELECT COUNT(*) as c FROM message_logs WHERE "status" = 'sent'`;
	const failedR = await sql`SELECT COUNT(*) as c FROM message_logs WHERE "status" = 'failed'`;
	const todayR = await sql`SELECT COUNT(*) as c FROM message_logs WHERE "timestamp" >= ${today}`;
	const byTypeR = await sql`SELECT "type", COUNT(*) as c FROM message_logs GROUP BY "type"`;
	const byType = {};
	byTypeR.forEach((r) => {
		byType[r.type] = Number(r.c);
	});
	return {
		total: Number(totalR[0]?.c || 0),
		sent: Number(sentR[0]?.c || 0),
		failed: Number(failedR[0]?.c || 0),
		today: Number(todayR[0]?.c || 0),
		byType
	};
});
var deleteDbMessageLog_createServerFn_handler = createServerRpc({
	id: "05e0065d3f1de2545dd11c7aa8919eb8910c8c515ddb9710ffda28d7d082155b",
	name: "deleteDbMessageLog",
	filename: "src/lib/db.ts"
}, (opts) => deleteDbMessageLog.__executeServer(opts));
var deleteDbMessageLog = createServerFn({ method: "POST" }).validator((id) => id).handler(deleteDbMessageLog_createServerFn_handler, async ({ data: id }) => {
	const sql = await getSql();
	if (!sql) return { success: false };
	try {
		await sql`DELETE FROM message_logs WHERE "id" = ${id}`;
		return { success: true };
	} catch (e) {
		console.error("Failed to delete message log from DB:", e);
		throw e;
	}
});
var clearAllDbMessageLogs_createServerFn_handler = createServerRpc({
	id: "11742a2342af451ac969619af62aa2e61035f77409c43f46eded95c7339afcf7",
	name: "clearAllDbMessageLogs",
	filename: "src/lib/db.ts"
}, (opts) => clearAllDbMessageLogs.__executeServer(opts));
var clearAllDbMessageLogs = createServerFn({ method: "POST" }).handler(clearAllDbMessageLogs_createServerFn_handler, async () => {
	const sql = await getSql();
	if (!sql) return { success: false };
	try {
		await sql`DELETE FROM message_logs`;
		return { success: true };
	} catch (e) {
		console.error("Failed to clear message logs from DB:", e);
		throw e;
	}
});
var sendBulkAttendanceAlerts_createServerFn_handler = createServerRpc({
	id: "f11fad9f43e85b657fad11ff47a766ff43b8fb7a7fbf9d27c6e4df239a262bf1",
	name: "sendBulkAttendanceAlerts",
	filename: "src/lib/db.ts"
}, (opts) => sendBulkAttendanceAlerts.__executeServer(opts));
var sendBulkAttendanceAlerts = createServerFn({ method: "POST" }).validator((data) => data).handler(sendBulkAttendanceAlerts_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	if (!sql) throw new Error("Database not connected");
	const settings = await getDbSettings();
	if (!settings) throw new Error("Settings not configured");
	const provider = settings.whatsappProvider || "manual";
	if (provider === "manual") return {
		success: true,
		manual: true,
		sent: 0
	};
	const ws = await getWhatsAppService();
	if (!ws) throw new Error("WhatsApp service not available");
	let attendanceRecords;
	if (data.standard && data.standard !== "all") attendanceRecords = await sql`
        SELECT a.*, s.name, s."fatherMobile", s."motherMobile", s.standard, s.section, s.id as sid
        FROM attendance a
        JOIN students s ON a."studentId" = s.id
        WHERE a.date = ${data.date} AND s.standard = ${data.standard}
      `;
	else attendanceRecords = await sql`
        SELECT a.*, s.name, s."fatherMobile", s."motherMobile", s.standard, s.section, s.id as sid
        FROM attendance a
        JOIN students s ON a."studentId" = s.id
        WHERE a.date = ${data.date}
      `;
	let sentCount = 0;
	let failedCount = 0;
	const timeStr = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-IN", {
		timeZone: "Asia/Kolkata",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true
	}).toUpperCase();
	const MONTHS = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	];
	const parts = data.date.split("-");
	const dateStr = `${parseInt(parts[2], 10)} ${MONTHS[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
	for (const rec of attendanceRecords) {
		const parentMobile = rec.fatherMobile || rec.motherMobile;
		if (!parentMobile) continue;
		let template = "";
		if (rec.status === "Present") template = settings.whatsappTemplatePresent || "Dear Parent, your child [student_name] was marked ✅ PRESENT at Vishwa Tuition Center today ([date]) at [time]. Regards, Vishwa Tuition Center.";
		else if (rec.status === "Absent") template = settings.whatsappTemplateAbsent || "Dear Parent, your child [student_name] was marked ❌ ABSENT from Vishwa Tuition Center today ([date]). Please check with them. Regards, Vishwa Tuition Center.";
		else if (rec.status === "Late") template = settings.whatsappTemplateLate || "Dear Parent, your child [student_name] arrived ⏰ LATE at Vishwa Tuition Center today ([date]) at [time]. Regards, Vishwa Tuition Center.";
		else continue;
		const messageText = template.replace("[student_name]", rec.name).replace("[date]", dateStr).replace("[time]", timeStr);
		try {
			if (provider === "baileys") await ws.sendWhatsAppTextMessage(parentMobile, messageText);
			await logMessage({
				type: "attendance",
				studentId: rec.sid,
				studentName: rec.name,
				recipientPhone: parentMobile,
				message: messageText,
				status: "sent"
			});
			sentCount++;
		} catch (err) {
			await logMessage({
				type: "attendance",
				studentId: rec.sid,
				studentName: rec.name,
				recipientPhone: parentMobile,
				message: messageText,
				status: "failed",
				error: err.message || String(err)
			});
			failedCount++;
		}
		await new Promise((r) => setTimeout(r, 1500));
	}
	return {
		success: true,
		sent: sentCount,
		failed: failedCount
	};
});
var sendMonthlyFeeReminders_createServerFn_handler = createServerRpc({
	id: "99219519f29c1519dfba38ef3cc31f42d06d7dba6bfecedeef3d0b70e7a0af8e",
	name: "sendMonthlyFeeReminders",
	filename: "src/lib/db.ts"
}, (opts) => sendMonthlyFeeReminders.__executeServer(opts));
var sendMonthlyFeeReminders = createServerFn({ method: "POST" }).validator((data) => data).handler(sendMonthlyFeeReminders_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	if (!sql) throw new Error("Database not connected");
	const settings = await getDbSettings();
	if (!settings) throw new Error("Settings not configured");
	const provider = settings.whatsappProvider || "manual";
	if (provider === "manual") return {
		success: true,
		manual: true,
		sent: 0
	};
	const ws = await getWhatsAppService();
	if (!ws) throw new Error("WhatsApp service not available");
	const students = await sql`SELECT * FROM students`;
	const paidFees = await sql`SELECT * FROM fees WHERE month = ${data.month} AND status = 'Paid'`;
	const paidStudentIds = new Set(paidFees.map((f) => f.studentId));
	const unpaidStudents = students.filter((s) => !paidStudentIds.has(s.id));
	let sentCount = 0;
	let failedCount = 0;
	const template = settings.whatsappTemplateFeeReminder || "Dear Parent, this is a reminder that the tuition fee of Rs. [amount] for [student_name] (Std: [standard]) for [month] is pending. Please arrange payment at your earliest convenience. Regards, Vishwa Tuition Center.";
	const monthLabel = (/* @__PURE__ */ new Date(data.month + "-01")).toLocaleDateString("en-IN", {
		month: "long",
		year: "numeric"
	});
	for (const s of unpaidStudents) {
		const parentMobile = s.fatherMobile || s.motherMobile;
		if (!parentMobile) continue;
		const messageText = template.replace("[student_name]", s.name).replace("[amount]", String(s.monthlyFees)).replace("[standard]", s.standard).replace("[month]", monthLabel);
		try {
			if (provider === "baileys") await ws.sendWhatsAppTextMessage(parentMobile, messageText);
			await logMessage({
				type: "fee_reminder",
				studentId: s.id,
				studentName: s.name,
				recipientPhone: parentMobile,
				message: messageText,
				status: "sent"
			});
			sentCount++;
		} catch (err) {
			await logMessage({
				type: "fee_reminder",
				studentId: s.id,
				studentName: s.name,
				recipientPhone: parentMobile,
				message: messageText,
				status: "failed",
				error: err.message || String(err)
			});
			failedCount++;
		}
		await new Promise((r) => setTimeout(r, 1500));
	}
	return {
		success: true,
		sent: sentCount,
		failed: failedCount,
		total: unpaidStudents.length
	};
});
var sendFeeOverdueReminders_createServerFn_handler = createServerRpc({
	id: "db76bd9ccdccbb8a7e6332fd5566a2173747a8996054e5e01fdefd78a5a7ac1e",
	name: "sendFeeOverdueReminders",
	filename: "src/lib/db.ts"
}, (opts) => sendFeeOverdueReminders.__executeServer(opts));
var sendFeeOverdueReminders = createServerFn({ method: "POST" }).validator((data) => data).handler(sendFeeOverdueReminders_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	if (!sql) throw new Error("Database not connected");
	const settings = await getDbSettings();
	if (!settings) throw new Error("Settings not configured");
	const provider = settings.whatsappProvider || "manual";
	if (provider === "manual") return {
		success: true,
		manual: true,
		sent: 0
	};
	const ws = await getWhatsAppService();
	if (!ws) throw new Error("WhatsApp service not available");
	const overdueFees = await sql`
      SELECT f.*, s.name, s."fatherMobile", s."motherMobile", s.standard
      FROM fees f
      JOIN students s ON f."studentId" = s.id
      WHERE f.month = ${data.month} AND f.status != 'Paid'
    `;
	const allStudents = await sql`SELECT * FROM students`;
	const feeStudentIds = await sql`SELECT DISTINCT "studentId" FROM fees WHERE month = ${data.month}`;
	const hasFeesIds = new Set(feeStudentIds.map((r) => r.studentId));
	const noRecordStudents = allStudents.filter((s) => !hasFeesIds.has(s.id));
	let sentCount = 0;
	let failedCount = 0;
	const template = settings.whatsappTemplateFeeOverdue || "Dear Parent, the tuition fee of Rs. [amount] for [student_name] for [month] is overdue. Kindly clear the dues to avoid any inconvenience. Regards, Vishwa Tuition Center.";
	const monthLabel = (/* @__PURE__ */ new Date(data.month + "-01")).toLocaleDateString("en-IN", {
		month: "long",
		year: "numeric"
	});
	const allOverdue = [...overdueFees.map((f) => ({
		id: f.studentId,
		name: f.name,
		fatherMobile: f.fatherMobile,
		motherMobile: f.motherMobile,
		monthlyFees: f.amount,
		standard: f.standard
	})), ...noRecordStudents.map((s) => ({
		id: s.id,
		name: s.name,
		fatherMobile: s.fatherMobile,
		motherMobile: s.motherMobile,
		monthlyFees: s.monthlyFees,
		standard: s.standard
	}))];
	for (const s of allOverdue) {
		const parentMobile = s.fatherMobile || s.motherMobile;
		if (!parentMobile) continue;
		const messageText = template.replace("[student_name]", s.name).replace("[amount]", String(s.monthlyFees)).replace("[month]", monthLabel);
		try {
			if (provider === "baileys") await ws.sendWhatsAppTextMessage(parentMobile, messageText);
			await logMessage({
				type: "fee_overdue",
				studentId: s.id,
				studentName: s.name,
				recipientPhone: parentMobile,
				message: messageText,
				status: "sent"
			});
			sentCount++;
		} catch (err) {
			await logMessage({
				type: "fee_overdue",
				studentId: s.id,
				studentName: s.name,
				recipientPhone: parentMobile,
				message: messageText,
				status: "failed",
				error: err.message || String(err)
			});
			failedCount++;
		}
		await new Promise((r) => setTimeout(r, 1500));
	}
	return {
		success: true,
		sent: sentCount,
		failed: failedCount
	};
});
var checkAndSendBirthdayWishes_createServerFn_handler = createServerRpc({
	id: "79989711839cf161caae6860a1ec23a58954010c75ddf7e7435ffa11ff4204b0",
	name: "checkAndSendBirthdayWishes",
	filename: "src/lib/db.ts"
}, (opts) => checkAndSendBirthdayWishes.__executeServer(opts));
var checkAndSendBirthdayWishes = createServerFn({ method: "POST" }).handler(checkAndSendBirthdayWishes_createServerFn_handler, async () => {
	const sql = await getSql();
	if (!sql) throw new Error("Database not connected");
	const settings = await getDbSettings();
	if (!settings) throw new Error("Settings not configured");
	const provider = settings.whatsappProvider || "manual";
	if (provider === "manual") return {
		success: true,
		manual: true,
		sent: 0
	};
	const ws = await getWhatsAppService();
	if (!ws) throw new Error("WhatsApp service not available");
	const today = /* @__PURE__ */ new Date();
	const todayMD = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
	const birthdayStudents = (await sql`SELECT * FROM students`).filter((s) => {
		if (!s.dob) return false;
		const dob = new Date(s.dob);
		return `${String(dob.getMonth() + 1).padStart(2, "0")}-${String(dob.getDate()).padStart(2, "0")}` === todayMD;
	});
	let sentCount = 0;
	let failedCount = 0;
	const template = settings.whatsappTemplateBirthday || "Dear Parent, Vishwa Tuition Center wishes [student_name] a very Happy Birthday! 🎉🎂 May this year bring them great success. Regards, Vishwa Tuition Center.";
	for (const s of birthdayStudents) {
		const parentMobile = s.fatherMobile || s.motherMobile;
		if (!parentMobile) continue;
		const messageText = template.replace("[student_name]", s.name);
		try {
			if (provider === "baileys") await ws.sendWhatsAppTextMessage(parentMobile, messageText);
			await logMessage({
				type: "birthday",
				studentId: s.id,
				studentName: s.name,
				recipientPhone: parentMobile,
				message: messageText,
				status: "sent"
			});
			sentCount++;
		} catch (err) {
			await logMessage({
				type: "birthday",
				studentId: s.id,
				studentName: s.name,
				recipientPhone: parentMobile,
				message: messageText,
				status: "failed",
				error: err.message || String(err)
			});
			failedCount++;
		}
		await new Promise((r) => setTimeout(r, 1500));
	}
	return {
		success: true,
		sent: sentCount,
		failed: failedCount,
		birthdaysFound: birthdayStudents.length
	};
});
//#endregion
export { checkAndSendBirthdayWishes_createServerFn_handler, clearAllDbMessageLogs_createServerFn_handler, connectBaileys_createServerFn_handler, deleteDbMessageLog_createServerFn_handler, disconnectBaileys_createServerFn_handler, getBaileysStatus_createServerFn_handler, getDbAttendance_createServerFn_handler, getDbFees_createServerFn_handler, getDbMaterials_createServerFn_handler, getDbSettings_createServerFn_handler, getDbStudents_createServerFn_handler, getMessageLogStats_createServerFn_handler, getMessageLogs_createServerFn_handler, isDbConfigured_createServerFn_handler, sendBulkAttendanceAlerts_createServerFn_handler, sendFeeOverdueReminders_createServerFn_handler, sendMonthlyFeeReminders_createServerFn_handler, sendWhatsAppAlert_createServerFn_handler, sendWhatsAppReceipt_createServerFn_handler, syncDbAttendance_createServerFn_handler, syncDbFees_createServerFn_handler, syncDbMaterials_createServerFn_handler, syncDbSettings_createServerFn_handler, syncDbStudents_createServerFn_handler };
