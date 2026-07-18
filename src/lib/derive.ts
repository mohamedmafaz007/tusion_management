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

export function studentFeeStatus(student: Student, fees: FeePayment[]) {
  const monthsSet = new Set<string>();
  fees.forEach((f) => monthsSet.add(f.month));
  monthsSet.add(currentMonthKey());
  const activeMonths = Array.from(monthsSet);

  const joiningMonth = (student.joiningDate || "").slice(0, 7);
  const studentMonths = activeMonths.filter((m) => m >= joiningMonth);

  let pending = 0;
  let paid = 0;

  for (const month of studentMonths) {
    const f = fees.find((fee) => fee.studentId === student.id && fee.month === month);
    if (f) {
      pending += f.amount - f.paidAmount;
      paid += f.paidAmount;
    } else {
      pending += student.monthlyFees;
    }
  }

  // Also account for any other fees in the database (e.g. historical fees)
  // in case they are outside the computed studentMonths
  const otherFees = fees.filter((f) => f.studentId === student.id && !studentMonths.includes(f.month));
  for (const f of otherFees) {
    pending += f.amount - f.paidAmount;
    paid += f.paidAmount;
  }

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
