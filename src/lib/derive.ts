import type { Student, AttendanceRecord, FeePayment } from "./types";

export function studentAttendancePct(studentId: string, records: AttendanceRecord[]): number {
  const rs = records.filter((r) => r.studentId === studentId && r.status !== "Holiday");
  if (!rs.length) return 100;
  
  // Deduplicate by date
  const uniqueDates = new Map<string, AttendanceRecord>();
  for (const r of rs) {
    uniqueDates.set(r.date, r);
  }
  const uniqueRecords = Array.from(uniqueDates.values());

  const present = uniqueRecords.filter((r) => r.status === "Present" || r.status === "Late").length;
  return Math.round((present / uniqueRecords.length) * 100);
}

export function studentFeeStatus(studentId: string, fees: FeePayment[]) {
  const rs = fees.filter((f) => f.studentId === studentId);
  const pending = rs.reduce((s, f) => s + (f.amount - f.paidAmount), 0);
  const paid = rs.reduce((s, f) => s + f.paidAmount, 0);
  return { pending, paid, hasPending: pending > 0 };
}

export function currentMonthKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function formatCurrency(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function studentAvatarStyle(s: Student) {
  const hue = (s.name.charCodeAt(0) * 7) % 360;
  return {
    background: `linear-gradient(135deg, hsl(${hue} 70% 60%), hsl(${(hue + 60) % 360} 70% 55%))`,
  };
}
