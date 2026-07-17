import { o as __toESM } from "../_runtime.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { s as cn, t as Button } from "./db-BANGggGZ.mjs";
import { c as useHydrated, d as useStudents, i as STANDARDS, o as useAttendance, s as useFees } from "./hooks-B2IK0jt7.mjs";
import { W as Download, a as UserPlus, at as ChartColumn, ct as CalendarCheck, ft as ArrowRight, i as UserX, l as TrendingUp, lt as BookOpen, n as Wallet, o as UserCheck, r as Users } from "../_libs/lucide-react.mjs";
import { n as PageHeader } from "./AppShell-pCQyChd3.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DuOfTFjk.mjs";
import { t as StatCard } from "./StatCard-DIxV5lD_.mjs";
import { a as studentAvatarStyle, n as formatCurrency, r as initials, s as todayKey, t as currentMonthKey } from "./derive-B-AOoH3y.mjs";
import { a as XAxis, c as Bar, d as ResponsiveContainer, f as Tooltip, i as YAxis, l as Pie, n as BarChart, o as Line, p as Legend, r as LineChart, s as CartesianGrid, t as PieChart, u as Cell } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Crmog9rZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-primary/10", className),
		...props
	});
}
function DashboardPage() {
	const hydrated = useHydrated();
	const [students] = useStudents();
	const [attendance] = useAttendance();
	const [fees] = useFees();
	const availableMonths = (0, import_react.useMemo)(() => {
		const months = [];
		const now = /* @__PURE__ */ new Date();
		for (let i = 0; i < 12; i++) {
			const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
			const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
			const label = d.toLocaleDateString("en-IN", {
				month: "long",
				year: "numeric"
			});
			months.push({
				value: val,
				label
			});
		}
		return months;
	}, []);
	const [reportMonth, setReportMonth] = (0, import_react.useState)(availableMonths[0].value);
	const downloadMonthlyReport = () => {
		const headers = [
			"Student Name",
			"Standard",
			"Section",
			"Gender",
			"Parent Name",
			"Father Mobile",
			"Mother Mobile",
			"Monthly Fee",
			`Fee Status (${reportMonth})`,
			`Paid Amount (${reportMonth})`,
			`Payment Date (${reportMonth})`,
			`Present Days (${reportMonth})`,
			`Absent Days (${reportMonth})`,
			`Late Days (${reportMonth})`,
			`Attendance % (${reportMonth})`
		];
		const rows = students.map((s) => {
			const sFee = fees.find((f) => f.studentId === s.id && f.month === reportMonth);
			const feeStatus = sFee ? sFee.status : "Pending";
			const paidAmount = sFee ? sFee.paidAmount : 0;
			const paidDate = sFee && sFee.paidDate ? sFee.paidDate : "—";
			const mRecs = attendance.filter((r) => r.studentId === s.id && r.date.startsWith(reportMonth) && r.status !== "Holiday");
			const uniqueDates = /* @__PURE__ */ new Map();
			for (const r of mRecs) uniqueDates.set(r.date, r);
			const uniqueMRecs = Array.from(uniqueDates.values());
			const totalDays = uniqueMRecs.length;
			const present = uniqueMRecs.filter((r) => r.status === "Present").length;
			const absent = uniqueMRecs.filter((r) => r.status === "Absent").length;
			const late = uniqueMRecs.filter((r) => r.status === "Late").length;
			const totalPresent = present + late;
			const attPct = totalDays ? Math.round(totalPresent / totalDays * 100) : 100;
			return [
				s.name,
				s.standard,
				s.section || "—",
				s.gender || "—",
				s.parentName || "—",
				s.fatherMobile || "—",
				s.motherMobile || "—",
				s.monthlyFees,
				feeStatus,
				paidAmount,
				paidDate,
				present,
				absent,
				late,
				`${attPct}%`
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
		link.setAttribute("download", `Monthly_Report_${reportMonth}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	const stats = (0, import_react.useMemo)(() => {
		const today = todayKey();
		const todayRecs = attendance.filter((r) => r.date === today);
		const present = todayRecs.filter((r) => r.status === "Present" || r.status === "Late").length;
		const absent = todayRecs.filter((r) => r.status === "Absent").length;
		const cm = currentMonthKey();
		const monthFees = fees.filter((f) => f.month === cm);
		const collected = monthFees.reduce((s, f) => s + f.paidAmount, 0);
		const pending = monthFees.reduce((s, f) => s + (f.amount - f.paidAmount), 0);
		const total = attendance.length;
		const presentAll = attendance.filter((r) => r.status === "Present" || r.status === "Late").length;
		return {
			present,
			absent,
			collected,
			pending,
			attPct: total ? Math.round(presentAll / total * 100) : 0
		};
	}, [attendance, fees]);
	const stdCounts = (0, import_react.useMemo)(() => STANDARDS.map((s) => ({
		standard: s,
		count: students.filter((st) => st.standard === s).length
	})), [students]);
	const trend = (0, import_react.useMemo)(() => {
		const days = 7;
		const out = [];
		for (let i = days - 1; i >= 0; i--) {
			const d = /* @__PURE__ */ new Date();
			d.setDate(d.getDate() - i);
			const ds = d.toISOString().slice(0, 10);
			const rs = attendance.filter((r) => r.date === ds && r.status !== "Holiday");
			const present = rs.filter((r) => r.status === "Present" || r.status === "Late").length;
			out.push({
				day: d.toLocaleDateString("en", { weekday: "short" }),
				pct: rs.length ? Math.round(present / rs.length * 100) : 0
			});
		}
		return out;
	}, [attendance]);
	const feeTrend = (0, import_react.useMemo)(() => {
		const out = [];
		for (let i = 5; i >= 0; i--) {
			const d = /* @__PURE__ */ new Date();
			d.setMonth(d.getMonth() - i);
			const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
			const rs = fees.filter((f) => f.month === key);
			out.push({
				month: d.toLocaleDateString("en", { month: "short" }),
				collected: rs.reduce((s, f) => s + f.paidAmount, 0),
				pending: rs.reduce((s, f) => s + (f.amount - f.paidAmount), 0)
			});
		}
		return out;
	}, [fees]);
	const pieData = (0, import_react.useMemo)(() => {
		const today = todayKey();
		const rs = attendance.filter((r) => r.date === today);
		const p = rs.filter((r) => r.status === "Present").length;
		const a = rs.filter((r) => r.status === "Absent").length;
		const l = rs.filter((r) => r.status === "Late").length;
		return [
			{
				name: "Present",
				value: p,
				color: "oklch(0.65 0.18 150)"
			},
			{
				name: "Absent",
				value: a,
				color: "oklch(0.6 0.24 25)"
			},
			{
				name: "Late",
				value: l,
				color: "oklch(0.75 0.18 85)"
			}
		];
	}, [attendance]);
	const recent = (0, import_react.useMemo)(() => [...students].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5), [students]);
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4",
		children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-32 rounded-2xl" }, i))
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Dashboard",
				description: "A quick overview of your institute today.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: reportMonth,
						onValueChange: setReportMonth,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-[170px] h-10 rounded-xl bg-card border-border/60",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Month" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: availableMonths.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: m.value,
							children: m.label
						}, m.value)) })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: downloadMonthlyReport,
						className: "rounded-xl gradient-brand shadow-glow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 h-4 w-4" }), " Download Report"]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Students",
						value: students.length,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-5 w-5" }),
						gradient: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Present Today",
						value: stats.present,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-5 w-5" }),
						trend: {
							value: "+8%",
							positive: true
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Absent Today",
						value: stats.absent,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserX, { className: "h-5 w-5" }),
						trend: {
							value: "-2",
							positive: true
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Attendance %",
						value: `${stats.attPct}%`,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Monthly Collection",
						value: formatCurrency(stats.collected),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Pending Fees",
						value: formatCurrency(stats.pending),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Standards",
						value: STANDARDS.length,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Recent Joinings",
						value: recent.length,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-5 w-5" }),
						hint: "Last additions"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass rounded-2xl p-5 lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-4 flex items-center justify-between",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold",
							children: "Attendance Trend"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Last 7 days"
						})] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-64",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
								data: trend,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: "lineGrad",
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
										tick: { fontSize: 12 }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tick: { fontSize: 12 } }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										borderRadius: 12,
										border: "1px solid var(--border)"
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "pct",
										stroke: "url(#lineGrad)",
										strokeWidth: 3,
										dot: { r: 4 }
									})
								]
							})
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass rounded-2xl p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold",
							children: "Today's Attendance"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Breakdown of statuses"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-64",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
										data: pieData,
										dataKey: "value",
										nameKey: "name",
										innerRadius: 45,
										outerRadius: 80,
										paddingAngle: 4,
										children: pieData.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: d.color }, i))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {})
								] })
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass rounded-2xl p-5 lg:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold",
							children: "Standard-wise Students"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-4 text-xs text-muted-foreground",
							children: "Distribution across classes"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-64",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
									data: stdCounts,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
											id: "barGrad",
											x1: "0",
											y1: "0",
											x2: "0",
											y2: "1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
												offset: "0%",
												stopColor: "oklch(0.58 0.24 300)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
												offset: "100%",
												stopColor: "oklch(0.62 0.19 260)"
											})]
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											stroke: "var(--border)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "standard",
											tick: { fontSize: 12 }
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tick: { fontSize: 12 } }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
											borderRadius: 12,
											border: "1px solid var(--border)"
										} }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: "count",
											fill: "url(#barGrad)",
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
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass rounded-2xl p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold",
							children: "Fee Collection Trend"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-4 text-xs text-muted-foreground",
							children: "Last 6 months"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-64",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
									data: feeTrend,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											stroke: "var(--border)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "month",
											tick: { fontSize: 11 }
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tick: { fontSize: 11 } }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
											borderRadius: 12,
											border: "1px solid var(--border)"
										} }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: "collected",
											fill: "oklch(0.62 0.19 260)",
											radius: [
												6,
												6,
												0,
												0
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: "pending",
											fill: "oklch(0.6 0.24 25)",
											radius: [
												6,
												6,
												0,
												0
											]
										})
									]
								})
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass rounded-2xl p-5 lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold",
							children: "Recent Registrations"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/students",
							className: "text-xs font-semibold text-primary hover:underline",
							children: "View all"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "space-y-3",
						children: [recent.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-sm text-muted-foreground",
							children: "No students yet."
						}), recent.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-accent/50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xs font-bold text-white",
									style: s.photo ? void 0 : studentAvatarStyle(s),
									children: s.photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: s.photo,
										alt: s.name,
										className: "h-full w-full rounded-xl object-cover"
									}) : initials(s.name)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate font-medium",
										children: s.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "truncate text-xs text-muted-foreground",
										children: [
											s.standard,
											" • ",
											s.school
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/students/$id",
									params: { id: s.id },
									className: "rounded-lg px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10",
									children: "View"
								})
							]
						}, s.id))]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-semibold",
						children: "Quick Actions"
					}), [
						{
							to: "/students/new",
							label: "Register Student",
							icon: UserPlus,
							desc: "Add a new admission"
						},
						{
							to: "/attendance",
							label: "Mark Attendance",
							icon: CalendarCheck,
							desc: "Today's attendance"
						},
						{
							to: "/fees",
							label: "Collect Fees",
							icon: Wallet,
							desc: "Record fee payments"
						},
						{
							to: "/reports",
							label: "View Reports",
							icon: ChartColumn,
							desc: "Attendance analytics"
						}
					].map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: q.to,
						className: "glass group flex items-center gap-3 rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-glow",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-11 w-11 shrink-0 place-items-center rounded-xl gradient-brand text-white shadow-glow",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(q.icon, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold",
									children: q.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: q.desc
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" })
						]
					}, q.to))]
				})]
			})
		]
	});
}
//#endregion
export { DashboardPage as component };
