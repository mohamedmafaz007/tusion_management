import { o as __toESM } from "../_runtime.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { E as uid, M as useStudents, b as sendWhatsAppAlert, i as Input, j as useSettings, n as Button, o as STANDARDS } from "./hooks-BIRdQpF6.mjs";
import { _ as RotateCcw, g as Save, k as LoaderCircle, rt as Camera } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as PageHeader } from "./AppShell-CYiei1zp.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-v0Zn4H8T.mjs";
import { t as Label } from "./label-CZkfVM1T.mjs";
import { i as stringType, n as enumType, r as objectType, t as coerce } from "../_libs/zod.mjs";
import { t as Textarea } from "./textarea-DajWzqla.mjs";
import { n as useForm, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/students.new-BrPrsR-h.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var schema = objectType({
	name: stringType().trim().min(2, "Name is required").max(100),
	gender: enumType([
		"Male",
		"Female",
		"Other"
	]),
	dob: stringType().min(1, "Date of birth is required"),
	school: stringType().trim().min(2, "School is required").max(100),
	standard: enumType([
		"6th",
		"7th",
		"8th",
		"9th",
		"10th",
		"11th",
		"12th"
	]),
	section: stringType().trim().min(1, "Section is required").max(5),
	parentName: stringType().trim().min(2, "Parent name is required").max(100),
	fatherMobile: stringType().regex(/^\d{10}$/, "Must be 10 digits"),
	motherMobile: stringType().regex(/^\d{10}$/, "Must be 10 digits"),
	address: stringType().trim().min(5).max(300),
	joiningDate: stringType().min(1, "Joining date is required"),
	monthlyFees: coerce.number().min(0).max(1e6),
	admissionFees: coerce.number().min(0).max(1e6),
	notes: stringType().max(500).optional()
});
var DEFAULTS = {
	name: "",
	gender: "Male",
	dob: "",
	school: "",
	standard: "8th",
	section: "A",
	parentName: "",
	fatherMobile: "",
	motherMobile: "",
	address: "",
	joiningDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
	monthlyFees: 1500,
	admissionFees: 2e3,
	notes: ""
};
function NewStudentPage() {
	const [photo, setPhoto] = (0, import_react.useState)();
	const fileRef = (0, import_react.useRef)(null);
	const [students, setStudentsState] = useStudents();
	const [settings] = useSettings();
	const navigate = useNavigate();
	const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
		resolver: u(schema),
		defaultValues: DEFAULTS
	});
	const onPhotoChange = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (file.size > 2 * 1024 * 1024) {
			toast.error("Photo must be under 2 MB");
			return;
		}
		const reader = new FileReader();
		reader.onload = () => setPhoto(reader.result);
		reader.readAsDataURL(file);
	};
	const [isSaving, setIsSaving] = (0, import_react.useState)(false);
	const onSubmit = async (data) => {
		setIsSaving(true);
		try {
			const studentId = uid();
			await setStudentsState([...students, {
				...data,
				id: studentId,
				photo,
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			}]);
			toast.success(`${data.name} registered successfully!`);
			const parentMobile = data.fatherMobile || data.motherMobile;
			if (parentMobile) {
				const provider = settings.whatsappProvider || "manual";
				const messageText = (settings.whatsappTemplateWelcome || "Dear Parent, thank you for registering [student_name] at Vishwa Tuition Center. We are excited to guide them on their academic journey. Regards, Prof. Anita Sharma.").replace("[student_name]", data.name);
				if (provider === "manual") {
					let phone = parentMobile.replace(/[\s\-\(\)\+]/g, "");
					if (phone.length === 10) phone = "91" + phone;
					const url = `https://wa.me/${phone}?text=${encodeURIComponent(messageText)}`;
					window.open(url, "_blank");
					toast.success("Opening WhatsApp welcome message link...");
				} else {
					const loadingAlert = toast.loading("Sending automated welcome WhatsApp message...");
					try {
						await sendWhatsAppAlert({ data: {
							recipientPhone: parentMobile,
							studentName: data.name,
							status: "Welcome",
							studentId
						} });
						toast.success("Automated welcome alert sent successfully!", { id: loadingAlert });
					} catch (e) {
						console.error("Failed to send welcome alert:", e);
						toast.error("Failed to send automated welcome alert", { id: loadingAlert });
					}
				}
			}
			navigate({ to: "/students" });
		} catch (err) {
			toast.error(`Failed to register student: ${err.message || err}`);
		} finally {
			setIsSaving(false);
		}
	};
	const handleReset = () => {
		reset(DEFAULTS);
		setPhoto(void 0);
		toast.info("Form reset");
	};
	const gender = watch("gender");
	const standard = watch("standard");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Student Registration",
			description: "Fill out the form to enroll a new student."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit(onSubmit),
			className: "grid gap-6 lg:grid-cols-[280px_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "glass rounded-2xl p-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-40 w-40 place-items-center overflow-hidden rounded-3xl gradient-brand shadow-glow",
									children: photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: photo,
										alt: "preview",
										className: "h-full w-full object-cover"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-12 w-12 text-white/80" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => fileRef.current?.click(),
									className: "absolute -bottom-2 -right-2 rounded-full bg-primary p-2 text-primary-foreground shadow-lg transition hover:scale-110",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: fileRef,
									type: "file",
									accept: "image/*",
									className: "hidden",
									onChange: onPhotoChange
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-semibold",
								children: "Student Photo"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: "Optional • Max 2 MB"
							})]
						}),
						photo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							size: "sm",
							onClick: () => setPhoto(void 0),
							children: "Remove photo"
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass space-y-5 rounded-2xl p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Student Name",
								error: errors.name?.message,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									...register("name"),
									placeholder: "Full name"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Gender",
								error: errors.gender?.message,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: gender,
									onValueChange: (v) => setValue("gender", v),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Male",
											children: "Male"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Female",
											children: "Female"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Other",
											children: "Other"
										})
									] })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Date of Birth",
								error: errors.dob?.message,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									...register("dob")
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "School Name",
								error: errors.school?.message,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									...register("school"),
									placeholder: "School"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Standard",
								error: errors.standard?.message,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: standard,
									onValueChange: (v) => setValue("standard", v),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STANDARDS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: s,
										children: s
									}, s)) })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Section",
								error: errors.section?.message,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									...register("section"),
									placeholder: "A / B / C"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Parent Name",
								error: errors.parentName?.message,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									...register("parentName"),
									placeholder: "Parent full name"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Joining Date",
								error: errors.joiningDate?.message,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									...register("joiningDate")
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Father Mobile",
								error: errors.fatherMobile?.message,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									...register("fatherMobile"),
									inputMode: "numeric",
									placeholder: "10-digit number"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Mother Mobile",
								error: errors.motherMobile?.message,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									...register("motherMobile"),
									inputMode: "numeric",
									placeholder: "10-digit number"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Monthly Fees (₹)",
								error: errors.monthlyFees?.message,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									...register("monthlyFees")
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Admission Fees (₹)",
								error: errors.admissionFees?.message,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									...register("admissionFees")
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Address",
						error: errors.address?.message,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 2,
							...register("address"),
							placeholder: "Home address"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Notes",
						error: errors.notes?.message,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 2,
							...register("notes"),
							placeholder: "Optional notes"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap justify-end gap-3 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							onClick: handleReset,
							className: "rounded-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "mr-2 h-4 w-4" }), " Reset"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: isSaving,
							className: "rounded-xl gradient-brand shadow-glow",
							children: isSaving ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), " Saving..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "mr-2 h-4 w-4" }), " Save Student"] })
						})]
					})
				]
			})]
		})]
	});
}
function Field({ label, error, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				className: "text-xs font-medium",
				children: label
			}),
			children,
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-destructive",
				children: error
			})
		]
	});
}
//#endregion
export { NewStudentPage as component };
