import postgres from "postgres";
import { createServerFn } from "@tanstack/react-start";

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
    // 1. Students table
    await sql`
      CREATE TABLE IF NOT EXISTS students (
        "id" TEXT PRIMARY KEY,
        "name" TEXT NOT NULL,
        "standard" TEXT NOT NULL,
        "school" TEXT NOT NULL,
        "parentName" TEXT,
        "parentPhone" TEXT,
        "address" TEXT,
        "joinedDate" TEXT,
        "status" TEXT NOT NULL,
        "totalFees" INTEGER NOT NULL,
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
        "notes" TEXT
      )
    `;

    // 3. Fees table
    await sql`
      CREATE TABLE IF NOT EXISTS fees (
        "id" TEXT PRIMARY KEY,
        "studentId" TEXT NOT NULL,
        "amount" INTEGER NOT NULL,
        "date" TEXT NOT NULL,
        "method" TEXT NOT NULL,
        "status" TEXT NOT NULL,
        "remarks" TEXT
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
    if (!sql) return [];
    try {
      const rows = await sql`SELECT * FROM students`;
      return rows.map(r => ({
        ...r,
        totalFees: Number(r.totalFees),
      }));
    } catch (e) {
      console.error("Failed to get students from DB:", e);
      return [];
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
            INSERT INTO students ${sql(students, "id", "name", "standard", "school", "parentName", "parentPhone", "address", "joinedDate", "status", "totalFees", "createdAt")}
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
    if (!sql) return [];
    try {
      return await sql`SELECT * FROM attendance`;
    } catch (e) {
      console.error("Failed to get attendance from DB:", e);
      return [];
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
            INSERT INTO attendance ${sql(attendance, "id", "studentId", "date", "status", "notes")}
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
    if (!sql) return [];
    try {
      const rows = await sql`SELECT * FROM fees`;
      return rows.map(r => ({
        ...r,
        amount: Number(r.amount),
      }));
    } catch (e) {
      console.error("Failed to get fees from DB:", e);
      return [];
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
            INSERT INTO fees ${sql(fees, "id", "studentId", "amount", "date", "method", "status", "remarks")}
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
    if (!sql) return [];
    try {
      const rows = await sql`SELECT * FROM materials`;
      return rows.map(r => ({
        ...r,
        size: Number(r.size),
      }));
    } catch (e) {
      console.error("Failed to get materials from DB:", e);
      return [];
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
            INSERT INTO materials ${sql(materials, "id", "standard", "type", "title", "fileName", "fileType", "size", "driveUrl", "driveFileId", "createdAt")}
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
      return JSON.parse(rows[0].value);
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
