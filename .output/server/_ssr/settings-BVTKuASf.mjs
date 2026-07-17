import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { A as syncDbStudents, D as syncDbFees, E as syncDbAttendance, O as syncDbMaterials, c as connectBaileys, d as getBaileysStatus, n as Input, s as cn, t as Button, u as disconnectBaileys } from "./db-_-56JTAZ.mjs";
import { n as DEFAULT_SETTINGS, u as useSettings } from "./hooks-P7UI8aLI.mjs";
import { T as Moon, Z as CircleCheckBig, _ as Save, d as Sun, j as LoaderCircle, s as Upload, ut as Bell } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as PageHeader } from "./AppShell-BP_3GgOB.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-HRfI_rwd.mjs";
import { t as Label } from "./label-B6_btTH_.mjs";
import { t as Textarea } from "./textarea-BX6VBtBM.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-BVTKuASf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
function SettingsPage() {
	const [settings, setSettingsState] = useSettings();
	const [draft, setDraft] = (0, import_react.useState)(settings);
	const fileRef = (0, import_react.useRef)(null);
	const [baileysStatus, setBaileysStatus] = (0, import_react.useState)("disconnected");
	const [baileysQr, setBaileysQr] = (0, import_react.useState)("");
	const [isConnecting, setIsConnecting] = (0, import_react.useState)(false);
	const [isDisconnecting, setIsDisconnecting] = (0, import_react.useState)(false);
	const [newStandard, setNewStandard] = (0, import_react.useState)("");
	const [isSaving, setIsSaving] = (0, import_react.useState)(false);
	const handleAddStandard = () => {
		const trimmed = newStandard.trim();
		if (!trimmed) return;
		const current = draft.standards || [
			"6th",
			"7th",
			"8th",
			"9th",
			"10th",
			"11th",
			"12th"
		];
		if (current.includes(trimmed)) {
			toast.error("Standard already exists!");
			return;
		}
		setDraft({
			...draft,
			standards: [...current, trimmed]
		});
		setNewStandard("");
		toast.success(`Standard "${trimmed}" added to changes`);
	};
	(0, import_react.useEffect)(() => {
		setDraft(settings);
	}, [settings]);
	(0, import_react.useEffect)(() => {
		if (draft.whatsappProvider !== "baileys") return;
		const checkStatus = async () => {
			try {
				const res = await getBaileysStatus();
				setBaileysStatus(res.status);
				setBaileysQr(res.qr || "");
			} catch (err) {
				console.error("Failed to check Baileys status:", err);
			}
		};
		checkStatus();
		const interval = setInterval(checkStatus, 2500);
		return () => clearInterval(interval);
	}, [draft.whatsappProvider]);
	const handleConnect = async () => {
		setIsConnecting(true);
		try {
			await connectBaileys();
			toast.info("Initializing WhatsApp connection...");
			const res = await getBaileysStatus();
			setBaileysStatus(res.status);
			setBaileysQr(res.qr || "");
		} catch (err) {
			toast.error(`Connection failed: ${err.message || err}`);
		} finally {
			setIsConnecting(false);
		}
	};
	const handleDisconnect = async () => {
		setIsDisconnecting(true);
		try {
			await disconnectBaileys();
			setBaileysStatus("disconnected");
			setBaileysQr("");
			toast.success("Disconnected from WhatsApp and logged out.");
		} catch (err) {
			toast.error(`Disconnect failed: ${err.message || err}`);
		} finally {
			setIsDisconnecting(false);
		}
	};
	const save = async () => {
		setIsSaving(true);
		try {
			await setSettingsState(draft);
			toast.success("Settings saved");
		} catch (err) {
			toast.error(`Failed to save settings: ${err.message || err}`);
		} finally {
			setIsSaving(false);
		}
	};
	const reset = () => {
		setDraft(DEFAULT_SETTINGS);
		setSettingsState(DEFAULT_SETTINGS);
		toast.info("Reset to defaults");
	};
	const onLogo = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const r = new FileReader();
		r.onload = () => setDraft({
			...draft,
			logo: r.result
		});
		r.readAsDataURL(file);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Settings",
			description: "Institute details, appearance, and preferences.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				className: "rounded-xl",
				disabled: isSaving,
				onClick: reset,
				children: "Reset"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "rounded-xl gradient-brand shadow-glow",
				disabled: isSaving,
				onClick: save,
				children: isSaving ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), " Saving..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "mr-2 h-4 w-4" }), " Save Changes"] })
			})] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass rounded-2xl p-6 lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-4 font-semibold",
						children: "Institute Information"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fld, {
								label: "Institute Name",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: draft.instituteName,
									onChange: (e) => setDraft({
										...draft,
										instituteName: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fld, {
								label: "Teacher / Owner Name",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: draft.teacherName,
									onChange: (e) => setDraft({
										...draft,
										teacherName: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fld, {
								label: "Contact Number",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: draft.contact,
									onChange: (e) => setDraft({
										...draft,
										contact: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fld, {
								label: "Language",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: draft.language,
									onValueChange: (v) => setDraft({
										...draft,
										language: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "English",
											children: "English"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Hindi",
											children: "Hindi"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Tamil",
											children: "Tamil"
										})
									] })]
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
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass rounded-2xl p-6 lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-4 font-semibold",
						children: "WhatsApp Automation Settings"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fld, {
								label: "WhatsApp Provider",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: draft.whatsappProvider || "manual",
									onValueChange: (v) => setDraft({
										...draft,
										whatsappProvider: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "manual",
											children: "WhatsApp Redirect wa.me Link (Free, Manual)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "baileys",
											children: "Direct WhatsApp (Baileys QR Web - Free, Automated)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "ultramsg",
											children: "UltraMsg Gateway API (Automated)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "twilio",
											children: "Twilio WhatsApp Business API (Automated)"
										})
									] })]
								})
							}),
							draft.whatsappProvider === "baileys" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "md:col-span-2 border border-border/60 rounded-2xl p-5 bg-secondary/15 space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-border/50 pb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-semibold text-sm",
										children: "Direct WhatsApp pairing"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Link your own WhatsApp account directly to automate receipts and messages for free."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("text-xs px-2.5 py-1 rounded-full font-semibold capitalize", baileysStatus === "connected" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400" : baileysStatus === "qrcode" ? "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 animate-pulse" : baileysStatus === "connecting" ? "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400 animate-pulse" : "bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-400"),
										children: baileysStatus
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col md:flex-row items-center gap-6 pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-col items-center justify-center p-3 border border-dashed border-border/80 rounded-2xl bg-background/50 w-[200px] h-[200px] shrink-0 relative shadow-inner",
										children: baileysStatus === "qrcode" && baileysQr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: baileysQr,
											alt: "Scan QR Code",
											className: "w-[170px] h-[170px]"
										}) : baileysStatus === "connected" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-center space-y-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-10 w-10 text-emerald-500 mx-auto" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-emerald-500 font-bold text-xs block",
													children: "Pairing Successful"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-muted-foreground block leading-tight",
													children: "Your account is connected"
												})
											]
										}) : baileysStatus === "connecting" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-center space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 text-primary animate-spin mx-auto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground text-[11px] block",
												children: "Waiting for handshake..."
											})]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-center p-2 space-y-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground text-xs block",
												children: "No active connection"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												className: "rounded-lg h-8",
												onClick: handleConnect,
												disabled: isConnecting,
												children: isConnecting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1.5 h-3.5 w-3.5 animate-spin" }), "Starting..."] }) : "Start Connection"
											})]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 space-y-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
												className: "text-xs font-semibold text-muted-foreground",
												children: "Instructions"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
												className: "text-xs text-muted-foreground space-y-1 list-decimal list-inside pl-1 leading-normal",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Select this option and save settings." }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
														"Click ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Start Connection" }),
														" to retrieve the pairing code."
													] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Open WhatsApp on your mobile phone." }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
														"Go to ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Settings" }),
														" > ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Linked Devices" }),
														" > ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Link a Device" }),
														"."
													] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Scan the QR code displayed on this screen." })
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex gap-2",
											children: baileysStatus !== "disconnected" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "destructive",
												className: "rounded-lg",
												onClick: handleDisconnect,
												disabled: isDisconnecting,
												children: isDisconnecting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1.5 h-3.5 w-3.5 animate-spin" }), "Logging out..."] }) : "Disconnect / Logout"
											})
										})]
									})]
								})]
							}),
							draft.whatsappProvider === "ultramsg" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fld, {
								label: "UltraMsg Instance ID",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "e.g. instance12345",
									value: draft.whatsappInstanceId || "",
									onChange: (e) => setDraft({
										...draft,
										whatsappInstanceId: e.target.value
									})
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fld, {
								label: "UltraMsg API Token",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Enter your UltraMsg Token",
									value: draft.whatsappApiKey || "",
									onChange: (e) => setDraft({
										...draft,
										whatsappApiKey: e.target.value
									})
								})
							})] }),
							draft.whatsappProvider === "twilio" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fld, {
									label: "Twilio Account SID",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "Enter Twilio Account SID",
										value: draft.whatsappInstanceId || "",
										onChange: (e) => setDraft({
											...draft,
											whatsappInstanceId: e.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fld, {
									label: "Twilio Auth Token",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "Enter Twilio Auth Token",
										value: draft.whatsappApiKey || "",
										onChange: (e) => setDraft({
											...draft,
											whatsappApiKey: e.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fld, {
									label: "Twilio Sender Number (WhatsApp)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "e.g. +14155238886",
										value: draft.whatsappSenderNumber || "",
										onChange: (e) => setDraft({
											...draft,
											whatsappSenderNumber: e.target.value
										})
									})
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "md:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fld, {
									label: "Present Alert Template",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										rows: 2,
										value: draft.whatsappTemplatePresent || "",
										onChange: (e) => setDraft({
											...draft,
											whatsappTemplatePresent: e.target.value
										}),
										placeholder: "Use [student_name] as placeholder"
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "md:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fld, {
									label: "Absent Alert Template",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										rows: 2,
										value: draft.whatsappTemplateAbsent || "",
										onChange: (e) => setDraft({
											...draft,
											whatsappTemplateAbsent: e.target.value
										}),
										placeholder: "Use [student_name] as placeholder"
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "md:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fld, {
									label: "Welcome Alert Template",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										rows: 2,
										value: draft.whatsappTemplateWelcome || "",
										onChange: (e) => setDraft({
											...draft,
											whatsappTemplateWelcome: e.target.value
										}),
										placeholder: "Use [student_name] as placeholder"
									})
								})
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass rounded-2xl p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-4 font-semibold",
						children: "Logo"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-32 w-32 place-items-center overflow-hidden rounded-2xl gradient-brand text-3xl font-black text-white shadow-glow",
								children: draft.logo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: draft.logo,
									alt: "logo",
									className: "h-full w-full object-cover"
								}) : draft.instituteName.slice(0, 2).toUpperCase()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								className: "rounded-xl",
								onClick: () => fileRef.current?.click(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mr-2 h-4 w-4" }), " Upload Logo"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fileRef,
								type: "file",
								accept: "image/*",
								className: "hidden",
								onChange: onLogo
							}),
							draft.logo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								className: "text-destructive",
								onClick: () => setDraft({
									...draft,
									logo: void 0
								}),
								children: "Remove"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass rounded-2xl p-6 lg:col-span-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-1 font-semibold text-lg",
							children: "Manage Standards (Classes)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mb-4",
							children: "Add or remove standards/classes. These dynamic classes will be reflected everywhere in the tuition management system (Registry, Attendance, Fees, Study Materials)."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2.5 mb-4 p-4 border border-border/50 rounded-2xl bg-secondary/5 min-h-[56px] items-center",
							children: (draft.standards || [
								"6th",
								"7th",
								"8th",
								"9th",
								"10th",
								"11th",
								"12th"
							]).map((std) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 text-xs font-semibold",
								children: [std, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										const next = (draft.standards || [
											"6th",
											"7th",
											"8th",
											"9th",
											"10th",
											"11th",
											"12th"
										]).filter((s) => s !== std);
										setDraft({
											...draft,
											standards: next
										});
									},
									className: "text-primary/70 hover:text-destructive hover:bg-destructive/10 rounded-full p-0.5 transition font-black leading-none text-[14px]",
									title: `Delete ${std} Standard`,
									children: "×"
								})]
							}, std))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 max-w-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "e.g. 5th, JEE, NEET",
								value: newStandard,
								onChange: (e) => setNewStandard(e.target.value),
								onKeyDown: (e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										handleAddStandard();
									}
								}
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								className: "rounded-xl shrink-0",
								onClick: handleAddStandard,
								children: "Add Standard"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass rounded-2xl p-6 lg:col-span-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-4 font-semibold",
						children: "Appearance & Preferences"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4 rounded-xl border border-border/60 p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setDraft({
										...draft,
										theme: "light"
									}),
									className: cn("flex-1 rounded-lg border p-3 text-sm transition", draft.theme === "light" ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-accent"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "mx-auto mb-1 h-5 w-5" }), "Light"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setDraft({
										...draft,
										theme: "dark"
									}),
									className: cn("flex-1 rounded-lg border p-3 text-sm transition", draft.theme === "dark" ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-accent"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "mx-auto mb-1 h-5 w-5" }), "Dark"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-xl border border-border/60 p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-10 w-10 place-items-center rounded-lg gradient-brand text-white",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-5 w-5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium",
										children: "Notifications"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: "Toast messages for actions"
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: draft.notifications,
									onCheckedChange: (v) => setDraft({
										...draft,
										notifications: v
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border/60 p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium",
										children: "Data"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: "All data (except settings) will be permanently cleared from both this browser and the cloud database."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "destructive",
										size: "sm",
										className: "mt-3 rounded-lg",
										onClick: async () => {
											if (confirm("Clear ALL local data (students, attendance, fees, materials) and database tables (except settings)? This action cannot be undone.")) try {
												await syncDbStudents({ data: [] });
												await syncDbAttendance({ data: [] });
												await syncDbFees({ data: [] });
												await syncDbMaterials({ data: [] });
												localStorage.removeItem("students");
												localStorage.removeItem("attendance");
												localStorage.removeItem("fees");
												localStorage.removeItem("materials");
												toast.success("All data (except settings) cleared successfully. Reloading…");
												setTimeout(() => window.location.reload(), 700);
											} catch (err) {
												console.error("Failed to clear cloud database:", err);
												toast.error(`Failed to clear database data: ${err.message || err}`);
											}
										},
										children: "Clear All Data"
									})
								]
							})
						]
					})]
				})
			]
		})]
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
export { SettingsPage as component };
