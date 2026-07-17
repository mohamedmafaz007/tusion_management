import { createServerFn } from "@tanstack/react-start";
import type { Student, AttendanceRecord, FeePayment, Material, AppSettings, MessageLog, MessageType } from "./types";

// Only initialize database connection on server-side
const isServer = typeof window === "undefined";

let cachedSql: any = null;

async function getSql() {
  if (typeof window !== "undefined") return null;
  if (cachedSql) return cachedSql;

  const connectionString = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL;
  if (!connectionString) return null;

  try {
    const { default: postgres } = await import("postgres");
    cachedSql = postgres(connectionString.replace(/^["']|["']$/g, ""), {
      ssl: "require",
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });
    return cachedSql;
  } catch (err) {
    console.error("Failed to dynamically import postgres driver:", err);
    return null;
  }
}

export async function initDb() {
  const sql = await getSql();
  if (!sql) {
    console.log("Database connection string not configured. Skipping initialization.");
    return;
  }

  try {
    // Check if we need to migrate from the old skeleton schema to the full schema
    const schemaCheck = await sql`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'students' AND column_name = 'gender'
    `;
    
    if (schemaCheck.length === 0) {
      console.log("Migrating database schemas to match TypeScript interfaces...");
      await sql`DROP TABLE IF EXISTS students CASCADE`;
      await sql`DROP TABLE IF EXISTS attendance CASCADE`;
      await sql`DROP TABLE IF EXISTS fees CASCADE`;
      await sql`DROP TABLE IF EXISTS materials CASCADE`;
      await sql`DROP TABLE IF EXISTS settings CASCADE`;
    }

    // 1. Students table
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

    // 2. Attendance table
    await sql`
      CREATE TABLE IF NOT EXISTS attendance (
        "id" TEXT PRIMARY KEY,
        "studentId" TEXT NOT NULL,
        "date" TEXT NOT NULL,
        "status" TEXT NOT NULL,
        "remarks" TEXT
      )
    `;

    // 3. Fees table
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

    // 4. Materials table
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

    // 5. Settings table
    await sql`
      CREATE TABLE IF NOT EXISTS settings (
        "key" TEXT PRIMARY KEY,
        "value" TEXT NOT NULL
      )
    `;

    // 6. Message Logs table
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

// Run initialization as a side-effect on load
if (isServer) {
  initDb();
}

// --- Server Configuration Checks ---
export const isDbConfigured = createServerFn({ method: "GET" })
  .handler(async () => {
    const connectionString = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL;
    return !!connectionString;
  });

// --- Server Functions for Students ---
export const getDbStudents = createServerFn({ method: "GET" })
  .handler(async () => {
    const sql = await getSql();
    if (!sql) return [] as Student[];
    try {
      const rows = await sql`SELECT * FROM students`;
      return rows.map(r => ({
        id: r.id as string,
        photo: r.photo as string | undefined,
        name: r.name as string,
        gender: r.gender as any,
        dob: r.dob as string,
        school: r.school as string,
        standard: r.standard as any,
        section: r.section as string,
        parentName: r.parentName as string,
        fatherMobile: r.fatherMobile as string,
        motherMobile: r.motherMobile as string,
        address: r.address as string,
        joiningDate: r.joiningDate as string,
        monthlyFees: Number(r.monthlyFees),
        admissionFees: Number(r.admissionFees),
        notes: r.notes as string | undefined,
        createdAt: r.createdAt as string
      })) as Student[];
    } catch (e) {
      console.error("Failed to get students from DB:", e);
      return [] as Student[];
    }
  });

export const syncDbStudents = createServerFn({ method: "POST" })
  .validator((students: any[]) => students)
  .handler(async ({ data: students }) => {
    const sql = await getSql();
    if (!sql) return;

    const sanitized = students.map(s => ({
      id: s.id || "",
      photo: s.photo === undefined ? null : s.photo,
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
      monthlyFees: s.monthlyFees === undefined ? 0 : Number(s.monthlyFees),
      admissionFees: s.admissionFees === undefined ? 0 : Number(s.admissionFees),
      notes: s.notes === undefined ? null : s.notes,
      createdAt: s.createdAt || new Date().toISOString()
    }));

    // Deduplicate by id to prevent unique constraint violations
    const uniqueStudents = new Map<string, typeof sanitized[0]>();
    for (const item of sanitized) {
      if (item.id) {
        uniqueStudents.set(item.id, item);
      }
    }
    const deduplicated = Array.from(uniqueStudents.values());

    try {
      await sql.begin(async (sql: any) => {
        await sql`DELETE FROM students`;
        if (deduplicated.length > 0) {
          await sql`
            INSERT INTO students ${(sql as any)(deduplicated, ["id", "photo", "name", "gender", "dob", "school", "standard", "section", "parentName", "fatherMobile", "motherMobile", "address", "joiningDate", "monthlyFees", "admissionFees", "notes", "createdAt"])}
          `;
        }
      });
    } catch (e) {
      console.error("Failed to sync students to DB:", e);
      throw e;
    }
  });

// --- Server Functions for Attendance ---
export const getDbAttendance = createServerFn({ method: "GET" })
  .handler(async () => {
    const sql = await getSql();
    if (!sql) return [] as AttendanceRecord[];
    try {
      const rows = await sql`SELECT * FROM attendance`;
      return rows.map(r => ({
        id: r.id as string,
        studentId: r.studentId as string,
        date: r.date as string,
        status: r.status as any,
        remarks: r.remarks as string | undefined
      })) as AttendanceRecord[];
    } catch (e) {
      console.error("Failed to get attendance from DB:", e);
      return [] as AttendanceRecord[];
    }
  });

export const syncDbAttendance = createServerFn({ method: "POST" })
  .validator((attendance: any[]) => attendance)
  .handler(async ({ data: attendance }) => {
    const sql = await getSql();
    if (!sql) return;

    const sanitized = attendance.map(a => ({
      id: a.id || "",
      studentId: a.studentId || "",
      date: a.date || "",
      status: a.status || "Present",
      remarks: a.remarks === undefined ? null : a.remarks
    }));

    // Deduplicate by id to prevent unique constraint violations
    const uniqueAttendance = new Map<string, typeof sanitized[0]>();
    for (const item of sanitized) {
      if (item.id) {
        uniqueAttendance.set(item.id, item);
      }
    }
    const deduplicated = Array.from(uniqueAttendance.values());

    try {
      await sql.begin(async (sql: any) => {
        await sql`DELETE FROM attendance`;
        if (deduplicated.length > 0) {
          await sql`
            INSERT INTO attendance ${(sql as any)(deduplicated, ["id", "studentId", "date", "status", "remarks"])}
          `;
        }
      });
    } catch (e) {
      console.error("Failed to sync attendance to DB:", e);
      throw e;
    }
  });

// --- Server Functions for Fees ---
export const getDbFees = createServerFn({ method: "GET" })
  .handler(async () => {
    const sql = await getSql();
    if (!sql) return [] as FeePayment[];
    try {
      const rows = await sql`SELECT * FROM fees`;
      return rows.map(r => ({
        id: r.id as string,
        studentId: r.studentId as string,
        month: r.month as string,
        amount: Number(r.amount),
        paidAmount: Number(r.paidAmount),
        paidDate: r.paidDate as string | undefined,
        status: r.status as any
      })) as FeePayment[];
    } catch (e) {
      console.error("Failed to get fees from DB:", e);
      return [] as FeePayment[];
    }
  });

export const syncDbFees = createServerFn({ method: "POST" })
  .validator((fees: any[]) => fees)
  .handler(async ({ data: fees }) => {
    const sql = await getSql();
    if (!sql) return;

    const sanitized = fees.map(f => ({
      id: f.id || "",
      studentId: f.studentId || "",
      month: f.month || "",
      amount: f.amount === undefined ? 0 : Number(f.amount),
      paidAmount: f.paidAmount === undefined ? 0 : Number(f.paidAmount),
      paidDate: f.paidDate === undefined ? null : f.paidDate,
      status: f.status || "Pending"
    }));

    // Deduplicate by id to prevent unique constraint violations
    const uniqueFees = new Map<string, typeof sanitized[0]>();
    for (const item of sanitized) {
      if (item.id) {
        uniqueFees.set(item.id, item);
      }
    }
    const deduplicated = Array.from(uniqueFees.values());

    try {
      await sql.begin(async (sql: any) => {
        await sql`DELETE FROM fees`;
        if (deduplicated.length > 0) {
          await sql`
            INSERT INTO fees ${(sql as any)(deduplicated, ["id", "studentId", "month", "amount", "paidAmount", "paidDate", "status"])}
          `;
        }
      });
    } catch (e) {
      console.error("Failed to sync fees to DB:", e);
      throw e;
    }
  });

// --- Server Functions for Materials ---
export const getDbMaterials = createServerFn({ method: "GET" })
  .handler(async () => {
    const sql = await getSql();
    if (!sql) return [] as Material[];
    try {
      const rows = await sql`SELECT * FROM materials`;
      return rows.map(r => ({
        id: r.id as string,
        standard: r.standard as any,
        type: r.type as any,
        title: r.title as string,
        fileName: r.fileName as string,
        fileType: r.fileType as string,
        size: Number(r.size),
        driveUrl: r.driveUrl as string,
        driveFileId: r.driveFileId as string,
        createdAt: r.createdAt as string
      })) as Material[];
    } catch (e) {
      console.error("Failed to get materials from DB:", e);
      return [] as Material[];
    }
  });

export const syncDbMaterials = createServerFn({ method: "POST" })
  .validator((materials: any[]) => materials)
  .handler(async ({ data: materials }) => {
    const sql = await getSql();
    if (!sql) return;

    const sanitized = materials.map(m => ({
      id: m.id || "",
      standard: m.standard || "8th",
      type: m.type || "Notes",
      title: m.title || "",
      fileName: m.fileName || "",
      fileType: m.fileType || "",
      size: m.size === undefined ? 0 : Number(m.size),
      driveUrl: m.driveUrl === undefined ? "" : m.driveUrl,
      driveFileId: m.driveFileId === undefined ? "" : m.driveFileId,
      createdAt: m.createdAt || new Date().toISOString()
    }));

    // Deduplicate by id to prevent unique constraint violations
    const uniqueMaterials = new Map<string, typeof sanitized[0]>();
    for (const item of sanitized) {
      if (item.id) {
        uniqueMaterials.set(item.id, item);
      }
    }
    const deduplicated = Array.from(uniqueMaterials.values());

    try {
      await sql.begin(async (sql: any) => {
        await sql`DELETE FROM materials`;
        if (deduplicated.length > 0) {
          await sql`
            INSERT INTO materials ${(sql as any)(deduplicated, ["id", "standard", "type", "title", "fileName", "fileType", "size", "driveUrl", "driveFileId", "createdAt"])}
          `;
        }
      });
    } catch (e) {
      console.error("Failed to sync materials to DB:", e);
      throw e;
    }
  });

const DEFAULT_SERVER_SETTINGS = {
  standards: ["6th", "7th", "8th", "9th", "10th", "11th", "12th"],
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
  whatsappTemplateBirthday: "Dear Parent, Vishwa Tuition Center wishes [student_name] a very Happy Birthday! 🎉🎂 May this year bring them great success. Regards, Vishwa Tuition Center.",
};

// --- Server Functions for Settings ---
export const getDbSettings = createServerFn({ method: "GET" })
  .handler(async () => {
    const sql = await getSql();
    if (!sql) return DEFAULT_SERVER_SETTINGS as AppSettings;
    try {
      const rows = await sql`SELECT "value" FROM settings WHERE "key" = 'app_settings'`;
      if (rows.length === 0) return DEFAULT_SERVER_SETTINGS as AppSettings;
      return { ...DEFAULT_SERVER_SETTINGS, ...JSON.parse(rows[0].value) } as AppSettings;
    } catch (e) {
      console.error("Failed to get settings from DB:", e);
      return DEFAULT_SERVER_SETTINGS as AppSettings;
    }
  });

export const syncDbSettings = createServerFn({ method: "POST" })
  .validator((settings: any) => settings)
  .handler(async ({ data: settings }) => {
    const sql = await getSql();
    if (!sql) return;
    try {
      const valueStr = JSON.stringify(settings);
      await sql`
        INSERT INTO settings ("key", "value")
        VALUES ('app_settings', ${valueStr})
        ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value"
      `;
    } catch (e) {
      console.error("Failed to sync settings to DB:", e);
      throw e;
    }
  });

// --- Server Functions for WhatsApp notifications ---
export const sendWhatsAppAlert = createServerFn({ method: "POST" })
  .validator((data: { 
    recipientPhone: string; 
    studentName: string; 
    status: string; 
    studentId?: string;
    date?: string;
  }) => data)
  .handler(async ({ data }) => {
    const settings = await getDbSettings();
    if (!settings) throw new Error("Settings not configured");

    const provider = settings.whatsappProvider || "manual";
    if (provider === "manual") {
      return { success: true, manual: true };
    }

    const { recipientPhone, studentName, status, studentId, date } = data;
    
    let template = "";
    if (status === "Present") {
      template = settings.whatsappTemplatePresent || "";
    } else if (status === "Absent") {
      template = settings.whatsappTemplateAbsent || "";
    } else if (status === "Welcome") {
      template = settings.whatsappTemplateWelcome || "";
    }
      
    if (!template) {
      template = status === "Welcome"
        ? `Dear Parent, thank you for registering [student_name] at Vishwa Tuition Center.`
        : `Dear Parent, your child [student_name] was marked [status] today on [date] at [time].`;
    }

    // Format the date/time
    let formattedDate = "";
    if (date) {
      // YYYY-MM-DD -> DD/MM/YYYY
      formattedDate = date.split("-").reverse().join("/");
    } else {
      formattedDate = new Date().toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    }

    const formattedTime = new Date().toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }).toUpperCase();

    const messageText = template
      .replace("[student_name]", studentName)
      .replace("[status]", status)
      .replace("[date]", formattedDate)
      .replace("[time]", formattedTime);

    // Clean phone number: keep only digits
    let phone = recipientPhone.replace(/[\s\-\(\)\+]/g, "");
    if (phone.length === 10) {
      phone = "91" + phone;
    }

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
      return { success: true, automated: true };
    }

    if (provider === "twilio") {
      if (!instanceId || !apiKey || !settings.whatsappSenderNumber) {
        throw new Error("Twilio credentials missing");
      }
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
      return { success: true, automated: true };
    }

    if (provider === "baileys") {
      const ws = await getWhatsAppService();
      if (!ws) throw new Error("WhatsApp service only available on server");

      if (status === "Welcome") {
        const sql = await getSql();
        let student = null;
        if (sql) {
          let rows = [];
          if (studentId) {
            rows = await sql`SELECT * FROM students WHERE id = ${studentId}`;
          } else {
            rows = await sql`SELECT * FROM students WHERE name = ${studentName} ORDER BY "createdAt" DESC LIMIT 1`;
          }
          if (rows.length > 0) {
            student = rows[0];
          }
        }

        if (student) {
          try {
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

            // Send the welcome greeting text first
            await ws.sendWhatsAppTextMessage(phone, messageText);

            // Send the filled PDF application form second
            await ws.sendWhatsAppMessageWithPDF(
              phone,
              "Admission Application Form PDF",
              pdfBuffer,
              `Application_Form_${student.name.replace(/\s+/g, "_")}.pdf`
            );
            await logMessage({ type: "welcome", studentId: studentId || student.id, studentName: studentName, recipientPhone: phone, message: messageText + " [+ Application Form PDF]", status: "sent" });
            return { success: true, automated: true };
          } catch (pdfErr) {
            console.error("Failed to generate and send welcome registration PDF, falling back to text:", pdfErr);
          }
        }
      }

      await ws.sendWhatsAppTextMessage(phone, messageText);
      const msgType = status === "Welcome" ? "welcome" : "attendance";
      await logMessage({ type: msgType as MessageType, studentId: studentId || "", studentName, recipientPhone: phone, message: messageText, status: "sent" });
      return { success: true, automated: true };
    }

    return { success: false, error: "Unsupported provider" };
  });

