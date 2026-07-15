import postgres from "postgres";
import { createServerFn } from "@tanstack/react-start";
import type { Student, AttendanceRecord, FeePayment, Material, AppSettings } from "./types";

const connectionString = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL;

// Only initialize database connection on server-side
const isServer = typeof window === "undefined";

export const sql = isServer && connectionString
  ? postgres(connectionString.replace(/^["']|["']$/g, ""), {
      ssl: "require",
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    })
  : null;

export async function initDb() {
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

    console.log("Neon Postgres Database tables checked/initialized successfully!");
  } catch (err) {
    console.error("Neon Postgres Database initialization failed:", err);
  }
}

// Run initialization as a side-effect on load
if (isServer && sql) {
  initDb();
}

// --- Server Functions for Students ---
export const getDbStudents = createServerFn({ method: "GET" })
  .handler(async () => {
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
    if (!sql) return;
    try {
      await sql.begin(async (sql) => {
        await sql`DELETE FROM students`;
        if (students.length > 0) {
          await sql`
            INSERT INTO students ${(sql as any)(students, ["id", "photo", "name", "gender", "dob", "school", "standard", "section", "parentName", "fatherMobile", "motherMobile", "address", "joiningDate", "monthlyFees", "admissionFees", "notes", "createdAt"])}
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
    if (!sql) return;
    try {
      await sql.begin(async (sql) => {
        await sql`DELETE FROM attendance`;
        if (attendance.length > 0) {
          await sql`
            INSERT INTO attendance ${(sql as any)(attendance, ["id", "studentId", "date", "status", "remarks"])}
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
    if (!sql) return;
    try {
      await sql.begin(async (sql) => {
        await sql`DELETE FROM fees`;
        if (fees.length > 0) {
          await sql`
            INSERT INTO fees ${(sql as any)(fees, ["id", "studentId", "month", "amount", "paidAmount", "paidDate", "status"])}
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
    if (!sql) return;
    try {
      await sql.begin(async (sql) => {
        await sql`DELETE FROM materials`;
        if (materials.length > 0) {
          await sql`
            INSERT INTO materials ${(sql as any)(materials, ["id", "standard", "type", "title", "fileName", "fileType", "size", "driveUrl", "driveFileId", "createdAt"])}
          `;
        }
      });
    } catch (e) {
      console.error("Failed to sync materials to DB:", e);
      throw e;
    }
  });

// --- Server Functions for Settings ---
export const getDbSettings = createServerFn({ method: "GET" })
  .handler(async () => {
    if (!sql) return null;
    try {
      const rows = await sql`SELECT "value" FROM settings WHERE "key" = 'app_settings'`;
      if (rows.length === 0) return null;
      return JSON.parse(rows[0].value) as AppSettings;
    } catch (e) {
      console.error("Failed to get settings from DB:", e);
      return null;
    }
  });

export const syncDbSettings = createServerFn({ method: "POST" })
  .validator((settings: any) => settings)
  .handler(async ({ data: settings }) => {
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
