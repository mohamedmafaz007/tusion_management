import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { C as useHydrated, E as useStudents, n as Button, x as useAttendance } from "./hooks-BQeneTLO.mjs";
import { G as CircleX, V as Download, b as Printer, l as TrendingUp, r as Users, tt as CheckCheck } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as PageHeader } from "./AppShell-B0zkrLiL.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Ghqj0CD4.mjs";
import { t as StatCard } from "./StatCard-CUMrAwTq.mjs";
import { n as STANDARDS } from "./types-BX1Dn8M6.mjs";
import { i as studentAttendancePct } from "./derive-JWIEq6tF.mjs";
import { a as XAxis, c as Bar, d as ResponsiveContainer, f as Tooltip, i as YAxis, l as Pie, n as BarChart, o as Line, p as Legend, r as LineChart, s as CartesianGrid, t as PieChart, u as Cell } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-IrDNcIzO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReportsPage() {
	useHydrated();
	const [students] = useStudents();
	const [attendance] = useAttendance();
	const [range, setRange] = (0, import_react.useState)("14");
	const [scope, setScope] = (0, import_react.useState)("all");
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Attendance Reports",
				description: "Analytics across dates, standards, and individual students.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					className: "rounded-xl",
					onClick: () => {
						toast.success("PDF export queued (UI demo)");
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 h-4 w-4" }), " Export PDF"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					className: "rounded-xl",
					onClick: () => window.print(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "mr-2 h-4 w-4" }), " Print"]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass flex flex-wrap gap-3 rounded-2xl p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: range,
					onValueChange: (v) => setRange(v),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "h-10 w-[160px] rounded-xl",
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
						className: "h-10 w-[160px] rounded-xl",
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
	});
}
//#endregion
export { ReportsPage as component };
