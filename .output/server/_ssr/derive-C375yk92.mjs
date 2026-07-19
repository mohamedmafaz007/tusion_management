//#region node_modules/.nitro/vite/services/ssr/assets/derive-C375yk92.js
function studentAttendancePct(studentId, records) {
	const rs = records.filter((r) => r.studentId === studentId && r.status !== "Holiday");
	if (!rs.length) return 100;
	const uniqueDates = /* @__PURE__ */ new Map();
	for (const r of rs) uniqueDates.set(r.date, r);
	const uniqueRecords = Array.from(uniqueDates.values());
	const present = uniqueRecords.filter((r) => r.status === "Present" || r.status === "Late").length;
	return Math.round(present / uniqueRecords.length * 100);
}
function studentFeeStatus(student, fees) {
	const monthsSet = /* @__PURE__ */ new Set();
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
		} else pending += student.monthlyFees;
	}
	const otherFees = fees.filter((f) => f.studentId === student.id && !studentMonths.includes(f.month));
	for (const f of otherFees) {
		pending += f.amount - f.paidAmount;
		paid += f.paidAmount;
	}
	return {
		pending,
		paid,
		hasPending: pending > 0
	};
}
function currentMonthKey() {
	const d = /* @__PURE__ */ new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function todayKey() {
	return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function formatCurrency(n) {
	return `₹${n.toLocaleString("en-IN")}`;
}
function initials(name) {
	return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}
function studentAvatarStyle(s) {
	const hue = s.name.charCodeAt(0) * 7 % 360;
	return { background: `linear-gradient(135deg, hsl(${hue} 70% 60%), hsl(${(hue + 60) % 360} 70% 55%))` };
}
//#endregion
export { studentAvatarStyle as a, studentAttendancePct as i, formatCurrency as n, studentFeeStatus as o, initials as r, todayKey as s, currentMonthKey as t };