// --- Server Functions for Baileys ---
async function getWhatsAppService() {
  if (typeof window === "undefined") {
    return await import("./whatsappService");
  }
  return null;
}

export const getBaileysStatus = createServerFn({ method: "GET" })
  .handler(async () => {
    const ws = await getWhatsAppService();
    if (!ws) return { status: "disconnected" as const, qr: "" };
    return ws.getWhatsAppStatus();
  });

export const connectBaileys = createServerFn({ method: "POST" })
  .handler(async () => {
    const ws = await getWhatsAppService();
    if (!ws) return;
    await ws.initWhatsApp(true);
  });

export const disconnectBaileys = createServerFn({ method: "POST" })
  .handler(async () => {
    const ws = await getWhatsAppService();
    if (!ws) return;
    await ws.disconnectWhatsApp();
  });

export const sendWhatsAppReceipt = createServerFn({ method: "POST" })
  .validator((data: { studentId: string; feeId: string }) => data)
  .handler(async ({ data }) => {
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

    const parentPhones = [s.fatherMobile, s.motherMobile].filter(Boolean);
    if (parentPhones.length === 0) throw new Error("No parent mobile number registered");

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
      paidDate: f.paidDate || new Date().toISOString().slice(0, 10),
      receiptId: f.id
    });

    const formatCurrency = (val: number) => `Rs. ${val.toLocaleString()}`;

    const textMessage = `Dear Parent, please find attached the fee receipt for ${s.name} for the month of ${f.month}.\n\n` +
      `Amount Paid: ${formatCurrency(Number(f.paidAmount))}\n` +
      `Status: ${Number(f.amount) - Number(f.paidAmount) <= 0 ? "Paid" : "Partially Paid"}\n` +
      `Receipt ID: ${f.id.slice(0, 8).toUpperCase()}\n\n` +
      `Thank you,\n${settings.instituteName || "Vishwa Tuition Center"}`;

    let sentCount = 0;
    let lastError: any = null;
    for (const phone of parentPhones) {
      try {
        // Send the payment summary text first
        await ws.sendWhatsAppTextMessage(phone, textMessage);

        // Send the payment receipt PDF second
        await ws.sendWhatsAppMessageWithPDF(
          phone,
          "Fee Payment Receipt PDF",
          pdfBuffer,
          `Receipt_${f.id.slice(0, 8).toUpperCase()}.pdf`
        );
        await logMessage({
          type: "fee_receipt",
          studentId: s.id,
          studentName: s.name,
          recipientPhone: phone,
          message: textMessage + " [+ Fee Receipt PDF]",
          status: "sent"
        });
        sentCount++;
      } catch (err: any) {
        console.error(`Failed to send receipt to ${phone}:`, err);
        lastError = err;
        await logMessage({
          type: "fee_receipt",
          studentId: s.id,
          studentName: s.name,
          recipientPhone: phone,
          message: textMessage + " [+ Fee Receipt PDF]",
          status: "failed",
          error: err.message || String(err)
        });
      }
    }

    if (sentCount === 0 && lastError) {
      throw lastError;
    }

    return { success: true };
  });

