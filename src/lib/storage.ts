import type {
  AppSettings,
  AttendanceRecord,
  FeePayment,
  Material,
  Student,
  Standard,
} from "./types";

const KEYS = {
  students: "tms.students",
  attendance: "tms.attendance",
  fees: "tms.fees",
  materials: "tms.materials",
  settings: "tms.settings",
  seeded: "tms.seeded",
};

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("tms:storage", { detail: { key } }));
}

// Students
export const getStudents = () => read<Student[]>(KEYS.students, []);
export const setStudents = (v: Student[]) => write(KEYS.students, v);

// Attendance
export const getAttendance = () => read<AttendanceRecord[]>(KEYS.attendance, []);
export const setAttendance = (v: AttendanceRecord[]) => write(KEYS.attendance, v);

// Fees
export const getFees = () => read<FeePayment[]>(KEYS.fees, []);
export const setFees = (v: FeePayment[]) => write(KEYS.fees, v);

// Materials
export const getMaterials = () => read<Material[]>(KEYS.materials, []);
export const setMaterials = (v: Material[]) => write(KEYS.materials, v);

// Settings
export const DEFAULT_SETTINGS: AppSettings = {
  instituteName: "Bright Minds Tuition",
  teacherName: "Prof. Anita Sharma",
  contact: "+91 98765 43210",
  address: "12 MG Road, Bengaluru, IN",
  theme: "light",
  notifications: true,
  language: "English",
};
export const getSettings = () => read<AppSettings>(KEYS.settings, DEFAULT_SETTINGS);
export const setSettings = (v: AppSettings) => write(KEYS.settings, v);

// -- SEED --
const SAMPLE_NAMES = [
  "Aarav Sharma", "Ishita Verma", "Rohan Iyer", "Priya Nair", "Kabir Singh",
  "Ananya Rao", "Aditya Kumar", "Sneha Patel", "Vivaan Mehta", "Diya Kapoor",
  "Arjun Reddy", "Meera Joshi", "Yash Malhotra", "Aisha Khan", "Karan Gupta",
  "Nisha Bansal", "Rahul Das", "Kavya Menon", "Devansh Roy", "Tara Bhatt",
];
const SCHOOLS = ["Delhi Public School", "St. Xavier's", "Ryan International", "Kendriya Vidyalaya", "DAV Public"];
const STDS: Standard[] = ["6th", "7th", "8th", "9th", "10th", "11th", "12th"];

export function seedIfNeeded() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(KEYS.seeded)) return;

  const students: Student[] = SAMPLE_NAMES.map((name, i) => ({
    id: uid(),
    name,
    gender: i % 3 === 0 ? "Female" : "Male",
    dob: `20${10 + (i % 6)}-0${(i % 9) + 1}-1${i % 9}`,
    school: SCHOOLS[i % SCHOOLS.length],
    standard: STDS[i % STDS.length],
    section: ["A", "B", "C"][i % 3],
    parentName: `Parent of ${name.split(" ")[0]}`,
    fatherMobile: `98${(1000000 + i * 12345).toString().slice(0, 8)}`,
    motherMobile: `97${(2000000 + i * 54321).toString().slice(0, 8)}`,
    address: `${i + 1} Sample Street, City`,
    joiningDate: `2024-0${(i % 9) + 1}-15`,
    monthlyFees: 1500 + (i % 5) * 500,
    admissionFees: 2000,
    notes: "",
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  }));
  setStudents(students);

  // Seed 30 days attendance
  const today = new Date();
  const attendance: AttendanceRecord[] = [];
  for (let d = 0; d < 30; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() - d);
    const ds = date.toISOString().slice(0, 10);
    students.forEach((s, i) => {
      const r = (i + d) % 10;
      const status = r < 7 ? "Present" : r < 8 ? "Late" : r < 9 ? "Absent" : "Holiday";
      attendance.push({ id: uid(), studentId: s.id, date: ds, status });
    });
  }
  setAttendance(attendance);

  // Seed fees for last 3 months
  const fees: FeePayment[] = [];
  const now = new Date();
  for (let m = 0; m < 3; m++) {
    const md = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const monthKey = `${md.getFullYear()}-${String(md.getMonth() + 1).padStart(2, "0")}`;
    students.forEach((s, i) => {
      const paid = m === 0 ? i % 3 !== 0 : i % 4 !== 0;
      fees.push({
        id: uid(),
        studentId: s.id,
        month: monthKey,
        amount: s.monthlyFees,
        paidAmount: paid ? s.monthlyFees : 0,
        paidDate: paid ? `${monthKey}-05` : undefined,
        status: paid ? "Paid" : "Pending",
      });
    });
  }
  setFees(fees);

  localStorage.setItem(KEYS.seeded, "1");
}
