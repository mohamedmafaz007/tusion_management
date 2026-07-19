import { o as __toESM } from "../_runtime.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as Input, t as Button, y as getRegistrationPdf } from "./db-yVcJeqUS.mjs";
import { a as uid, c as useHydrated, d as useStudents, l as useMaterials, o as useAttendance, s as useFees, t as Badge } from "./hooks-CxGWPwWy.mjs";
import { C as Phone, O as MapPin, W as Download, _ as Save, ct as CalendarCheck, g as School, lt as BookOpen, n as Wallet, pt as ArrowLeft, st as Calendar, t as X, u as Trash2, w as Pencil } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-C1YDv707.mjs";
import { t as StatCard } from "./StatCard-BVnqh5VB.mjs";
import { n as FeeStatusBadge, t as AttendanceStatusBadge } from "./StatusBadges-DZbO9i-v.mjs";
import { a as studentAvatarStyle, i as studentAttendancePct, n as formatCurrency, o as studentFeeStatus, r as initials, t as currentMonthKey } from "./derive-C375yk92.mjs";
import { t as Label } from "./label-DcgtOGq1.mjs";
import { t as Route } from "./students._id-BmeQbAzR.mjs";
import { t as Textarea } from "./textarea-4-NmWq2G.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-aCyJ3ixT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/students._id-Cht9by1h.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StudentProfilePage() {
	const { id } = Route.useParams();
	const hydrated = useHydrated();
	const [students, setStudentsState] = useStudents();
	const [attendance, setAttendanceState] = useAttendance();
	const [fees, setFeesState] = useFees();
	const [materials] = useMaterials();
	const navigate = useNavigate();
	const [edit, setEdit] = (0, import_react.useState)(false);
	const [confirmDel, setConfirmDel] = (0, import_react.useState)(false);
	const student = students.find((s) => s.id === id);
	const [draft, setDraft] = (0, import_react.useState)(student);
	const [draftPending, setDraftPending] = (0, import_react.useState)(0);
	const recent = (0, import_react.useMemo)(() => attendance.filter((r) => r.studentId === id).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10), [attendance, id]);
	const studentFees = (0, import_react.useMemo)(() => fees.filter((f) => f.studentId === id), [fees, id]);
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-6 text-muted-foreground",
		children: "Loading…"
	});
	if (!student) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass mx-auto max-w-md rounded-3xl p-10 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-semibold",
				children: "Student not found"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "This student may have been deleted."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/students",
					children: "Back to students"
				})
			})
		]
	});
	const attn = studentAttendancePct(student.id, attendance);
	const fs = studentFeeStatus(student, fees);
	const save = () => {
		if (!draft) return;
		if (!draft.registrationNo?.trim()) {
			toast.error("Registration number is required");
			return;
		}
		if (!draft.name.trim()) {
			toast.error("Name is required");
			return;
		}
		const regNoClean = draft.registrationNo.trim();
		if (students.some((s) => s.id !== id && s.registrationNo.trim().toLowerCase() === regNoClean.toLowerCase())) {
			toast.error(`Registration number "${regNoClean}" is already in use by another student.`);
			return;
		}
		const fatherClean = draft.fatherMobile?.trim() || "";
		const motherClean = draft.motherMobile?.trim() || "";
		if (!fatherClean && !motherClean) {
			toast.error("At least one parent mobile number is required");
			return;
		}
		const phoneRegex = /^\d{10}$/;
		if (fatherClean && !phoneRegex.test(fatherClean)) {
			toast.error("Father mobile must be 10 digits");
			return;
		}
		if (motherClean && !phoneRegex.test(motherClean)) {
			toast.error("Mother mobile must be 10 digits");
			return;
		}
		const updatedStudent = {
			...draft,
			registrationNo: regNoClean,
			fatherMobile: fatherClean,
			motherMobile: motherClean,
			address: draft.address?.trim() || "",
			boardOfStudy: draft.boardOfStudy || "State Board",
			mediumOfStudy: draft.mediumOfStudy || "English"
		};
		setStudentsState(students.map((s) => s.id === id ? updatedStudent : s));
		const newPending = Math.max(0, draftPending);
		const currentMonth = currentMonthKey();
		let studentFees = fees.filter((f) => f.studentId === id);
		const otherFees = fees.filter((f) => f.studentId !== id);
		if (!studentFees.some((f) => f.month === currentMonth)) studentFees.push({
			id: uid(),
			studentId: id,
			month: currentMonth,
			amount: draft.monthlyFees,
			paidAmount: 0,
			status: "Pending"
		});
		studentFees.sort((a, b) => b.month.localeCompare(a.month));
		let remainingPending = newPending;
		studentFees = studentFees.map((f) => {
			const allocatedPending = Math.min(remainingPending, f.amount);
			const paidAmount = f.amount - allocatedPending;
			remainingPending -= allocatedPending;
			let status = "Pending";
			if (allocatedPending === 0) status = "Paid";
			else if (allocatedPending === f.amount) status = "Pending";
			else status = "Partial";
			const paidDate = status === "Paid" ? f.paidDate || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) : void 0;
			return {
				...f,
				paidAmount,
				status,
				paidDate
			};
		});
		if (remainingPending > 0 && studentFees.length > 0) {
			studentFees[0].amount += remainingPending;
			studentFees[0].paidAmount = 0;
			studentFees[0].status = "Pending";
			studentFees[0].paidDate = void 0;
		}
		setFeesState([...otherFees, ...studentFees]);
		toast.success("Student updated");
		setEdit(false);
	};
	const del = () => {
		setStudentsState(students.filter((s) => s.id !== id));
		setAttendanceState(attendance.filter((a) => a.studentId !== id));
		setFeesState(fees.filter((f) => f.studentId !== id));
		toast.success("Student deleted");
		navigate({ to: "/students" });
	};
	const downloadForm = async () => {
		const loader = toast.loading("Generating registration form PDF...");
		try {
			const res = await getRegistrationPdf({ data: { studentId: student.id } });
			if (res && res.pdfBase64) {
				const link = document.createElement("a");
				link.href = `data:application/pdf;base64,${res.pdfBase64}`;
				link.download = res.filename;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				toast.success("Registration form downloaded successfully!", { id: loader });
			} else toast.error("Failed to generate PDF.", { id: loader });
		} catch (err) {
			console.error(err);
			toast.error(`Download failed: ${err.message || err}`, { id: loader });
		}
	};
	const assignedMaterials = materials.filter((m) => m.standard === student.standard).slice(0, 6);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/students",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "mr-1 h-4 w-4" }), " Back"]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass overflow-hidden rounded-3xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "gradient-brand h-32" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 p-6 pt-0 sm:grid-cols-[auto_1fr_auto]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "-mt-16 h-32 w-32 shrink-0 overflow-hidden rounded-3xl border-4 border-background shadow-glow",
							style: student.photo ? void 0 : studentAvatarStyle(student),
							children: student.photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: student.photo,
								alt: student.name,
								className: "h-full w-full object-cover"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-full place-items-center text-3xl font-black text-white",
								children: initials(student.name)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 pt-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "truncate text-2xl font-bold",
									children: student.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "border-primary/50 text-primary font-semibold",
											children: student.registrationNo
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											variant: "secondary",
											children: [
												student.standard,
												" - ",
												student.section
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "border-amber-500/50 text-amber-600 font-semibold",
											children: student.boardOfStudy || "State Board"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "border-blue-500/50 text-blue-600 font-semibold",
											children: (student.mediumOfStudy || "English") + " Medium"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(School, { className: "h-3.5 w-3.5" }),
												" ",
												student.school
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5" }),
												" Joined ",
												student.joiningDate
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex flex-wrap gap-4 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4 text-primary" }),
											" ",
											student.fatherMobile
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 text-primary" }),
											" ",
											student.address
										]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap items-start gap-2 pt-4",
							children: !edit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									className: "rounded-xl",
									onClick: downloadForm,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 h-4 w-4" }), " Download Form"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									className: "rounded-xl",
									onClick: () => {
										setDraft(student);
										setDraftPending(fs.pending);
										setEdit(true);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "mr-2 h-4 w-4" }), " Edit"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									className: "rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive",
									onClick: () => setConfirmDel(true),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-2 h-4 w-4" }), " Delete"]
								})
							] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								className: "rounded-xl",
								onClick: () => setEdit(false),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "mr-2 h-4 w-4" }), " Cancel"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "rounded-xl gradient-brand",
								onClick: save,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "mr-2 h-4 w-4" }), " Save"]
							})] })
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Attendance",
						value: `${attn}%`,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "h-5 w-5" }),
						gradient: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Monthly Fee",
						value: formatCurrency(student.monthlyFees),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Pending",
						value: formatCurrency(fs.pending),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Assigned Materials",
						value: assignedMaterials.length,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-5 w-5" })
					})
				]
			}),
			edit && draft && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-2xl p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-4 font-semibold",
					children: "Edit Details"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 md:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fld, {
							label: "Registration No",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.registrationNo,
								onChange: (e) => setDraft({
									...draft,
									registrationNo: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fld, {
							label: "Name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.name,
								onChange: (e) => setDraft({
									...draft,
									name: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fld, {
							label: "School",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.school,
								onChange: (e) => setDraft({
									...draft,
									school: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fld, {
							label: "Section",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.section,
								onChange: (e) => setDraft({
									...draft,
									section: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fld, {
							label: "Board of Study",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: draft.boardOfStudy || "State Board",
								onValueChange: (v) => setDraft({
									...draft,
									boardOfStudy: v
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "State Board",
										children: "State Board"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "CBSE",
										children: "CBSE"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "ICSE",
										children: "ICSE"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Matriculation",
										children: "Matriculation"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Other",
										children: "Other"
									})
								] })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fld, {
							label: "Medium of Study",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: draft.mediumOfStudy || "English",
								onValueChange: (v) => setDraft({
									...draft,
									mediumOfStudy: v
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "Tamil",
									children: "Tamil"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "English",
									children: "English"
								})] })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fld, {
							label: "Parent Name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.parentName,
								onChange: (e) => setDraft({
									...draft,
									parentName: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fld, {
							label: "Father Mobile",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.fatherMobile,
								onChange: (e) => setDraft({
									...draft,
									fatherMobile: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fld, {
							label: "Mother Mobile",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.motherMobile,
								onChange: (e) => setDraft({
									...draft,
									motherMobile: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fld, {
							label: "Monthly Fee",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: draft.monthlyFees,
								onChange: (e) => setDraft({
									...draft,
									monthlyFees: +e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fld, {
							label: "Admission Fee",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: draft.admissionFees,
								onChange: (e) => setDraft({
									...draft,
									admissionFees: +e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fld, {
							label: "Pending Fee",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: draftPending,
								onChange: (e) => setDraftPending(+e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fld, {
								label: "Address",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 2,
									value: draft.address,
									onChange: (e) => setDraft({
										...draft,
										address: e.target.value
									})
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fld, {
								label: "Notes",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 2,
									value: draft.notes ?? "",
									onChange: (e) => setDraft({
										...draft,
										notes: e.target.value
									})
								})
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass rounded-2xl p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-4 font-semibold",
						children: "Recent Attendance"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "space-y-2",
						children: [recent.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-sm text-muted-foreground",
							children: "No attendance records yet."
						}), recent.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between rounded-xl px-3 py-2 hover:bg-accent/50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm",
								children: r.date
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AttendanceStatusBadge, { status: r.status })]
						}, r.id))]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass rounded-2xl p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-4 font-semibold",
						children: "Fee History"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "space-y-2",
						children: [studentFees.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-sm text-muted-foreground",
							children: "No fee records yet."
						}), studentFees.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between rounded-xl px-3 py-2 hover:bg-accent/50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium",
								children: f.month
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [
									formatCurrency(f.amount),
									" • paid ",
									formatCurrency(f.paidAmount)
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeeStatusBadge, { status: f.status })]
						}, f.id))]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-2xl p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "mb-4 font-semibold",
					children: [
						"Assigned Materials (",
						student.standard,
						")"
					]
				}), assignedMaterials.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No materials uploaded for this standard yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
					children: assignedMaterials.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border/60 bg-secondary/40 p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: m.type
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: m.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: m.fileName
							})
						]
					}, m.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: confirmDel,
				onOpenChange: setConfirmDel,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, { children: [
					"Delete ",
					student.name,
					"?"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "This will remove the student and all references permanently." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					onClick: del,
					className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
					children: "Delete"
				})] })] })
			})
		]
	});
}
function Fld({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-xs font-medium",
			children: label
		}), children]
	});
}
//#endregion
export { StudentProfilePage as component };