// ────────────────────────────────────────────────────────────────
// Message Logging
// ────────────────────────────────────────────────────────────────

async function logMessage(data: {
  type: MessageType;
  studentId: string;
  studentName: string;
  recipientPhone: string;
  message: string;
  status: "sent" | "failed";
  error?: string;
}) {
  const sql = await getSql();
  if (!sql) return;
  const id = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  try {
    await sql`
      INSERT INTO message_logs ("id", "type", "studentId", "studentName", "recipientPhone", "message", "status", "error", "timestamp")
      VALUES (${id}, ${data.type}, ${data.studentId}, ${data.studentName}, ${data.recipientPhone}, ${data.message}, ${data.status}, ${data.error || null}, ${new Date().toISOString()})
    `;
  } catch (err) {
    console.error("[MessageLog] Failed to log message:", err);
  }
}

export const getMessageLogs = createServerFn({ method: "POST" })
  .validator((data: { limit?: number; offset?: number; type?: string; status?: string }) => data)
  .handler(async ({ data }) => {
    const sql = await getSql();
    if (!sql) return { logs: [] as MessageLog[], total: 0 };

    const limit = data.limit || 50;
    const offset = data.offset || 0;

    let logs: any[];
    let countResult: any[];

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
      logs: logs.map((r: any) => ({
        id: r.id,
        type: r.type as MessageType,
        studentId: r.studentId,
        studentName: r.studentName,
        recipientPhone: r.recipientPhone,
        message: r.message,
        status: r.status as "sent" | "failed",
        error: r.error || undefined,
        timestamp: r.timestamp,
      })),
      total: Number(countResult[0]?.count || 0),
    };
  });

