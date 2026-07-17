//#region node_modules/.nitro/vite/services/ssr/assets/derive-B-AOoH3y.js
function studentAttendancePct(studentId, records) {
	const rs = records.filter((r) => r.studentId === studentId && r.status !== "Holiday");
	if (!rs.length) return 100;
	const uniqueDates = /* @__PURE__ */ new Map();
	for (const r of rs) uniqueDates.set(r.date, r);
	const uniqueRecords = Array.from(uniqueDates.values());
	const present = uniqueRecords.filter((r) => r.status === "Present" || r.status === "Late").length;
	return Math.round(present / uniqueRecords.length * 100);
}
function studentFeeStatus(studentId, fees) {
	const rs = fees.filter((f) => f.studentId === studentId);
	const pending = rs.reduce((s, f) => s + (f.amount - f.paidAmount), 0);
	return {
		pending,
		paid: rs.reduce((s, f) => s + f.paidAmount, 0),
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
