import { o as __toESM } from "../_runtime.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { C as sendMonthlyFeeReminders, S as sendFeeOverdueReminders, _ as getMessageLogStats, a as checkAndSendFestivalGreetings, d as getBaileysStatus, i as checkAndSendBirthdayWishes, l as deleteDbMessageLog, o as clearAllDbMessageLogs, t as Button, v as getMessageLogs } from "./db-_-56JTAZ.mjs";
import { c as useHydrated } from "./hooks-P7UI8aLI.mjs";
import { E as MessageSquare, F as Gift, K as Clock, Q as CircleAlert, X as CircleCheck, Y as CircleQuestionMark, c as TriangleAlert, et as ChevronRight, f as Sparkles, j as LoaderCircle, m as Send, p as Settings, tt as ChevronLeft, u as Trash2, y as RefreshCw } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as PageHeader } from "./AppShell-_OWaNo8O.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-HRfI_rwd.mjs";
import { t as StatCard } from "./StatCard-B6Zbhul9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/messages-kMbdhOZb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TYPE_LABELS = {
	welcome: {
		label: "Welcome / Form",
		color: "bg-blue-500/10 text-blue-500 border-blue-500/20"
	},
	attendance: {
		label: "Attendance",
		color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
	},
	fee_reminder: {
		label: "Fee Reminder",
		color: "bg-amber-500/10 text-amber-500 border-amber-500/20"
	},
	fee_receipt: {
		label: "Fee Receipt",
		color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
	},
	birthday: {
		label: "Birthday Wish",
		color: "bg-pink-500/10 text-pink-500 border-pink-500/20"
	},
	fee_overdue: {
		label: "Fee Overdue",
		color: "bg-red-500/10 text-red-500 border-red-500/20"
	}
};
function MessageLogsPage() {
	useHydrated();
	const [logs, setLogs] = (0, import_react.useState)([]);
	const [stats, setStats] = (0, import_react.useState)({
		total: 0,
		sent: 0,
		failed: 0,
		today: 0,
		byType: {}
	});
	const [wsStatus, setWsStatus] = (0, import_react.useState)("disconnected");
	const [filterType, setFilterType] = (0, import_react.useState)("all");
	const [filterStatus, setFilterStatus] = (0, import_react.useState)("all");
	const [page, setPage] = (0, import_react.useState)(0);
	const [totalRecords, setTotalRecords] = (0, import_react.useState)(0);
	const [isRefreshing, setIsRefreshing] = (0, import_react.useState)(false);
	const [isSendingReminders, setIsSendingReminders] = (0, import_react.useState)(false);
	const [isSendingOverdue, setIsSendingOverdue] = (0, import_react.useState)(false);
	const [isSendingBirthdays, setIsSendingBirthdays] = (0, import_react.useState)(false);
	const [selectedMonth, setSelectedMonth] = (0, import_react.useState)(() => {
		const d = /* @__PURE__ */ new Date();
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
	});
	const limit = 15;
	const fetchStatsAndStatus = async () => {
		try {
			const [sData, wsData] = await Promise.all([getMessageLogStats(), getBaileysStatus()]);
			setStats(sData);
			setWsStatus(wsData.status);
		} catch (err) {
			console.error("Failed to load message stats/status:", err);
		}
	};
	const fetchLogs = async () => {
		setIsRefreshing(true);
		try {
			const queryType = filterType === "all" ? void 0 : filterType;
			const queryStatus = filterStatus === "all" ? void 0 : filterStatus;
			const res = await getMessageLogs({ data: {
				limit,
				offset: page * limit,
				type: queryType,
				status: queryStatus
			} });
			setLogs(res.logs);
			setTotalRecords(res.total);
		} catch (err) {
			console.error("Failed to load logs:", err);
			toast.error("Failed to load message logs");
		} finally {
			setIsRefreshing(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchStatsAndStatus();
		fetchLogs();
	}, [
		filterType,
		filterStatus,
		page
	]);
	(0, import_react.useEffect)(() => {
		const t = setInterval(fetchStatsAndStatus, 1e4);
		return () => clearInterval(t);
	}, []);
	const totalPages = Math.ceil(totalRecords / limit);
	const handleRefreshAll = () => {
		fetchStatsAndStatus();
		fetchLogs();
		toast.success("Logs and stats updated!");
	};
	const handleDeleteLog = async (id) => {
		if (!confirm("Are you sure you want to delete this message log?")) return;
		try {
			if ((await deleteDbMessageLog({ data: id })).success) {
				toast.success("Message log deleted");
				fetchStatsAndStatus();
				fetchLogs();
			} else toast.error("Failed to delete message log");
		} catch (err) {
			toast.error(`Error: ${err.message || err}`);
		}
	};
	const handleClearAllLogs = async () => {
		if (!confirm("Are you sure you want to clear ALL message logs? This cannot be undone.")) return;
		try {
			if ((await clearAllDbMessageLogs()).success) {
				toast.success("All message logs cleared");
				fetchStatsAndStatus();
				fetchLogs();
			} else toast.error("Failed to clear message logs");
		} catch (err) {
			toast.error(`Error: ${err.message || err}`);
		}
	};
	const triggerFeeReminders = async () => {
		if (wsStatus !== "connected") {
			toast.error("WhatsApp must be connected to send automated reminders. Please pair in Settings.");
			return;
		}
		setIsSendingReminders(true);
		const loader = toast.loading(`Checking and sending pending fee reminders...`);
		try {
			const res = await sendMonthlyFeeReminders({ data: { month: selectedMonth } });
			if (res.manual) toast.error("WhatsApp provider is set to manual. Cannot send automatic bulk alerts.", { id: loader });
			else {
				toast.success(`Success! Sent ${res.sent} fee reminders (${res.failed} failed)`, { id: loader });
				handleRefreshAll();
			}
		} catch (err) {
			toast.error(`Failed: ${err.message || err}`, { id: loader });
		} finally {
			setIsSendingReminders(false);
		}
	};
	const triggerOverdueAlerts = async () => {
		if (wsStatus !== "connected") {
			toast.error("WhatsApp must be connected to send automated reminders. Please pair in Settings.");
			return;
		}
		setIsSendingOverdue(true);
		const loader = toast.loading(`Checking and sending overdue alerts...`);
		try {
			const res = await sendFeeOverdueReminders({ data: { month: selectedMonth } });
			if (res.manual) toast.error("WhatsApp provider is set to manual. Cannot send automatic bulk alerts.", { id: loader });
			else {
				toast.success(`Success! Sent ${res.sent} overdue alerts (${res.failed} failed)`, { id: loader });
				handleRefreshAll();
			}
		} catch (err) {
			toast.error(`Failed: ${err.message || err}`, { id: loader });
		} finally {
			setIsSendingOverdue(false);
		}
	};
	const triggerBirthdayWishes = async () => {
		if (wsStatus !== "connected") {
			toast.error("WhatsApp must be connected to send automated wishes. Please pair in Settings.");
			return;
		}
		setIsSendingBirthdays(true);
		const loader = toast.loading(`Checking for today's birthdays...`);
		try {
			const res = await checkAndSendBirthdayWishes();
			if (res.manual) toast.error("WhatsApp provider is set to manual. Cannot send birthday wishes automatically.", { id: loader });
			else if (res.birthdaysFound === 0) toast.info("No student birthdays found for today.", { id: loader });
			else {
				toast.success(`Success! Dispatched ${res.sent} birthday wishes (${res.failed} failed)`, { id: loader });
				handleRefreshAll();
			}
		} catch (err) {
			toast.error(`Failed: ${err.message || err}`, { id: loader });
		} finally {
			setIsSendingBirthdays(false);
		}
	};
	const [isSendingFestivals, setIsSendingFestivals] = (0, import_react.useState)(false);
	const triggerFestivalGreetings = async () => {
		if (wsStatus !== "connected") {
			toast.error("WhatsApp must be connected to send automated greetings. Please pair in Settings.");
			return;
		}
		setIsSendingFestivals(true);
		const loader = toast.loading(`Checking for today's Indian festivals...`);
		try {
			const res = await checkAndSendFestivalGreetings();
			if (res.manual) toast.error("WhatsApp provider is set to manual. Cannot send festival greetings automatically.", { id: loader });
			else if (!res.festival) toast.info("No Indian festival greetings registered for today's date.", { id: loader });
			else {
				toast.success(`Success! Dispatched ${res.sent} wishes for ${res.festival} (${res.failed} failed)`, { id: loader });
				handleRefreshAll();
			}
		} catch (err) {
			toast.error(`Failed: ${err.message || err}`, { id: loader });
		} finally {
			setIsSendingFestivals(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Message Logs & Automation",
				description: "Monitor automated parent notifications and trigger mass WhatsApp alerts.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					className: "rounded-xl",
					onClick: handleRefreshAll,
					disabled: isRefreshing,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}` }), "Refresh Dashboard"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Automated",
						value: stats.total,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-5 w-5" }),
						gradient: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Today's Outbox",
						value: stats.today,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Failed Deliveries",
						value: stats.failed,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-5 w-5" }),
						hint: stats.failed > 0 ? "Check logs below" : void 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass relative overflow-hidden rounded-2xl p-5 border border-border/50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
									children: "WhatsApp Status"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-full bg-accent/60 p-2 text-accent-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex items-baseline gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-2xl font-bold tracking-tight",
									children: wsStatus === "connected" ? "Connected" : wsStatus === "connecting" ? "Connecting" : "Offline"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-2.5 w-2.5 rounded-full ${wsStatus === "connected" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : wsStatus === "connecting" ? "bg-amber-500 animate-pulse" : "bg-red-500"}` })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex justify-between items-center text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Direct Baileys Web connection"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/settings",
									className: "font-semibold text-primary hover:underline flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-3 w-3" }), " Configure"]
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-2xl p-6 border border-border/50 space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "text-lg font-semibold tracking-tight flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-5 w-5 text-primary" }), "Trigger Automated Campaigns"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 md:grid-cols-2 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col justify-between p-4 rounded-xl border border-border/60 bg-accent/20 hover:bg-accent/30 transition-all",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
										className: "font-bold flex items-center gap-2 text-sm text-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-amber-500" }), "Fee Payment Reminders"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Scans students with unpaid/pending fees for the selected month and automatically alerts parents on WhatsApp."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-[10px] uppercase font-bold text-muted-foreground",
											children: "Reminders Month"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "month",
											value: selectedMonth,
											onChange: (e) => setSelectedMonth(e.target.value),
											className: "mt-1 block w-full text-xs bg-background/50 border border-border rounded-lg p-2 focus:ring-primary focus:border-primary"
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: triggerFeeReminders,
									disabled: isSendingReminders,
									className: "flex-1 rounded-xl text-xs",
									size: "sm",
									children: isSendingReminders ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1 h-3.5 w-3.5 animate-spin" }), " Sending..."] }) : "Send Reminders"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: triggerOverdueAlerts,
									disabled: isSendingOverdue,
									className: "flex-1 rounded-xl text-xs text-red-500 hover:text-red-600 border-red-500/20 hover:bg-red-50 dark:hover:bg-red-950/20",
									size: "sm",
									children: isSendingOverdue ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1 h-3.5 w-3.5 animate-spin" }), " Sending..."] }) : "Send Overdue"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col justify-between p-4 rounded-xl border border-border/60 bg-accent/20 hover:bg-accent/30 transition-all",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
									className: "font-bold flex items-center gap-2 text-sm text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, { className: "h-4 w-4 text-pink-500" }), "Student Birthday Greetings"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground font-normal",
									children: "Checks if any student has a birthday today and automatically delivers a warm wishing template text via WhatsApp."
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: triggerBirthdayWishes,
									disabled: isSendingBirthdays,
									className: "w-full rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs",
									size: "sm",
									children: isSendingBirthdays ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1 h-3.5 w-3.5 animate-spin" }), " Sending..."] }) : "Trigger Birthdays Wish"
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col justify-between p-4 rounded-xl border border-border/60 bg-accent/20 hover:bg-accent/30 transition-all",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
									className: "font-bold flex items-center gap-2 text-sm text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-amber-500" }), "Festival Greetings"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground font-normal",
									children: "Scans today's date for major Indian festivals and automatically delivers a beautiful wishing template to parents."
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: triggerFestivalGreetings,
									disabled: isSendingFestivals,
									className: "w-full rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs",
									size: "sm",
									children: isSendingFestivals ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1 h-3.5 w-3.5 animate-spin" }), " Sending..."] }) : "Trigger Festival Wishes"
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col justify-between p-4 rounded-xl border border-border/60 bg-accent/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
										className: "font-bold flex items-center gap-2 text-sm text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-4 w-4 text-primary" }), "Automated Workflows Info"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-muted-foreground leading-relaxed",
										children: [
											"👉 ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Welcome forms" }),
											" are automatically compiled into A4 registration PDFs and dispatched when a new student is saved."
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-muted-foreground leading-relaxed",
										children: [
											"👉 ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Daily Attendance" }),
											" notifications (Present, Absent, and Late timestamps) will now prompt you to send bulk alerts as soon as you submit the class checklist!"
										]
									})
								]
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-2xl border border-border/50 overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3 p-4 border-b border-border/40 bg-accent/10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-semibold",
								children: "Message Log History"
							}), logs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "destructive",
								size: "sm",
								className: "h-8 rounded-lg text-xs",
								onClick: handleClearAllLogs,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5 mr-1" }), " Clear All Logs"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2 ml-auto",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: filterType,
								onValueChange: (v) => {
									setFilterType(v);
									setPage(0);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-9 w-[150px] rounded-lg text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Types" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "all",
										children: "All Types"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "welcome",
										children: "Welcome Form"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "attendance",
										children: "Attendance"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "fee_reminder",
										children: "Fee Reminder"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "fee_receipt",
										children: "Fee Receipt"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "birthday",
										children: "Birthday Wish"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "fee_overdue",
										children: "Fee Overdue"
									})
								] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: filterStatus,
								onValueChange: (v) => {
									setFilterStatus(v);
									setPage(0);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-9 w-[130px] rounded-lg text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Status" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "all",
										children: "All Status"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "sent",
										children: "Sent"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "failed",
										children: "Failed"
									})
								] })]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full border-collapse text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border bg-accent/20 text-xs font-semibold text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-3",
										children: "Time"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-3",
										children: "Type"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-3",
										children: "Student Name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-3",
										children: "Recipient Mobile"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-3",
										children: "Message Preview"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-3 text-right",
										children: "Status"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-3 text-center",
										children: "Action"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-border/60",
								children: isRefreshing && logs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 7,
									className: "p-10 text-center text-muted-foreground",
									children: "Loading logs..."
								}) }) : logs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 7,
									className: "p-10 text-center text-muted-foreground",
									children: "No matching logs found."
								}) }) : logs.map((log) => {
									const typeInfo = TYPE_LABELS[log.type] || {
										label: log.type,
										color: "bg-gray-500/10 text-gray-500 border-gray-500/20"
									};
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "hover:bg-accent/40 transition-colors",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 whitespace-nowrap text-xs text-muted-foreground",
												children: new Date(log.timestamp).toLocaleString("en-IN", {
													month: "short",
													day: "numeric",
													hour: "2-digit",
													minute: "2-digit"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 whitespace-nowrap",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${typeInfo.color}`,
													children: typeInfo.label
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 font-medium text-foreground whitespace-nowrap",
												children: log.studentName || "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 text-muted-foreground whitespace-nowrap",
												children: log.recipientPhone
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 max-w-xs truncate text-xs",
												title: log.message,
												children: log.message
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 whitespace-nowrap text-right",
												children: log.status === "sent" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "inline-flex items-center gap-1 text-xs font-bold text-emerald-600",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }), " Sent"]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "inline-flex items-center gap-1 text-xs font-bold text-red-500 cursor-help",
													title: log.error || "Delivery failed",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3.5 w-3.5" }), " Failed"]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 whitespace-nowrap text-center",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon",
													className: "h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg animate-fade-in",
													onClick: () => handleDeleteLog(log.id),
													title: "Delete Log",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
												})
											})
										]
									}, log.id);
								})
							})]
						})
					}),
					totalPages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between p-4 border-t border-border bg-accent/10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground",
							children: [
								"Showing page ",
								page + 1,
								" of ",
								totalPages,
								" (",
								totalRecords,
								" records)"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								className: "h-8 rounded-lg",
								disabled: page === 0,
								onClick: () => setPage(page - 1),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4 mr-1" }), " Previous"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								className: "h-8 rounded-lg",
								disabled: page >= totalPages - 1,
								onClick: () => setPage(page + 1),
								children: ["Next ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 ml-1" })]
							})]
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { MessageLogsPage as component };