export const getMessageLogStats = createServerFn({ method: "GET" })
  .handler(async () => {
    const sql = await getSql();
    if (!sql) return { total: 0, sent: 0, failed: 0, today: 0, byType: {} as Record<string, number> };

    const today = new Date().toISOString().slice(0, 10);

    const totalR = await sql`SELECT COUNT(*) as c FROM message_logs`;
    const sentR = await sql`SELECT COUNT(*) as c FROM message_logs WHERE "status" = 'sent'`;
    const failedR = await sql`SELECT COUNT(*) as c FROM message_logs WHERE "status" = 'failed'`;
    const todayR = await sql`SELECT COUNT(*) as c FROM message_logs WHERE "timestamp" >= ${today}`;
    const byTypeR = await sql`SELECT "type", COUNT(*) as c FROM message_logs GROUP BY "type"`;

    const byType: Record<string, number> = {};
    byTypeR.forEach((r: any) => { byType[r.type] = Number(r.c); });

    return {
      total: Number(totalR[0]?.c || 0),
      sent: Number(sentR[0]?.c || 0),
      failed: Number(failedR[0]?.c || 0),
      today: Number(todayR[0]?.c || 0),
      byType,
    };
  });

export const deleteDbMessageLog = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
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

export const clearAllDbMessageLogs = createServerFn({ method: "POST" })
  .handler(async () => {
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

// ────────────────────────────────────────────────────────────────
// Bulk Attendance Alerts
// ────────────────────────────────────────────────────────────────

export const sendBulkAttendanceAlerts = createServerFn({ method: "POST" })
  .validator((data: { date: string; standard?: string }) => data)
  .handler(async ({ data }) => {
    const sql = await getSql();
    if (!sql) throw new Error("Database not connected");

    const settings = await getDbSettings();
    if (!settings) throw new Error("Settings not configured");

    const provider = settings.whatsappProvider || "manual";
    if (provider === "manual") return { success: true, manual: true, sent: 0 };

    const ws = await getWhatsAppService();
    if (!ws) throw new Error("WhatsApp service not available");

    // Get attendance records for this date
    let attendanceRecords: any[];
    if (data.standard && data.standard !== "all") {
      attendanceRecords = await sql`
        SELECT a.*, s.name, s."fatherMobile", s."motherMobile", s.standard, s.section, s.id as sid
        FROM attendance a
        JOIN students s ON a."studentId" = s.id
        WHERE a.date = ${data.date} AND s.standard = ${data.standard}
      `;
    } else {
      attendanceRecords = await sql`
        SELECT a.*, s.name, s."fatherMobile", s."motherMobile", s.standard, s.section, s.id as sid
        FROM attendance a
        JOIN students s ON a."studentId" = s.id
        WHERE a.date = ${data.date}
      `;
    }

    let sentCount = 0;
    let failedCount = 0;
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }).toUpperCase();

    // Avoid server timezone shifts when parsing YYYY-MM-DD
    const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const parts = data.date.split("-");
    const dateStr = `${parseInt(parts[2], 10)} ${MONTHS[parseInt(parts[1], 10) - 1]} ${parts[0]}`;

    for (const rec of attendanceRecords) {
      const parentPhones = [rec.fatherMobile, rec.motherMobile].filter(Boolean);
      if (parentPhones.length === 0) continue;

      let template = "";
      if (rec.status === "Present") {
        template = settings.whatsappTemplatePresent || "Dear Parent, your child [student_name] was marked ✅ PRESENT at Vishwa Tuition Center today ([date]) at [time]. Regards, Vishwa Tuition Center.";
      } else if (rec.status === "Absent") {
        template = settings.whatsappTemplateAbsent || "Dear Parent, your child [student_name] was marked ❌ ABSENT from Vishwa Tuition Center today ([date]). Please check with them. Regards, Vishwa Tuition Center.";
      } else if (rec.status === "Late") {
        template = settings.whatsappTemplateLate || "Dear Parent, your child [student_name] arrived ⏰ LATE at Vishwa Tuition Center today ([date]) at [time]. Regards, Vishwa Tuition Center.";
      } else {
        continue; // Skip Holiday
      }

      const messageText = template
        .replace("[student_name]", rec.name)
        .replace("[date]", dateStr)
        .replace("[time]", timeStr);

      for (const phone of parentPhones) {
        try {
          if (provider === "baileys") {
            await ws.sendWhatsAppTextMessage(phone, messageText);
          }
          await logMessage({
            type: "attendance",
            studentId: rec.sid,
            studentName: rec.name,
            recipientPhone: phone,
            message: messageText,
            status: "sent",
          });
          sentCount++;
        } catch (err: any) {
          await logMessage({
            type: "attendance",
            studentId: rec.sid,
            studentName: rec.name,
            recipientPhone: phone,
            message: messageText,
            status: "failed",
            error: err.message || String(err),
          });
          failedCount++;
        }

        // Small delay between messages to avoid rate limiting
        await new Promise((r) => setTimeout(r, 1500));
      }
    }

    return { success: true, sent: sentCount, failed: failedCount };
  });

