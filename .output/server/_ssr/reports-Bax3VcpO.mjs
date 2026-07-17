import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { s as cn, t as Button } from "./db-_-56JTAZ.mjs";
import { c as useHydrated, d as useStudents, i as STANDARDS, o as useAttendance, s as useFees, t as Badge } from "./hooks-P7UI8aLI.mjs";
import { B as FileSpreadsheet, J as CircleX, W as Download, at as ChartColumn, it as CheckCheck, l as TrendingUp, r as Users } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as PageHeader } from "./AppShell-BP_3GgOB.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-HRfI_rwd.mjs";
import { t as StatCard } from "./StatCard-B6Zbhul9.mjs";
import { i as studentAttendancePct } from "./derive-B-AOoH3y.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CbpQSt_x.mjs";
import { a as XAxis, c as Bar, d as ResponsiveContainer, f as Tooltip, i as YAxis, l as Pie, n as BarChart, o as Line, p as Legend, r as LineChart, s as CartesianGrid, t as PieChart, u as Cell } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-Bax3VcpO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MONTH_NAMES = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];
function ReportsPage() {
	const hydrated = useHydrated();
	const [students] = useStudents();
	const [attendance] = useAttendance();
	const [fees] = useFees();
	const [activeTab, setActiveTab] = (0, import_react.useState)("export");
	const [range, setRange] = (0, import_react.useState)("14");
	const [scope, setScope] = (0, import_react.useState)("all");
	const [reportType, setReportType] = (0, import_react.useState)("attendance");
	const [selectedYear, setSelectedYear] = (0, import_react.useState)((/* @__PURE__ */ new Date()).getFullYear().toString());
	const [selectedMonth, setSelectedMonth] = (0, import_react.useState)(((/* @__PURE__ */ new Date()).getMonth() + 1).toString().padStart(2, "0"));
	const [selectedDay, setSelectedDay] = (0, import_react.useState)("all");
	const [selectedStandard, setSelectedStandard] = (0, import_react.useState)("all");
	const years = [
		"2026",
		"2025",
		"2024"
	];
	const months = (0, import_react.useMemo)(() => [{
		value: "all",
		label: "All Months"
	}, ...MONTH_NAMES.map((name, i) => ({
		value: String(i + 1).padStart(2, "0"),
		label: name
	}))], []);
	const days = (0, import_react.useMemo)(() => [{
		value: "all",
		label: "All Days"
	}, ...Array.from({ length: 31 }, (_, i) => ({
		value: String(i + 1).padStart(2, "0"),
		label: String(i + 1)
	}))], []);
	const filteredAttendance = (0, import_react.useMemo)(() => {
		return attendance.filter((r) => {
			const s = students.find((st) => st.id === r.studentId);
			if (!s) return false;
			if (selectedStandard !== "all" && s.standard !== selectedStandard) return false;
			const [year, month, day] = r.date.split("-");
			if (year !== selectedYear) return false;
			if (selectedMonth !== "all" && month !== selectedMonth) return false;
			if (selectedDay !== "all" && day !== selectedDay.padStart(2, "0")) return false;
			return true;
		});
	}, [
		attendance,
		students,
		selectedYear,
		selectedMonth,
		selectedDay,
		selectedStandard
	]);
	const filteredFees = (0, import_react.useMemo)(() => {
		return fees.filter((f) => {
			const s = students.find((st) => st.id === f.studentId);
			if (!s) return false;
			if (selectedStandard !== "all" && s.standard !== selectedStandard) return false;
			const [year, month] = f.month.split("-");
			if (year !== selectedYear) return false;
			if (selectedMonth !== "all" && month !== selectedMonth) return false;
			if (selectedDay !== "all") {
				if (!f.paidDate) return false;
				const [, , day] = f.paidDate.split("-");
				if (day !== selectedDay.padStart(2, "0")) return false;
			}
			return true;
		});
	}, [
		fees,
		students,
		selectedYear,
		selectedMonth,
		selectedDay,
		selectedStandard
	]);
	const scoped = (0, import_react.useMemo)(() => scope === "all" ? attendance : attendance.filter((r) => students.find((s) => s.id === r.studentId)?.standard === scope), [
		attendance,
		students,
		scope
	]);
	const overall = (0, import_react.useMemo)(() => {
		const rs = scoped.filter((r) => r.status !== "Holiday");
		const present = rs.filter((r) => r.status === "Present" || r.status === "Late").length;
		return {
			present,
			absent: rs.filter((r) => r.status === "Absent").length,
			pct: rs.length ? Math.round(present / rs.length * 100) : 0,
			total: rs.length
		};
	}, [scoped]);
	const trend = (0, import_react.useMemo)(() => {
		const days = Number(range);
		const out = [];
		for (let i = days - 1; i >= 0; i--) {
			const d = /* @__PURE__ */ new Date();
			d.setDate(d.getDate() - i);
			const ds = d.toISOString().slice(0, 10);
			const rs = scoped.filter((r) => r.date === ds && r.status !== "Holiday");
			const present = rs.filter((r) => r.status === "Present" || r.status === "Late").length;
			const absent = rs.filter((r) => r.status === "Absent").length;
			out.push({
				day: d.toLocaleDateString("en", {
					day: "2-digit",
					month: "short"
				}),
				pct: rs.length ? Math.round(present / rs.length * 100) : 0,
				present,
				absent
			});
		}
		return out;
	}, [scoped, range]);
	const pieData = (0, import_react.useMemo)(() => {
		const rs = scoped;
		return [
			{
				name: "Present",
				value: rs.filter((r) => r.status === "Present").length,
				color: "oklch(0.65 0.18 150)"
			},
			{
				name: "Late",
				value: rs.filter((r) => r.status === "Late").length,
				color: "oklch(0.75 0.18 85)"
			},
			{
				name: "Absent",
				value: rs.filter((r) => r.status === "Absent").length,
				color: "oklch(0.6 0.24 25)"
			},
			{
				name: "Holiday",
				value: rs.filter((r) => r.status === "Holiday").length,
				color: "oklch(0.62 0.19 260)"
			}
		];
	}, [scoped]);
	const stdWise = (0, import_react.useMemo)(() => STANDARDS.map((s) => {
		const ids = students.filter((st) => st.standard === s).map((st) => st.id);
		const rs = attendance.filter((r) => ids.includes(r.studentId) && r.status !== "Holiday");
		const present = rs.filter((r) => r.status === "Present" || r.status === "Late").length;
		return {
			standard: s,
			pct: rs.length ? Math.round(present / rs.length * 100) : 0
		};
	}), [students, attendance]);
	const studentWise = (0, import_react.useMemo)(() => students.map((s) => ({
		name: s.name,
		pct: studentAttendancePct(s.id, attendance),
		standard: s.standard
	})).sort((a, b) => b.pct - a.pct).slice(0, 10), [students, attendance]);
	const downloadAttendanceReport = () => {
		const headers = [
			"Student Name",
			"Standard",
			"Section",
			"Date (DD/MM/YYYY)",
			"Status",
			"Remarks"
		];
		const rows = filteredAttendance.map((r) => {
			const s = students.find((st) => st.id === r.studentId);
			return [
				s ? s.name : "Unknown",
				s ? s.standard : "—",
				s ? s.section : "—",
				r.date.split("-").reverse().join("/"),
				r.status,
				r.remarks || "—"
			];
		});
		const csvContent = [headers.join(","), ...rows.map((row) => row.map((val) => {
			const strVal = String(val === void 0 || val === null ? "" : val);
			if (strVal.includes(",") || strVal.includes("\"") || strVal.includes("\n")) return `"${strVal.replace(/"/g, "\"\"")}"`;
			return strVal;
		}).join(","))].join("\n");
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", `Attendance_Report_${selectedYear}_${selectedMonth}_${selectedDay}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		toast.success("Attendance report downloaded successfully!");
	};
	const downloadFeesReport = () => {
		const headers = [
			"Student Name",
			"Standard",
			"Section",
			"Fee Month",
			"Fee Amount",
			"Status",
			"Paid Amount",
			"Payment Date (Full)",
			"Paid Day",
			"Paid Month",
			"Paid Year"
		];
		const rows = filteredFees.map((f) => {
			const s = students.find((st) => st.id === f.studentId);
			const studentName = s ? s.name : "Unknown";
			const standard = s ? s.standard : "—";
			const section = s ? s.section : "—";
			let paidDay = "—";
			let paidMonth = "—";
			let paidYear = "—";
			let fullPaidDate = "—";
			if (f.paidDate) {
				const parts = f.paidDate.split("-");
				paidDay = parseInt(parts[2], 10).toString();
				paidMonth = MONTH_NAMES[parseInt(parts[1], 10) - 1];
				paidYear = parts[0];
				fullPaidDate = parts.reverse().join("/");
			}
			return [
				studentName,
				standard,
				section,
				f.month,
				f.amount,
				f.status,
				f.paidAmount,
				fullPaidDate,
				paidDay,
				paidMonth,
				paidYear
			];
		});
		const csvContent = [headers.join(","), ...rows.map((row) => row.map((val) => {
			const strVal = String(val === void 0 || val === null ? "" : val);
			if (strVal.includes(",") || strVal.includes("\"") || strVal.includes("\n")) return `"${strVal.replace(/"/g, "\"\"")}"`;
			return strVal;
		}).join(","))].join("\n");
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", `Fees_Report_${selectedYear}_${selectedMonth}_${selectedDay}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		toast.success("Fees report downloaded successfully!");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Institute Reports",
				description: "Search, view, and export student reports for attendance and fee collection."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex border-b border-border/60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setActiveTab("export"),
					className: cn("flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold transition-all", activeTab === "export" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-4.5 w-4.5" }), " Export Reports Center"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setActiveTab("charts"),
					className: cn("flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold transition-all", activeTab === "charts" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-4.5 w-4.5" }), " Visual Analytics"]
				})]
			}),
			!hydrated ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "glass rounded-2xl p-12 text-center text-muted-foreground",
				children: "Loading report workspace..."
			}) : activeTab === "export" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass rounded-2xl p-5 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-bold uppercase tracking-wider text-muted-foreground",
							children: "Select Filter Criteria"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2 md:grid-cols-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-semibold",
										children: "Report Type"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: reportType,
										onValueChange: (v) => setReportType(v),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "h-10 rounded-xl bg-card border-border/60",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "attendance",
											children: "Attendance Records"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "fees",
											children: "Fees Collections"
										})] })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-semibold",
										children: "Standard"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: selectedStandard,
										onValueChange: setSelectedStandard,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "h-10 rounded-xl bg-card border-border/60",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "all",
											children: "All Standards"
										}), STANDARDS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: s,
											children: s
										}, s))] })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-semibold",
										children: "Year"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: selectedYear,
										onValueChange: setSelectedYear,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "h-10 rounded-xl bg-card border-border/60",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: years.map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: y,
											children: y
										}, y)) })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-semibold",
										children: "Month"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: selectedMonth,
										onValueChange: setSelectedMonth,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "h-10 rounded-xl bg-card border-border/60",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: months.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: m.value,
											children: m.label
										}, m.value)) })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-semibold",
										children: "Day / Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: selectedDay,
										onValueChange: setSelectedDay,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "h-10 rounded-xl bg-card border-border/60",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: days.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: d.value,
											children: d.label
										}, d.value)) })]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-t border-border/60 pt-4 flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs font-semibold text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-xl border border-border/60",
								children: [
									"Found ",
									reportType === "attendance" ? filteredAttendance.length : filteredFees.length,
									" matching records"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: reportType === "attendance" ? downloadAttendanceReport : downloadFeesReport,
								disabled: reportType === "attendance" ? filteredAttendance.length === 0 : filteredFees.length === 0,
								className: "rounded-xl gradient-brand shadow-glow",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 h-4 w-4" }), " Download Report (CSV)"]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass rounded-2xl overflow-hidden border border-border/60",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-b border-border/60 bg-secondary/40 px-5 py-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold text-sm",
							children: "Data Preview Table"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto max-h-[500px]",
						children: reportType === "attendance" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
							className: "bg-secondary/25 hover:bg-secondary/25",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Student Name" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Standard" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Section" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Date" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Attendance Status" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Remarks" })
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: filteredAttendance.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							colSpan: 6,
							className: "py-12 text-center text-muted-foreground",
							children: "No matching attendance records found. Adjust your time filters."
						}) }) : filteredAttendance.map((r) => {
							const s = students.find((st) => st.id === r.studentId);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "font-semibold",
									children: s ? s.name : "Unknown"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: s ? s.standard : "—" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: s ? s.section : "—" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "font-mono text-xs",
									children: r.date.split("-").reverse().join("/")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: r.status === "Present" ? "default" : r.status === "Late" ? "secondary" : r.status === "Absent" ? "destructive" : "outline",
									className: cn(r.status === "Present" && "bg-emerald-500 hover:bg-emerald-600 text-white shadow-glow", r.status === "Late" && "bg-amber-500 hover:bg-amber-600 text-white shadow-glow"),
									children: r.status
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-xs text-muted-foreground",
									children: r.remarks || "—"
								})
							] }, r.id);
						}) })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
							className: "bg-secondary/25 hover:bg-secondary/25",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Student Name" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Standard" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Fee Month" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Monthly Fee" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Paid Amount" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Full Paid Date" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Paid Day" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Paid Month" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Paid Year" })
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: filteredFees.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							colSpan: 10,
							className: "py-12 text-center text-muted-foreground",
							children: "No matching fee records found. Adjust your time filters."
						}) }) : filteredFees.map((f) => {
							const s = students.find((st) => st.id === f.studentId);
							let day = "—";
							let monthStr = "—";
							let year = "—";
							let fullDate = "—";
							if (f.paidDate) {
								const parts = f.paidDate.split("-");
								day = parseInt(parts[2], 10).toString();
								monthStr = MONTH_NAMES[parseInt(parts[1], 10) - 1];
								year = parts[0];
								fullDate = parts.reverse().join("/");
							}
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "font-semibold",
									children: s ? s.name : "Unknown"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: s ? s.standard : "—" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "font-mono text-xs",
									children: f.month
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
									className: "font-semibold",
									children: ["₹", f.amount.toLocaleString("en-IN")]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: f.status === "Paid" ? "default" : "destructive",
									className: cn(f.status === "Paid" && "bg-emerald-500 hover:bg-emerald-600 text-white shadow-glow"),
									children: f.status
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: ["₹", f.paidAmount.toLocaleString("en-IN")] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "font-mono text-xs",
									children: fullDate
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "font-mono text-xs",
									children: day
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-xs",
									children: monthStr
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "font-mono text-xs",
									children: year
								})
							] }, f.id);
						}) })] })
					})]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass flex flex-wrap gap-3 rounded-2xl p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: range,
							onValueChange: (v) => setRange(v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-10 w-[160px] rounded-xl bg-card border-border/60",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "7",
									children: "Last 7 days"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "14",
									children: "Last 14 days"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "30",
									children: "Last 30 days"
								})
							] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: scope,
							onValueChange: setScope,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-10 w-[160px] rounded-xl bg-card border-border/60",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "All Standards"
							}), STANDARDS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: s,
								children: s
							}, s))] })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "Overall Attendance",
								value: `${overall.pct}%`,
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-5 w-5" }),
								gradient: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "Total Present",
								value: overall.present,
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "Total Absent",
								value: overall.absent,
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "Records",
								value: overall.total,
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-5 w-5" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 lg:grid-cols-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "glass rounded-2xl p-5 lg:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-4 font-semibold",
								children: "Attendance Trend"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-72",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
									width: "100%",
									height: "100%",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
										data: trend,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
												id: "rLine",
												x1: "0",
												y1: "0",
												x2: "1",
												y2: "0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
													offset: "0%",
													stopColor: "oklch(0.62 0.19 260)"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
													offset: "100%",
													stopColor: "oklch(0.58 0.24 300)"
												})]
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
												strokeDasharray: "3 3",
												stroke: "var(--border)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
												dataKey: "day",
												tick: { fontSize: 11 }
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tick: { fontSize: 11 } }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: { borderRadius: 12 } }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
												dataKey: "pct",
												stroke: "url(#rLine)",
												strokeWidth: 3,
												dot: true
											})
										]
									})
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "glass rounded-2xl p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-4 font-semibold",
								children: "Status Breakdown"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-72",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
									width: "100%",
									height: "100%",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
											data: pieData,
											dataKey: "value",
											nameKey: "name",
											innerRadius: 50,
											outerRadius: 90,
											paddingAngle: 4,
											children: pieData.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: d.color }, i))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {})
									] })
								})
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 lg:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "glass rounded-2xl p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-4 font-semibold",
								children: "Standard-wise Attendance %"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-72",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
									width: "100%",
									height: "100%",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
										data: stdWise,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
												strokeDasharray: "3 3",
												stroke: "var(--border)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
												dataKey: "standard",
												tick: { fontSize: 11 }
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tick: { fontSize: 11 } }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: { borderRadius: 12 } }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
												dataKey: "pct",
												fill: "oklch(0.62 0.19 260)",
												radius: [
													8,
													8,
													0,
													0
												]
											})
										]
									})
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "glass rounded-2xl p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-4 font-semibold",
								children: "Top 10 Students by Attendance"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-2",
								children: studentWise.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-3 rounded-xl p-2 hover:bg-accent/50",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid h-8 w-8 place-items-center rounded-lg gradient-brand text-xs font-bold text-white",
											children: i + 1
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "truncate font-medium",
												children: s.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground",
												children: s.standard
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-sm font-bold text-primary",
											children: [s.pct, "%"]
										})
									]
								}, s.name))
							})]
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { ReportsPage as component };
