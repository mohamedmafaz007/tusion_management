import type {
  AppSettings,
  AttendanceRecord,
  FeePayment,
  Material,
  Student,
  Standard,
  Teacher,
} from "./types";

const KEYS = {
  students: "tms.students",
  attendance: "tms.attendance",
  fees: "tms.fees",
  materials: "tms.materials",
  settings: "tms.settings",
  teachers: "tms.teachers",
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

// Teachers
export const getTeachers = () => read<Teacher[]>(KEYS.teachers, []);
export const setTeachers = (v: Teacher[]) => write(KEYS.teachers, v);

// Settings
export const DEFAULT_SETTINGS: AppSettings = {
  standards: ["6th", "7th", "8th", "9th", "10th", "11th", "12th"],
  instituteName: "Vishwa Tuition Center",
  teacherName: "Prof. Anita Sharma",
  contact: "+91 98765 43210",
  address: "12 MG Road, Bengaluru, IN",
  theme: "light",
  notifications: true,
  language: "English",
  whatsappProvider: "manual",
  whatsappTemplatePresent: "Dear Parent, your child [student_name] was marked ✅ PRESENT at Vishwa Tuition Center today ([date]) at [time]. Regards, Vishwa Tuition Center.",
  whatsappTemplateAbsent: "Dear Parent, your child [student_name] was marked ❌ ABSENT from Vishwa Tuition Center today ([date]). Please check with them. Regards, Vishwa Tuition Center.",
  whatsappTemplateLate: "Dear Parent, your child [student_name] arrived ⏰ LATE at Vishwa Tuition Center today ([date]) at [time]. Regards, Vishwa Tuition Center.",
  whatsappTemplateWelcome: "Dear Parent, thank you for registering [student_name] at Vishwa Tuition Center. We are excited to guide them on their academic journey. Regards, Prof. Anita Sharma.",
  whatsappTemplateFeeReminder: "Dear Parent, this is a reminder that the tuition fee of Rs. [amount] for [student_name] (Std: [standard]) for [month] is pending. Please arrange payment at your earliest convenience. Regards, Vishwa Tuition Center.",
  whatsappTemplateFeeOverdue: "Dear Parent, the tuition fee of Rs. [amount] for [student_name] for [month] is overdue. Kindly clear the dues to avoid any inconvenience. Regards, Vishwa Tuition Center.",
  whatsappTemplateBirthday: "Dear Parent, Vishwa Tuition Center wishes [student_name] a very Happy Birthday! 🎉🎂 May this year bring them great success. Regards, Vishwa Tuition Center.",
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

  // Seed study materials if empty (runs even for previously seeded databases)
  if (!localStorage.getItem("tms.seeded_materials") && getMaterials().length === 0) {
    const sampleMaterials: Material[] = [
      {
        id: uid(),
        standard: "6th",
        type: "Notes",
        title: "Mathematics Chapter 1: Number Systems",
        fileName: "math_ch1_numbers.pdf",
        fileType: "pdf",
        size: 125430,
        driveUrl: "https://drive.google.com/file/d/1UMwKbEB28d3VBEXgDLhpypnsseufSenG/view",
        driveFileId: "1UMwKbEB28d3VBEXgDLhpypnsseufSenG",
        medium: "English",
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
      {
        id: uid(),
        standard: "6th",
        type: "Notes",
        title: "அறிவியல் பாடம் 1: காந்தவியல்",
        fileName: "tamil_science_magnetism.pdf",
        fileType: "pdf",
        size: 112000,
        driveUrl: "https://drive.google.com/file/d/1UMwKbEB28d3VBEXgDLhpypnsseufSenG/view",
        driveFileId: "1UMwKbEB28d3VBEXgDLhpypnsseufSenG",
        medium: "Tamil",
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
      {
        id: uid(),
        standard: "6th",
        type: "Worksheets",
        title: "Science Worksheet: Light & Shadows",
        fileName: "science_light_shadows.pdf",
        fileType: "pdf",
        size: 98450,
        driveUrl: "https://drive.google.com/file/d/1UMwKbEB28d3VBEXgDLhpypnsseufSenG/view",
        driveFileId: "1UMwKbEB28d3VBEXgDLhpypnsseufSenG",
        medium: "English",
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        id: uid(),
        standard: "7th",
        type: "Assignments",
        title: "Social Science Syllabus 2024-25",
        fileName: "sst_syllabus_2024.pdf",
        fileType: "pdf",
        size: 204500,
        driveUrl: "https://drive.google.com/file/d/1UMwKbEB28d3VBEXgDLhpypnsseufSenG/view",
        driveFileId: "1UMwKbEB28d3VBEXgDLhpypnsseufSenG",
        medium: "English",
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
      {
        id: uid(),
        standard: "8th",
        type: "Worksheets",
        title: "English Grammar Worksheet: Tenses",
        fileName: "english_grammar_tenses.pdf",
        fileType: "pdf",
        size: 76500,
        driveUrl: "https://drive.google.com/file/d/1UMwKbEB28d3VBEXgDLhpypnsseufSenG/view",
        driveFileId: "1UMwKbEB28d3VBEXgDLhpypnsseufSenG",
        medium: "English",
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
      {
        id: uid(),
        standard: "8th",
        type: "Question Papers",
        title: "Term 1 Science Question Paper",
        fileName: "science_term1_2023.pdf",
        fileType: "pdf",
        size: 312000,
        driveUrl: "https://drive.google.com/file/d/1UMwKbEB28d3VBEXgDLhpypnsseufSenG/view",
        driveFileId: "1UMwKbEB28d3VBEXgDLhpypnsseufSenG",
        medium: "English",
        createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      }
    ];
    setMaterials(sampleMaterials);
    localStorage.setItem("tms.seeded_materials", "1");
  }

  if (localStorage.getItem(KEYS.seeded)) return;

  const students: Student[] = SAMPLE_NAMES.map((name, i) => {
    const sId = uid();
    return {
      id: sId,
      registrationNo: `VTC-${sId.slice(0, 6).toUpperCase()}`,
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
      boardOfStudy: i % 3 === 0 ? "CBSE" : i % 3 === 1 ? "ICSE" : "State Board",
      mediumOfStudy: i % 2 === 0 ? "English" : "Tamil",
      notes: "",
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    };
  });
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

  // Seed teachers
  const sampleTeachers: Teacher[] = [
    {
      id: uid(),
      name: "Prof. Anita Sharma",
      mobileNo: "9876543210",
      address: "12 MG Road, Bengaluru, IN",
      qualification: "M.Sc. Mathematics, B.Ed.",
      createdAt: new Date().toISOString(),
    },
    {
      id: uid(),
      name: "Mr. Rajesh Kumar",
      mobileNo: "9988776655",
      address: "45 Park Avenue, Bengaluru, IN",
      qualification: "B.Tech Computer Science",
      createdAt: new Date().toISOString(),
    },
  ];
  setTeachers(sampleTeachers);

  localStorage.setItem(KEYS.seeded, "1");
}