// ────────────────────────────────────────────────────────────────
// Monthly Fee Reminders
// ────────────────────────────────────────────────────────────────

export const sendMonthlyFeeReminders = createServerFn({ method: "POST" })
  .validator((data: { month: string }) => data)
  .handler(async ({ data }) => {
    const sql = await getSql();
    if (!sql) throw new Error("Database not connected");

    const settings = await getDbSettings();
    if (!settings) throw new Error("Settings not configured");

    const provider = settings.whatsappProvider || "manual";
    if (provider === "manual") return { success: true, manual: true, sent: 0 };

    const ws = await getWhatsAppService();
    if (!ws) throw new Error("WhatsApp service not available");

    // Get students who have NOT paid for this month or have pending/partial fees
    const students = await sql`SELECT * FROM students`;
    const paidFees = await sql`SELECT * FROM fees WHERE month = ${data.month} AND status = 'Paid'`;
    const paidStudentIds = new Set(paidFees.map((f: any) => f.studentId));

    const unpaidStudents = students.filter((s: any) => !paidStudentIds.has(s.id));

    let sentCount = 0;
    let failedCount = 0;

    const template = settings.whatsappTemplateFeeReminder ||
      "Dear Parent, this is a reminder that the tuition fee of Rs. [amount] for [student_name] (Std: [standard]) for [month] is pending. Please arrange payment at your earliest convenience. Regards, Vishwa Tuition Center.";

    const monthLabel = new Date(data.month + "-01").toLocaleDateString("en-IN", { month: "long", year: "numeric" });

    for (const s of unpaidStudents) {
      const parentPhones = [s.fatherMobile, s.motherMobile].filter(Boolean);
      if (parentPhones.length === 0) continue;

      const messageText = template
        .replace("[student_name]", s.name)
        .replace("[amount]", String(s.monthlyFees))
        .replace("[standard]", s.standard)
        .replace("[month]", monthLabel);

      for (const phone of parentPhones) {
        try {
          if (provider === "baileys") {
            await ws.sendWhatsAppTextMessage(phone, messageText);
          }
          await logMessage({
            type: "fee_reminder",
            studentId: s.id,
            studentName: s.name,
            recipientPhone: phone,
            message: messageText,
            status: "sent",
          });
          sentCount++;
        } catch (err: any) {
          await logMessage({
            type: "fee_reminder",
            studentId: s.id,
            studentName: s.name,
            recipientPhone: phone,
            message: messageText,
            status: "failed",
            error: err.message || String(err),
          });
          failedCount++;
        }

        await new Promise((r) => setTimeout(r, 1500));
      }
    }

    return { success: true, sent: sentCount, failed: failedCount, total: unpaidStudents.length };
  });

