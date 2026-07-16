export type Standard = "6th" | "7th" | "8th" | "9th" | "10th" | "11th" | "12th";
export const STANDARDS: Standard[] = ["6th", "7th", "8th", "9th", "10th", "11th", "12th"];

export type Gender = "Male" | "Female" | "Other";

export interface Student {
  id: string;
  photo?: string; // base64
  name: string;
  gender: Gender;
  dob: string;
  school: string;
  standard: Standard;
  section: string;
  parentName: string;
  fatherMobile: string;
  motherMobile: string;
  address: string;
  joiningDate: string;
  monthlyFees: number;
  admissionFees: number;
  notes?: string;
  createdAt: string;
}

export type AttendanceStatus = "Present" | "Absent" | "Late" | "Holiday";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  remarks?: string;
}

export type FeeStatus = "Paid" | "Pending" | "Partial";

export interface FeePayment {
  id: string;
  studentId: string;
  month: string; // YYYY-MM
  amount: number;
  paidAmount: number;
  paidDate?: string;
  status: FeeStatus;
}

export type MaterialType =
  | "Notes"
  | "Assignments"
  | "Question Papers"
  | "Model Papers"
  | "Worksheets"
  | "Important Questions"
  | "Previous Year Papers";

export const MATERIAL_TYPES: MaterialType[] = [
  "Notes",
  "Assignments",
  "Question Papers",
  "Model Papers",
  "Worksheets",
  "Important Questions",
  "Previous Year Papers",
];

export interface Material {
  id: string;
  standard: Standard;
  type: MaterialType;
  title: string;
  fileName: string;
  fileType: string; // pdf, doc, ppt, img, video
  size: number;
  dataUrl?: string; // base64 (small files only)
  driveUrl?: string; // Google Drive shareable link
  driveFileId?: string; // Google Drive file ID
  createdAt: string;
}

export interface AppSettings {
  instituteName: string;
  teacherName: string;
  contact: string;
  address: string;
  logo?: string;
  theme: "light" | "dark";
  notifications: boolean;
  language: "English" | "Hindi" | "Tamil";
  whatsappProvider?: "manual" | "twilio" | "ultramsg" | "baileys";
  whatsappApiKey?: string;
  whatsappInstanceId?: string;
  whatsappSenderNumber?: string;
  whatsappTemplatePresent?: string;
  whatsappTemplateAbsent?: string;
  whatsappTemplateLate?: string;
  whatsappTemplateWelcome?: string;
  whatsappTemplateFeeReminder?: string;
  whatsappTemplateFeeOverdue?: string;
  whatsappTemplateBirthday?: string;
}

// --- Message Logs ---

export type MessageType =
  | "welcome"
  | "attendance"
  | "fee_reminder"
  | "fee_receipt"
  | "birthday"
  | "fee_overdue";

export interface MessageLog {
  id: string;
  type: MessageType;
  studentId: string;
  studentName: string;
  recipientPhone: string;
  message: string;
  status: "sent" | "failed";
  error?: string;
  timestamp: string;
}
