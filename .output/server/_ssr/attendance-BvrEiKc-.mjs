import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { S as sendBulkAttendanceAlerts, T as sendWhatsAppAlert, n as Input, r as buttonVariants, s as cn, t as Button } from "./db-BANGggGZ.mjs";
import { a as uid, c as useHydrated, d as useStudents, i as STANDARDS, o as useAttendance, u as useSettings } from "./hooks-B2IK0jt7.mjs";
import { J as CircleX, et as ChevronRight, it as CheckCheck, j as LoaderCircle, m as Send, nt as ChevronDown, q as Circle, r as Users, st as Calendar, tt as ChevronLeft } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as PageHeader } from "./AppShell-pCQyChd3.mjs";
import { n as RadioGroupIndicator, r as RadioGroupItem$1, t as RadioGroup$1 } from "../_libs/@radix-ui/react-radio-group+[...].mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DuOfTFjk.mjs";
import { t as StatCard } from "./StatCard-DIxV5lD_.mjs";
import { t as AttendanceStatusBadge } from "./StatusBadges-1LIj98qH.mjs";
import { a as studentAvatarStyle, r as initials } from "./derive-B-AOoH3y.mjs";
import { t as Label } from "./label-CzfSWNbm.mjs";
import { l as format } from "../_libs/date-fns.mjs";
import { i as Trigger, n as Portal, r as Root2, t as Content2 } from "../_libs/radix-ui__react-popover.mjs";
import { n as getDefaultClassNames, t as DayPicker } from "../_libs/react-day-picker.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/attendance-BvrEiKc-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Popover = Root2;
var PopoverTrigger = Trigger;
var PopoverContent = import_react.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	align,
	sideOffset,
	className: cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)", className),
	...props
}) }));
PopoverContent.displayName = Content2.displayName;
function Calendar$1({ className, classNames, showOutsideDays = true, captionLayout = "label", buttonVariant = "ghost", formatters, components, ...props }) {
	const defaultClassNames = getDefaultClassNames();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayPicker, {
		showOutsideDays,
		className: cn("bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent", String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`, String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`, className),
		captionLayout,
		formatters: {
			formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" }),
			...formatters
		},
		classNames: {
			root: cn("w-fit", defaultClassNames.root),
			months: cn("relative flex flex-col gap-4 md:flex-row", defaultClassNames.months),
			month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
			nav: cn("absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1", defaultClassNames.nav),
			button_previous: cn(buttonVariants({ variant: buttonVariant }), "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50", defaultClassNames.button_previous),
			button_next: cn(buttonVariants({ variant: buttonVariant }), "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50", defaultClassNames.button_next),
			month_caption: cn("flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)", defaultClassNames.month_caption),
			dropdowns: cn("flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium", defaultClassNames.dropdowns),
			dropdown_root: cn("has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border", defaultClassNames.dropdown_root),
			dropdown: cn("bg-popover absolute inset-0 opacity-0", defaultClassNames.dropdown),
			caption_label: cn("select-none font-medium", captionLayout === "label" ? "text-sm" : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5", defaultClassNames.caption_label),
			table: "w-full border-collapse",
			weekdays: cn("flex", defaultClassNames.weekdays),
			weekday: cn("text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal", defaultClassNames.weekday),
			week: cn("mt-2 flex w-full", defaultClassNames.week),
			week_number_header: cn("w-(--cell-size) select-none", defaultClassNames.week_number_header),
			week_number: cn("text-muted-foreground select-none text-[0.8rem]", defaultClassNames.week_number),
			day: cn("group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md", defaultClassNames.day),
			range_start: cn("bg-accent rounded-l-md", defaultClassNames.range_start),
			range_middle: cn("rounded-none", defaultClassNames.range_middle),
			range_end: cn("bg-accent rounded-r-md", defaultClassNames.range_end),
			today: cn("bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none", defaultClassNames.today),
			outside: cn("text-muted-foreground aria-selected:text-muted-foreground", defaultClassNames.outside),
			disabled: cn("text-muted-foreground opacity-50", defaultClassNames.disabled),
			hidden: cn("invisible", defaultClassNames.hidden),
			...classNames
		},
		components: {
			Root: ({ className, rootRef, ...props }) => {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"data-slot": "calendar",
					ref: rootRef,
					className: cn(className),
					...props
				});
			},
			Chevron: ({ className, orientation, ...props }) => {
				if (orientation === "left") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
					className: cn("size-4", className),
					...props
				});
				if (orientation === "right") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
					className: cn("size-4", className),
					...props
				});
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
					className: cn("size-4", className),
					...props
				});
			},
			DayButton: CalendarDayButton,
			WeekNumber: ({ children, ...props }) => {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					...props,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-(--cell-size) items-center justify-center text-center",
						children
					})
				});
			},
			...components
		},
		...props
	});
}
function CalendarDayButton({ className, day, modifiers, ...props }) {
	const defaultClassNames = getDefaultClassNames();
	const ref = import_react.useRef(null);
	import_react.useEffect(() => {
		if (modifiers.focused) ref.current?.focus();
	}, [modifiers.focused]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		ref,
		variant: "ghost",
		size: "icon",
		"data-day": day.date.toLocaleDateString(),
		"data-selected-single": modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle,
		"data-range-start": modifiers.range_start,
		"data-range-end": modifiers.range_end,
		"data-range-middle": modifiers.range_middle,
		className: cn("data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex aspect-square h-auto w-full min-w-(--cell-size) flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70", defaultClassNames.day, className),
		...props
	});
}
var RadioGroup = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroup$1, {
		className: cn("grid gap-2", className),
		...props,
		ref
	});
});
RadioGroup.displayName = RadioGroup$1.displayName;
var RadioGroupItem = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem$1, {
		ref,
		className: cn("aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupIndicator, {
			className: "flex items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-3.5 w-3.5 fill-primary" })
		})
	});
});
RadioGroupItem.displayName = RadioGroupItem$1.displayName;
var WhatsAppIcon = (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
	viewBox: "0 0 24 24",
	fill: "currentColor",
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" })
});
var STATUSES = [
	"Present",
	"Absent",
	"Late",
	"Holiday"
];
function AttendancePage() {
	const hydrated = useHydrated();
	const [students] = useStudents();
	const [attendance, setAttendanceState] = useAttendance();
	const [settings] = useSettings();
	const [standard, setStandard] = (0, import_react.useState)("all");
	const [date, setDate] = (0, import_react.useState)(/* @__PURE__ */ new Date());
	const [remarks, setRemarks] = (0, import_react.useState)({});
	const [isSendingAlerts, setIsSendingAlerts] = (0, import_react.useState)(false);
	const dateKey = format(date, "yyyy-MM-dd");
	const handleSaveAndSendBulkAlerts = async () => {
		if ((settings.whatsappProvider || "manual") === "manual") {
			toast.warning("WhatsApp Provider is set to Manual. Please select Twilio, UltraMsg, or Baileys in Settings to send automated notifications.");
			return;
		}
		setIsSendingAlerts(true);
		const loadingToast = toast.loading(`Sending automated bulk attendance alerts to parents...`);
		try {
			const res = await sendBulkAttendanceAlerts({ data: {
				date: dateKey,
				standard
			} });
			if (res.success) toast.success(`Success! Sent ${res.sent} attendance alerts (${res.failed} failed)`, { id: loadingToast });
			else toast.error("Failed to send bulk alerts.", { id: loadingToast });
		} catch (err) {
			toast.error(`Error: ${err.message || err}`, { id: loadingToast });
		} finally {
			setIsSendingAlerts(false);
		}
	};
	const filtered = (0, import_react.useMemo)(() => standard === "all" ? students : students.filter((s) => s.standard === standard), [students, standard]);
	const todayRecords = (0, import_react.useMemo)(() => attendance.filter((r) => r.date === dateKey), [attendance, dateKey]);
	const statusFor = (sid) => todayRecords.find((r) => r.studentId === sid)?.status ?? null;
	const setStatus = (sid, status) => {
		const others = attendance.filter((r) => !(r.studentId === sid && r.date === dateKey));
		setAttendanceState([...others, {
			id: uid(),
			studentId: sid,
			date: dateKey,
			status,
			remarks: remarks[sid]
		}]);
	};
	const handleSendWhatsApp = async (s, status) => {
		const template = status === "Present" ? settings.whatsappTemplatePresent : settings.whatsappTemplateAbsent;
		const formattedDate = dateKey.split("-").reverse().join("/");
		const now = /* @__PURE__ */ new Date();
		let hours = now.getHours();
		const minutes = String(now.getMinutes()).padStart(2, "0");
		const ampm = hours >= 12 ? "PM" : "AM";
		hours = hours % 12;
		hours = hours ? hours : 12;
		const formattedTime = `${hours}:${minutes} ${ampm}`;
		const messageText = (template || `Dear Parent, your child [student_name] was marked [status] today on [date] at [time].`).replace("[student_name]", s.name).replace("[status]", status).replace("[date]", formattedDate).replace("[time]", formattedTime);
		const parentPhones = [s.fatherMobile, s.motherMobile].filter(Boolean);
		if (parentPhones.length === 0) {
			toast.error("No registered parent mobile number found for this student.");
			return;
		}
		if ((settings.whatsappProvider || "manual") === "manual") {
			parentPhones.forEach((phoneNum, idx) => {
				let phone = phoneNum.replace(/[\s\-\(\)\+]/g, "");
				if (phone.length === 10) phone = "91" + phone;
				const url = `https://wa.me/${phone}?text=${encodeURIComponent(messageText)}`;
				if (idx === 0) window.open(url, "_blank");
				else setTimeout(() => {
					window.open(url, "_blank");
				}, 500);
			});
			toast.success("Opening WhatsApp chat link(s)...");
		} else {
			const loadingToast = toast.loading(`Sending automated WhatsApp alert to ${s.name}'s parent${parentPhones.length > 1 ? "s" : ""}...`);
			try {
				if ((await Promise.all(parentPhones.map((phone) => sendWhatsAppAlert({ data: {
					recipientPhone: phone,
					studentName: s.name,
					status,
					date: dateKey
				} })))).every((res) => res.success)) toast.success(`WhatsApp alert sent successfully!`, { id: loadingToast });
				else toast.error("Failed to send WhatsApp alert to at least one parent.", { id: loadingToast });
			} catch (err) {
				toast.error(`Error: ${err.message || err}`, { id: loadingToast });
			}
		}
	};
	const markAll = (status) => {
		const others = attendance.filter((r) => !(r.date === dateKey && filtered.some((s) => s.id === r.studentId)));
		const newOnes = filtered.map((s) => ({
			id: uid(),
			studentId: s.id,
			date: dateKey,
			status,
			remarks: remarks[s.id]
		}));
		setAttendanceState([...others, ...newOnes]);
		toast.success(`Marked ${filtered.length} students as ${status}`);
	};
	const summary = (0, import_react.useMemo)(() => {
		const recs = todayRecords.filter((r) => filtered.some((s) => s.id === r.studentId));
		return {
			present: recs.filter((r) => r.status === "Present").length,
			absent: recs.filter((r) => r.status === "Absent").length,
			late: recs.filter((r) => r.status === "Late").length,
			total: filtered.length
		};
	}, [todayRecords, filtered]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Daily Attendance",
				description: "Mark attendance for the selected date and standard.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "rounded-xl",
							onClick: () => markAll("Present"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "mr-2 h-4 w-4" }), " Mark All Present"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "rounded-xl",
							onClick: () => markAll("Absent"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "mr-2 h-4 w-4" }), " Mark All Absent"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-glow",
							onClick: handleSaveAndSendBulkAlerts,
							disabled: isSendingAlerts || filtered.length === 0,
							children: isSendingAlerts ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), " Sending..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "mr-2 h-4 w-4" }), " Save & Send Alerts"] })
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass flex flex-wrap items-center gap-3 rounded-2xl p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: cn("h-10 rounded-xl", !date && "text-muted-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "mr-2 h-4 w-4" }), format(date, "PPP")]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent, {
						className: "w-auto p-0",
						align: "start",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar$1, {
							mode: "single",
							selected: date,
							onSelect: (d) => d && setDate(d),
							className: cn("p-3 pointer-events-auto")
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: standard,
						onValueChange: setStandard,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-10 w-[160px] rounded-xl",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Standard" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All Standards"
						}), STANDARDS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: s,
							children: s
						}, s))] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto text-sm text-muted-foreground",
						children: [
							filtered.length,
							" students on ",
							format(date, "PPP")
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total",
						value: summary.total,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-5 w-5" }),
						gradient: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Present",
						value: summary.present,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Absent",
						value: summary.absent,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Late",
						value: summary.late,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-5 w-5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass overflow-hidden rounded-2xl",
				children: [
					!hydrated && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-6 text-muted-foreground",
						children: "Loading…"
					}),
					hydrated && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-10 text-center text-muted-foreground",
						children: "No students in this standard."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border/60",
						children: filtered.map((s) => {
							const st = statusFor(s.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "grid grid-cols-1 gap-3 p-4 transition-colors hover:bg-accent/40 md:grid-cols-[minmax(0,1fr)_auto_auto]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex min-w-0 items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full text-xs font-bold text-white",
											style: s.photo ? void 0 : studentAvatarStyle(s),
											children: s.photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: s.photo,
												alt: "",
												className: "h-full w-full object-cover"
											}) : initials(s.name)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "truncate font-medium",
												children: s.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs text-muted-foreground",
												children: [
													s.standard,
													" - ",
													s.section
												]
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroup, {
										className: "flex flex-wrap items-center gap-2",
										value: st ?? "",
										onValueChange: (v) => setStatus(s.id, v),
										children: STATUSES.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
											htmlFor: `${s.id}-${v}`,
											className: cn("cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition", st === v ? v === "Present" ? "border-transparent bg-emerald-500 text-white" : v === "Absent" ? "border-transparent bg-destructive text-destructive-foreground" : v === "Late" ? "border-transparent bg-amber-500 text-white" : "border-transparent bg-blue-500 text-white" : "border-border hover:bg-accent"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, {
												id: `${s.id}-${v}`,
												value: v,
												className: "sr-only"
											}), v]
										}, v))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: "Remarks",
												className: "h-9 w-40 rounded-lg",
												value: remarks[s.id] ?? "",
												onChange: (e) => setRemarks({
													...remarks,
													[s.id]: e.target.value
												})
											}),
											st && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AttendanceStatusBadge, { status: st }),
											st && (st === "Present" || st === "Absent") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "icon",
												variant: "ghost",
												onClick: () => handleSendWhatsApp(s, st),
												className: "h-9 w-9 shrink-0 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors",
												title: "Send WhatsApp Alert to Parent",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppIcon, { className: "h-5 w-5" })
											})
										]
									})
								]
							}, s.id);
						})
					})
				]
			})
		]
	});
}
//#endregion
export { AttendancePage as component };