// ────────────────────────────────────────────────────────────────
// Fee Overdue Reminders
// ────────────────────────────────────────────────────────────────

export const sendFeeOverdueReminders = createServerFn({ method: "POST" })
  .validator((data: { month: string }) => data)
  .handler(async ({ data }) => {
    const sql = await getSql();
    if (!sql) throw new Error("Database not connected");

    const settings = await getDbSettings();
    if (!settings) throw new Error("Settings not configured");

    const provider = settings.whatsappProvider || "manual";
    if (provider === "manual") return { success: true, manual: true, sent: 0 };

    const ws = await getWhatsAppService();
    if (!ws) throw new Error("WhatsApp service not available");

    // Get students with pending/partial fees for the given month
    const overdueFees = await sql`
      SELECT f.*, s.name, s."fatherMobile", s."motherMobile", s.standard
      FROM fees f
      JOIN students s ON f."studentId" = s.id
      WHERE f.month = ${data.month} AND f.status != 'Paid'
    `;

    // Also include students with no fee record at all
    const allStudents = await sql`SELECT * FROM students`;
    const feeStudentIds = await sql`SELECT DISTINCT "studentId" FROM fees WHERE month = ${data.month}`;
    const hasFeesIds = new Set(feeStudentIds.map((r: any) => r.studentId));
    const noRecordStudents = allStudents.filter((s: any) => !hasFeesIds.has(s.id));

    let sentCount = 0;
    let failedCount = 0;

    const template = settings.whatsappTemplateFeeOverdue ||
      "Dear Parent, the tuition fee of Rs. [amount] for [student_name] for [month] is overdue. Kindly clear the dues to avoid any inconvenience. Regards, Vishwa Tuition Center.";

    const monthLabel = new Date(data.month + "-01").toLocaleDateString("en-IN", { month: "long", year: "numeric" });

    const allOverdue = [
      ...overdueFees.map((f: any) => ({ id: f.studentId, name: f.name, fatherMobile: f.fatherMobile, motherMobile: f.motherMobile, monthlyFees: f.amount, standard: f.standard })),
      ...noRecordStudents.map((s: any) => ({ id: s.id, name: s.name, fatherMobile: s.fatherMobile, motherMobile: s.motherMobile, monthlyFees: s.monthlyFees, standard: s.standard })),
    ];

    for (const s of allOverdue) {
      const parentPhones = [s.fatherMobile, s.motherMobile].filter(Boolean);
      if (parentPhones.length === 0) continue;

      const messageText = template
        .replace("[student_name]", s.name)
        .replace("[amount]", String(s.monthlyFees))
        .replace("[month]", monthLabel);

      for (const phone of parentPhones) {
        try {
          if (provider === "baileys") {
            await ws.sendWhatsAppTextMessage(phone, messageText);
          }
          await logMessage({
            type: "fee_overdue",
            studentId: s.id,
            studentName: s.name,
            recipientPhone: phone,
            message: messageText,
            status: "sent",
          });
          sentCount++;
        } catch (err: any) {
          await logMessage({
            type: "fee_overdue",
            studentId: s.id,
            studentName: s.name,
            recipientPhone: phone,
            message: messageText,
            status: "failed",
            error: err.message || String(err),
          });
          failedCount++;
        }

        await new Promise((r) => setTimeout(r, 1500));
      }
    }

    return { success: true, sent: sentCount, failed: failedCount };
  });

// ────────────────────────────────────────────────────────────────
// Birthday Wishes
// ────────────────────────────────────────────────────────────────

export const checkAndSendBirthdayWishes = createServerFn({ method: "POST" })
  .handler(async () => {
    const sql = await getSql();
    if (!sql) throw new Error("Database not connected");

    const settings = await getDbSettings();
    if (!settings) throw new Error("Settings not configured");

    const provider = settings.whatsappProvider || "manual";
    if (provider === "manual") return { success: true, manual: true, sent: 0 };

    const ws = await getWhatsAppService();
    if (!ws) throw new Error("WhatsApp service not available");

    const today = new Date();
    const todayMD = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    // Find students whose DOB matches today's month-day
    const allStudents = await sql`SELECT * FROM students`;
    const birthdayStudents = allStudents.filter((s: any) => {
      if (!s.dob) return false;
      const dob = new Date(s.dob);
      const dobMD = `${String(dob.getMonth() + 1).padStart(2, "0")}-${String(dob.getDate()).padStart(2, "0")}`;
      return dobMD === todayMD;
    });

    let sentCount = 0;
    let failedCount = 0;

    const template = settings.whatsappTemplateBirthday ||
      "Dear Parent, Vishwa Tuition Center wishes [student_name] a very Happy Birthday! 🎉🎂 May this year bring them great success. Regards, Vishwa Tuition Center.";

    for (const s of birthdayStudents) {
      const parentPhones = [s.fatherMobile, s.motherMobile].filter(Boolean);
      if (parentPhones.length === 0) continue;

      const messageText = template.replace("[student_name]", s.name);

      for (const phone of parentPhones) {
        try {
          if (provider === "baileys") {
            await ws.sendWhatsAppTextMessage(phone, messageText);
          }
          await logMessage({
            type: "birthday",
            studentId: s.id,
            studentName: s.name,
            recipientPhone: phone,
            message: messageText,
            status: "sent",
          });
          sentCount++;
        } catch (err: any) {
          await logMessage({
            type: "birthday",
            studentId: s.id,
            studentName: s.name,
            recipientPhone: phone,
            message: messageText,
            status: "failed",
            error: err.message || String(err),
          });
          failedCount++;
        }

        await new Promise((r) => setTimeout(r, 1500));
      }
    }

    return { success: true, sent: sentCount, failed: failedCount, birthdaysFound: birthdayStudents.length };
  });

