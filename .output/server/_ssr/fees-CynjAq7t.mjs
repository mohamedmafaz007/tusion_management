import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { E as uid, M as useStudents, O as useFees, i as Input, j as useSettings, k as useHydrated, n as Button, o as STANDARDS, x as sendWhatsAppReceipt } from "./hooks-BF2-w1wh.mjs";
import { J as CircleCheckBig, U as Clock, b as Printer, j as History, k as LoaderCircle, m as Search, n as Wallet, p as Send, y as Receipt } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as PageHeader } from "./AppShell-Dcrbbbdf.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DRHudf8v.mjs";
import { t as StatCard } from "./StatCard-2InebiRy.mjs";
import { n as FeeStatusBadge } from "./StatusBadges-CSfxUjIn.mjs";
import { a as studentAvatarStyle, n as formatCurrency, r as initials, t as currentMonthKey } from "./derive-JWIEq6tF.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-B6s9-YNu.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-CNKKmYkN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fees-CynjAq7t.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FeesPage() {
	useHydrated();
	const [students] = useStudents();
	const [fees, setFeesState] = useFees();
	const [settings] = useSettings();
	const [q, setQ] = (0, import_react.useState)("");
	const [month, setMonth] = (0, import_react.useState)(currentMonthKey());
	const [standard, setStandard] = (0, import_react.useState)("all");
	const [historyOf, setHistoryOf] = (0, import_react.useState)(null);
	const [receiptOf, setReceiptOf] = (0, import_react.useState)(null);
	const months = (0, import_react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set();
		fees.forEach((f) => set.add(f.month));
		set.add(currentMonthKey());
		return Array.from(set).sort().reverse();
	}, [fees]);
	const rows = (0, import_react.useMemo)(() => {
		return students.filter((s) => (standard === "all" || s.standard === standard) && (!q || s.name.toLowerCase().includes(q.toLowerCase()))).map((s) => {
			return {
				student: s,
				fee: fees.find((f) => f.studentId === s.id && f.month === month) ?? {
					id: "temp-" + s.id,
					studentId: s.id,
					month,
					amount: s.monthlyFees,
					paidAmount: 0,
					status: "Pending"
				}
			};
		});
	}, [
		students,
		fees,
		q,
		month,
		standard
	]);
	const totals = (0, import_react.useMemo)(() => {
		const monthFees = fees.filter((f) => f.month === month);
		const total = monthFees.reduce((s, f) => s + f.amount, 0) + students.filter((s) => !fees.some((f) => f.studentId === s.id && f.month === month)).reduce((s, st) => s + st.monthlyFees, 0);
		const paid = monthFees.reduce((s, f) => s + f.paidAmount, 0);
		return {
			total,
			paid,
			pending: total - paid
		};
	}, [
		fees,
		students,
		month
	]);
	const [isSendingReceipt, setIsSendingReceipt] = (0, import_react.useState)(false);
	const handleManualShare = async (studentId, feeId, name) => {
		setIsSendingReceipt(true);
		const loader = toast.loading(`Sending WhatsApp receipt to ${name}'s parent...`);
		try {
			await sendWhatsAppReceipt({ data: {
				studentId,
				feeId
			} });
			toast.success("WhatsApp receipt sent successfully!", { id: loader });
		} catch (err) {
			console.error("Failed to send manual WhatsApp receipt:", err);
			toast.error(`Failed to send WhatsApp receipt: ${err.message || err}`, { id: loader });
		} finally {
			setIsSendingReceipt(false);
		}
	};
	const markPaid = async (studentId) => {
		const student = students.find((s) => s.id === studentId);
		if (!student) return;
		const existing = fees.find((f) => f.studentId === studentId && f.month === month);
		const paidDate = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
		const feeId = existing ? existing.id : uid();
		if (existing) await setFeesState(fees.map((f) => f.id === existing.id ? {
			...f,
			paidAmount: f.amount,
			status: "Paid",
			paidDate
		} : f));
		else await setFeesState([...fees, {
			id: feeId,
			studentId,
			month,
			amount: student.monthlyFees,
			paidAmount: student.monthlyFees,
			paidDate,
			status: "Paid"
		}]);
		toast.success(`Payment recorded for ${student.name}`);
		if (settings.whatsappProvider === "baileys") {
			if (!(student.fatherMobile || student.motherMobile)) {
				toast.warning("Could not send automated WhatsApp receipt: No parent mobile number found.");
				return;
			}
			const loader = toast.loading(`Sending automated WhatsApp receipt to ${student.name}'s parent...`);
			try {
				await sendWhatsAppReceipt({ data: {
					studentId,
					feeId
				} });
				toast.success("WhatsApp receipt sent successfully!", { id: loader });
			} catch (err) {
				console.error("Failed to send automated WhatsApp receipt:", err);
				toast.error(`Failed to send WhatsApp receipt: ${err.message || err}`, { id: loader });
			}
		}
	};
	const receiptData = (0, import_react.useMemo)(() => {
		if (!receiptOf) return null;
		const s = students.find((st) => st.id === receiptOf.studentId);
		const f = fees.find((ff) => ff.id === receiptOf.feeId);
		return s && f ? {
			s,
			f
		} : null;
	}, [
		receiptOf,
		students,
		fees
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Fees Management",
				description: "Track collections, mark payments and generate receipts."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Fees",
						value: formatCurrency(totals.total),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-5 w-5" }),
						gradient: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Paid",
						value: formatCurrency(totals.paid),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Pending",
						value: formatCurrency(totals.pending),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-5 w-5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass flex flex-wrap gap-3 rounded-2xl p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative min-w-[220px] flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search student…",
							value: q,
							onChange: (e) => setQ(e.target.value),
							className: "h-10 rounded-xl pl-9"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: month,
						onValueChange: setMonth,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-10 w-[160px] rounded-xl",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: months.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: m,
							children: m
						}, m)) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: standard,
						onValueChange: setStandard,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-10 w-[140px] rounded-xl",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All Standards"
						}), STANDARDS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: s,
							children: s
						}, s))] })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "glass overflow-hidden rounded-2xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
						className: "bg-secondary/40 hover:bg-secondary/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Student" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Standard" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Monthly Fee" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Paid" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Pending" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Paid Date" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-right",
								children: "Actions"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						colSpan: 8,
						className: "py-10 text-center text-muted-foreground",
						children: "No students found."
					}) }), rows.map(({ student: s, fee: f }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
						className: "hover:bg-accent/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-9 w-9 place-items-center overflow-hidden rounded-full text-xs font-bold text-white",
									style: s.photo ? void 0 : studentAvatarStyle(s),
									children: s.photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: s.photo,
										alt: "",
										className: "h-full w-full object-cover"
									}) : initials(s.name)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: s.name
								})]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: s.standard }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatCurrency(f.amount) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-emerald-600",
								children: formatCurrency(f.paidAmount)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-destructive",
								children: formatCurrency(f.amount - f.paidAmount)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-xs text-muted-foreground",
								children: f.paidDate ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeeStatusBadge, { status: f.status }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "outline",
										className: "rounded-lg",
										disabled: f.status === "Paid",
										onClick: () => markPaid(s.id),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "mr-1 h-3.5 w-3.5" }), " Mark Paid"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "icon",
										variant: "ghost",
										className: "h-8 w-8",
										onClick: () => f.id.startsWith("temp-") ? toast.error("No payment yet") : setReceiptOf({
											studentId: s.id,
											feeId: f.id
										}),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "icon",
										variant: "ghost",
										className: "h-8 w-8",
										onClick: () => setHistoryOf(s.id),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-4 w-4" })
									})
								]
							}) })
						]
					}, s.id))] })] })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!historyOf,
				onOpenChange: (o) => !o && setHistoryOf(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Fee History" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: students.find((s) => s.id === historyOf)?.name })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-h-[400px] space-y-2 overflow-auto",
					children: [fees.filter((f) => f.studentId === historyOf).sort((a, b) => b.month.localeCompare(a.month)).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-xl border border-border/60 bg-secondary/40 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: f.month
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								"Paid ",
								formatCurrency(f.paidAmount),
								" of ",
								formatCurrency(f.amount)
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeeStatusBadge, { status: f.status })]
					}, f.id)), fees.filter((f) => f.studentId === historyOf).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "No history yet."
					})]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!receiptData,
				onOpenChange: (o) => !o && setReceiptOf(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md print:shadow-none",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Fee Receipt" }) }),
						receiptData && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border/60 p-5 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-3 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-lg font-bold gradient-text",
										children: settings.instituteName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: settings.address
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-8 w-8 text-primary" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-3 border-t border-dashed border-border/60" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											k: "Student",
											v: receiptData.s.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											k: "Standard",
											v: `${receiptData.s.standard} - ${receiptData.s.section}`
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											k: "Month",
											v: receiptData.f.month
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											k: "Amount",
											v: formatCurrency(receiptData.f.amount)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											k: "Paid",
											v: formatCurrency(receiptData.f.paidAmount)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											k: "Date",
											v: receiptData.f.paidDate ?? "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											k: "Receipt #",
											v: receiptData.f.id.slice(0, 8).toUpperCase()
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-3 border-t border-dashed border-border/60" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-center text-xs text-muted-foreground",
									children: "Thank you for your payment."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => setReceiptOf(null),
									children: "Close"
								}),
								settings.whatsappProvider === "baileys" && receiptData && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									className: "border-emerald-500/50 hover:bg-emerald-50/50 hover:text-emerald-700 dark:hover:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400",
									onClick: () => handleManualShare(receiptData.s.id, receiptData.f.id, receiptData.s.name),
									disabled: isSendingReceipt,
									children: isSendingReceipt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Sending..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "mr-2 h-4 w-4" }), " Send via WhatsApp"] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: "gradient-brand",
									onClick: () => window.print(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "mr-2 h-4 w-4" }), " Print"]
								})
							]
						})
					]
				})
			})
		]
	});
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-muted-foreground",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "font-medium",
			children: v
		})]
	});
}
//#endregion
export { FeesPage as component };
