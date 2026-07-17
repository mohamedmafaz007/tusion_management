import { o as __toESM } from "../_runtime.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { D as useAttendance, M as useStudents, O as useFees, i as Input, k as useHydrated, n as Button, o as STANDARDS, t as Badge, u as cn } from "./hooks-BIRdQpF6.mjs";
import { $ as ChevronLeft, C as Pencil, H as Download, P as Funnel, Q as ChevronRight, V as Eye, a as UserPlus, lt as ArrowUpDown, m as Search, u as Trash2 } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as PageHeader } from "./AppShell-CYiei1zp.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-v0Zn4H8T.mjs";
import { a as studentAvatarStyle, i as studentAttendancePct, n as formatCurrency, o as studentFeeStatus, r as initials } from "./derive-B-AOoH3y.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-D01dPgpw.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-D6foHRfY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/students.index-DjrJRsb7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PAGE_SIZE = 8;
function StudentsPage() {
	const hydrated = useHydrated();
	const [students, setStudentsState] = useStudents();
	const [attendance, setAttendanceState] = useAttendance();
	const [fees, setFeesState] = useFees();
	const navigate = useNavigate();
	const [q, setQ] = (0, import_react.useState)((typeof window !== "undefined" ? new URL(window.location.href) : null)?.searchParams.get("q") ?? "");
	const [standard, setStandard] = (0, import_react.useState)("all");
	const [school, setSchool] = (0, import_react.useState)("all");
	const [feeStatus, setFeeStatus] = (0, import_react.useState)("all");
	const [sortAsc, setSortAsc] = (0, import_react.useState)(true);
	const [page, setPage] = (0, import_react.useState)(1);
	const [deleteId, setDeleteId] = (0, import_react.useState)(null);
	const schools = (0, import_react.useMemo)(() => Array.from(new Set(students.map((s) => s.school))).sort(), [students]);
	const filtered = (0, import_react.useMemo)(() => {
		let out = students.filter((s) => {
			const matchQ = !q || s.name.toLowerCase().includes(q.toLowerCase()) || s.parentName.toLowerCase().includes(q.toLowerCase()) || s.fatherMobile.includes(q);
			const matchStd = standard === "all" || s.standard === standard;
			const matchSch = school === "all" || s.school === school;
			const fs = studentFeeStatus(s.id, fees);
			const matchFee = feeStatus === "all" || feeStatus === "paid" && !fs.hasPending || feeStatus === "pending" && fs.hasPending;
			return matchQ && matchStd && matchSch && matchFee;
		});
		out = out.sort((a, b) => sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
		return out;
	}, [
		students,
		q,
		standard,
		school,
		feeStatus,
		fees,
		sortAsc
	]);
	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
	const handleDelete = () => {
		if (!deleteId) return;
		setStudentsState(students.filter((s) => s.id !== deleteId));
		setAttendanceState(attendance.filter((a) => a.studentId !== deleteId));
		setFeesState(fees.filter((f) => f.studentId !== deleteId));
		toast.success("Student deleted");
		setDeleteId(null);
	};
	const exportCsv = () => {
		const csv = [[
			"Name",
			"School",
			"Standard",
			"Parent",
			"Mobile",
			"Fees"
		], ...filtered.map((s) => [
			s.name,
			s.school,
			s.standard,
			s.parentName,
			s.fatherMobile,
			String(s.monthlyFees)
		])].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
		const blob = new Blob([csv], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "students.csv";
		a.click();
		URL.revokeObjectURL(url);
		toast.success("Exported to CSV");
	};
	const activeFilters = [
		standard !== "all" && {
			label: `Std: ${standard}`,
			clear: () => setStandard("all")
		},
		school !== "all" && {
			label: `School: ${school}`,
			clear: () => setSchool("all")
		},
		feeStatus !== "all" && {
			label: `Fees: ${feeStatus}`,
			clear: () => setFeeStatus("all")
		},
		q && {
			label: `Search: ${q}`,
			clear: () => setQ("")
		}
	].filter(Boolean);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Students",
				description: `${filtered.length} of ${students.length} students`,
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: exportCsv,
					className: "rounded-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 h-4 w-4" }), " Export"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "rounded-xl gradient-brand shadow-glow",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/students/new",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "mr-2 h-4 w-4" }), " New Student"]
					})
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-2xl p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative min-w-[220px] flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Search by name, parent, mobile…",
								value: q,
								onChange: (e) => {
									setQ(e.target.value);
									setPage(1);
								},
								className: "h-10 rounded-xl pl-9"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: standard,
							onValueChange: (v) => {
								setStandard(v);
								setPage(1);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-10 w-[140px] rounded-xl",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Standard" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "All Standards"
							}), STANDARDS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: s,
								children: s
							}, s))] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: school,
							onValueChange: (v) => {
								setSchool(v);
								setPage(1);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-10 w-[180px] rounded-xl",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "School" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "All Schools"
							}), schools.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: s,
								children: s
							}, s))] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: feeStatus,
							onValueChange: (v) => {
								setFeeStatus(v);
								setPage(1);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-10 w-[140px] rounded-xl",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Fees" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "All Fees"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "paid",
									children: "Paid"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "pending",
									children: "Pending"
								})
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "h-10 rounded-xl",
							onClick: () => setSortAsc((v) => !v),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "mr-2 h-4 w-4" }),
								" Sort ",
								sortAsc ? "A→Z" : "Z→A"
							]
						})
					]
				}), activeFilters.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-4 w-4 text-muted-foreground" }), activeFilters.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: f.clear,
						className: "animate-in fade-in slide-in-from-left-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition hover:bg-primary/20",
						children: [f.label, " ✕"]
					}, i))]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass overflow-hidden rounded-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
						className: "bg-secondary/40 hover:bg-secondary/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Student" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "School" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Std" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Parent" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Mobile" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Monthly" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Attn %" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-right",
								children: "Actions"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [
						!hydrated && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							colSpan: 8,
							className: "py-12 text-center text-muted-foreground",
							children: "Loading…"
						}) }),
						hydrated && paged.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							colSpan: 8,
							className: "py-12 text-center text-muted-foreground",
							children: "No students match your filters."
						}) }),
						paged.map((s) => {
							studentFeeStatus(s.id, fees);
							const attn = studentAttendancePct(s.id, attendance);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
								className: "group transition-colors hover:bg-accent/40",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full text-xs font-bold text-white",
											style: s.photo ? void 0 : studentAvatarStyle(s),
											children: s.photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: s.photo,
												alt: s.name,
												className: "h-full w-full object-cover"
											}) : initials(s.name)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium",
												children: s.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground",
												children: s.gender
											})]
										})]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "max-w-[180px] truncate",
										children: s.school
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										children: s.standard
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "max-w-[160px] truncate",
										children: s.parentName
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "font-mono text-xs",
										children: s.fatherMobile
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatCurrency(s.monthlyFees) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: cn("font-semibold", attn >= 75 ? "text-emerald-600" : attn >= 50 ? "text-amber-600" : "text-destructive"),
										children: [attn, "%"]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-end gap-1 opacity-70 transition-opacity group-hover:opacity-100",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "icon",
													variant: "ghost",
													className: "h-8 w-8",
													asChild: true,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
														to: "/students/$id",
														params: { id: s.id },
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "icon",
													variant: "ghost",
													className: "h-8 w-8",
													onClick: () => navigate({
														to: "/students/$id",
														params: { id: s.id },
														search: { edit: "1" }
													}),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "icon",
													variant: "ghost",
													className: "h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive",
													onClick: () => setDeleteId(s.id),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
												})
											]
										})
									})
								]
							}, s.id);
						})
					] })] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 border-t border-border/60 px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground",
						children: [
							"Page ",
							currentPage,
							" of ",
							totalPages
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "outline",
								className: "h-8 w-8 rounded-lg",
								disabled: currentPage === 1,
								onClick: () => setPage((p) => Math.max(1, p - 1)),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
							}),
							Array.from({ length: totalPages }).slice(0, 5).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: currentPage === i + 1 ? "default" : "outline",
								className: cn("h-8 w-8 rounded-lg p-0", currentPage === i + 1 && "gradient-brand text-white"),
								onClick: () => setPage(i + 1),
								children: i + 1
							}, i)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "outline",
								className: "h-8 w-8 rounded-lg",
								disabled: currentPage === totalPages,
								onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-2xl p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-3 font-semibold",
					children: "Filter by Standard"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							setStandard("all");
							setPage(1);
						},
						className: cn("rounded-full border px-4 py-1.5 text-sm font-medium transition", standard === "all" ? "gradient-brand border-transparent text-white shadow-glow" : "border-border hover:bg-accent"),
						children: [
							"All (",
							students.length,
							")"
						]
					}), STANDARDS.map((s) => {
						const count = students.filter((st) => st.standard === s).length;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								setStandard(s);
								setPage(1);
							},
							className: cn("rounded-full border px-4 py-1.5 text-sm font-medium transition", standard === s ? "gradient-brand border-transparent text-white shadow-glow" : "border-border hover:bg-accent"),
							children: [
								s,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-1 opacity-70",
									children: [
										"(",
										count,
										")"
									]
								})
							]
						}, s);
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: !!deleteId,
				onOpenChange: (o) => !o && setDeleteId(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Delete this student?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "This will permanently remove the student and cannot be undone." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					onClick: handleDelete,
					className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
					children: "Delete"
				})] })] })
			})
		]
	});
}
//#endregion
export { StudentsPage as component };