// ────────────────────────────────────────────────────────────────
// Festival Greetings Automation
// ────────────────────────────────────────────────────────────────

const FESTIVALS: Record<string, { name: string; wish: string }> = {
  // 2026
  "2026-01-01": { name: "New Year's Day", wish: "Happy New Year! May this year bring joy, peace, and success to you and your family. 🎉" },
  "2026-01-14": { name: "Pongal / Makar Sankranti", wish: "Wishing you a very Happy Pongal and Makar Sankranti! May the harvest season bring abundance and sweet moments. 🌾" },
  "2026-01-26": { name: "Republic Day", wish: "Happy Republic Day! Let us salute the nation and honor our constitution. 🇮🇳" },
  "2026-02-15": { name: "Maha Shivaratri", wish: "Wishing you a blessed Maha Shivaratri. May Lord Shiva bless you with peace and wisdom. 🔱" },
  "2026-03-03": { name: "Holi", wish: "Happy Holi! May your life be filled with vibrant colors of happiness, love, and laughter. 🎨" },
  "2026-03-20": { name: "Eid al-Fitr", wish: "Eid Mubarak! Wishing you and your family a blessed day filled with joy and happiness. 🌙" },
  "2026-04-03": { name: "Good Friday", wish: "Have a blessed Good Friday. May the love and grace of God shine upon you today and always. 🕯️" },
  "2026-04-14": { name: "Tamil New Year / Puthandu", wish: "Iniya Puthandu Vazhthukkal! May this Tamil New Year bring health, prosperity, and happiness. 🍊🎉" },
  "2026-05-27": { name: "Eid al-Adha", wish: "Eid al-Adha Mubarak! May your faith and devotion be rewarded with happiness, peace, and blessings. 🌙" },
  "2026-08-15": { name: "Independence Day", wish: "Happy Independence Day! Let us celebrate the freedom and unity of our great nation. 🇮🇳" },
  "2026-09-04": { name: "Krishna Janmashtami", wish: "Happy Janmashtami! May Lord Krishna steal all your worries and bless you with happiness and love. 🍯" },
  "2026-09-15": { name: "Ganesh Chaturthi", wish: "Happy Ganesh Chaturthi! May Lord Ganesha bless you with intelligence, prosperity, and success. 🐘" },
  "2026-10-02": { name: "Gandhi Jayanti", wish: "Happy Gandhi Jayanti! Let us remember and honor the father of our nation and follow the path of truth. 👓" },
  "2026-10-20": { name: "Vijayadashami / Dussehra", wish: "Happy Dussehra! May the victory of good over evil bring joy, peace, and prosperity to you. 🏹" },
  "2026-11-08": { name: "Diwali", wish: "Wishing you a very Happy and Safe Diwali! May the festival of lights illuminate your life with happiness and wealth. 🪔" },
  "2026-12-25": { name: "Christmas", wish: "Merry Christmas! May the holiday season fill your home with joy, love, and laughter. 🎄" },

  // 2027
  "2027-01-01": { name: "New Year's Day", wish: "Happy New Year! May this year bring joy, peace, and success to you and your family. 🎉" },
  "2027-01-14": { name: "Pongal / Makar Sankranti", wish: "Wishing you a very Happy Pongal and Makar Sankranti! May the harvest season bring abundance and sweet moments. 🌾" },
  "2027-01-26": { name: "Republic Day", wish: "Happy Republic Day! Let us salute the nation and honor our constitution. 🇮🇳" },
  "2027-03-06": { name: "Maha Shivaratri", wish: "Wishing you a blessed Maha Shivaratri. May Lord Shiva bless you with peace and wisdom. 🔱" },
  "2027-03-09": { name: "Eid al-Fitr", wish: "Eid Mubarak! Wishing you and your family a blessed day filled with joy and happiness. 🌙" },
  "2027-03-22": { name: "Holi", wish: "Happy Holi! May your life be filled with vibrant colors of happiness, love, and laughter. 🎨" },
  "2027-03-26": { name: "Good Friday", wish: "Have a blessed Good Friday. May the love and grace of God shine upon you today and always. 🕯️" },
  "2027-04-14": { name: "Tamil New Year / Puthandu", wish: "Iniya Puthandu Vazhthukkal! May this Tamil New Year bring health, prosperity, and happiness. 🍊🎉" },
  "2027-05-16": { name: "Eid al-Adha", wish: "Eid al-Adha Mubarak! May your faith and devotion be rewarded with happiness, peace, and blessings. 🌙" },
  "2027-08-15": { name: "Independence Day", wish: "Happy Independence Day! Let us celebrate the freedom and unity of our great nation. 🇮🇳" },
  "2027-08-25": { name: "Krishna Janmashtami", wish: "Happy Janmashtami! May Lord Krishna steal all your worries and bless you with happiness and love. 🍯" },
  "2027-09-04": { name: "Ganesh Chaturthi", wish: "Happy Ganesh Chaturthi! May Lord Ganesha bless you with intelligence, prosperity, and success. 🐘" },
  "2027-10-02": { name: "Gandhi Jayanti", wish: "Happy Gandhi Jayanti! Let us remember and honor the father of our nation and follow the path of truth. 👓" },
  "2027-10-09": { name: "Vijayadashami / Dussehra", wish: "Happy Dussehra! May the victory of good over evil bring joy, peace, and prosperity to you. 🏹" },
  "2027-10-29": { name: "Diwali", wish: "Wishing you a very Happy and Safe Diwali! May the festival of lights illuminate your life with happiness and wealth. 🪔" },
  "2027-12-25": { name: "Christmas", wish: "Merry Christmas! May the holiday season fill your home with joy, love, and laughter. 🎄" },

  // 2028
  "2028-01-01": { name: "New Year's Day", wish: "Happy New Year! May this year bring joy, peace, and success to you and your family. 🎉" },
  "2028-01-14": { name: "Pongal / Makar Sankranti", wish: "Wishing you a very Happy Pongal and Makar Sankranti! May the harvest season bring abundance and sweet moments. 🌾" },
  "2028-01-26": { name: "Republic Day", wish: "Happy Republic Day! Let us salute the nation and honor our constitution. 🇮🇳" },
  "2028-02-23": { name: "Maha Shivaratri", wish: "Wishing you a blessed Maha Shivaratri. May Lord Shiva bless you with peace and wisdom. 🔱" },
  "2028-02-26": { name: "Eid al-Fitr", wish: "Eid Mubarak! Wishing you and your family a blessed day filled with joy and happiness. 🌙" },
  "2028-03-11": { name: "Holi", wish: "Happy Holi! May your life be filled with vibrant colors of happiness, love, and laughter. 🎨" },
  "2028-04-14": { name: "Tamil New Year / Puthandu", wish: "Iniya Puthandu Vazhthukkal! May this Tamil New Year bring health, prosperity, and happiness. 🍊🎉" },
  "2028-04-14": { name: "Good Friday", wish: "Have a blessed Good Friday. May the love and grace of God shine upon you today and always. 🕯️" },
  "2028-05-05": { name: "Eid al-Adha", wish: "Eid al-Adha Mubarak! May your faith and devotion be rewarded with happiness, peace, and blessings. 🌙" },
  "2028-08-13": { name: "Krishna Janmashtami", wish: "Happy Janmashtami! May Lord Krishna steal all your worries and bless you with happiness and love. 🍯" },
  "2028-08-15": { name: "Independence Day", wish: "Happy Independence Day! Let us celebrate the freedom and unity of our great nation. 🇮🇳" },
  "2028-08-24": { name: "Ganesh Chaturthi", wish: "Happy Ganesh Chaturthi! May Lord Ganesha bless you with intelligence, prosperity, and success. 🐘" },
  "2028-10-02": { name: "Gandhi Jayanti", wish: "Happy Gandhi Jayanti! Let us remember and honor the father of our nation and follow the path of truth. 👓" },
  "2028-10-17": { name: "Diwali", wish: "Wishing you a very Happy and Safe Diwali! May the festival of lights illuminate your life with happiness and wealth. 🪔" },
  "2028-10-27": { name: "Vijayadashami / Dussehra", wish: "Happy Dussehra! May the victory of good over evil bring joy, peace, and prosperity to you. 🏹" },
  "2028-12-25": { name: "Christmas", wish: "Merry Christmas! May the holiday season fill your home with joy, love, and laughter. 🎄" }
};

export const checkAndSendFestivalGreetings = createServerFn({ method: "POST" })
  .handler(async () => {
    const sql = await getSql();
    if (!sql) throw new Error("Database not connected");

    const settings = await getDbSettings();
    if (!settings) throw new Error("Settings not configured");

    const provider = settings.whatsappProvider || "manual";
    if (provider === "manual") return { success: true, manual: true, sent: 0 };

    const ws = await getWhatsAppService();
    if (!ws) throw new Error("WhatsApp service not available");

    // Fetch local day in Indian Standard Time (IST) YYYY-MM-DD
    const todayStr = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    const festival = FESTIVALS[todayStr];
    if (!festival) {
      return { success: true, festival: null, sent: 0 };
    }

    const students = await sql`SELECT * FROM students`;
    let sentCount = 0;
    let failedCount = 0;

    for (const s of students) {
      const parentPhones = [s.fatherMobile, s.motherMobile].filter(Boolean);
      if (parentPhones.length === 0) continue;

      const messageText = `Dear Parent, Vishwa Tuition Center wishes you and your family a very ${festival.name}.

${festival.wish}

Regards,
Vishwa Tuition Center`;

      for (const phone of parentPhones) {
        try {
          if (provider === "baileys") {
            await ws.sendWhatsAppTextMessage(phone, messageText);
          }
          await logMessage({
            type: "campaign",
            studentId: s.id,
            studentName: s.name,
            recipientPhone: phone,
            message: messageText,
            status: "sent",
          });
          sentCount++;
        } catch (err: any) {
          await logMessage({
            type: "campaign",
            studentId: s.id,
            studentName: s.name,
            recipientPhone: phone,
            message: messageText,
            status: "failed",
            error: err.message || String(err),
          });
          failedCount++;
        }

        await new Promise((r) => setTimeout(r, 1500));
      }
    }

    return { success: true, festival: festival.name, sent: sentCount, failed: failedCount };
  });

export const loginAdmin = createServerFn({ method: "POST" })
  .validator((password: string) => password)
  .handler(async ({ data: password }) => {
    const envPassword = process.env.ADMIN_PASSWORD || "vishwa@123";
    if (password === envPassword) {
      return { success: true, token: "vishwa_admin_session_token_123" };
    }
    return { success: false, error: "Incorrect password" };
  });
