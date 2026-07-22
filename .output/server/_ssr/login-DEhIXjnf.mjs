import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { N as verifyOtpAndResetPassword, T as sendPasswordResetOtp, n as Input, t as Button, x as loginAdmin } from "./db-BwnUP-Gi.mjs";
import { F as KeyRound, L as GraduationCap, M as Lock, N as LoaderCircle, gt as ArrowRight } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-CDt-7BRc.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DMNAXHok.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DEhIXjnf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const [password, setPassword] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [forgotOpen, setForgotOpen] = (0, import_react.useState)(false);
	const [otpStep, setOtpStep] = (0, import_react.useState)(1);
	const [otpCode, setOtpCode] = (0, import_react.useState)("");
	const [newPass, setNewPass] = (0, import_react.useState)("");
	const [confirmPass, setConfirmPass] = (0, import_react.useState)("");
	const [otpLoading, setOtpLoading] = (0, import_react.useState)(false);
	const [otpVerifying, setOtpVerifying] = (0, import_react.useState)(false);
	const handleOpenForgot = () => {
		setOtpStep(1);
		setOtpCode("");
		setNewPass("");
		setConfirmPass("");
		setForgotOpen(true);
	};
	const handleSendOtp = async () => {
		setOtpLoading(true);
		try {
			const res = await sendPasswordResetOtp();
			if (res.success) {
				if (res.loggedToConsole) toast.success("OTP generated! (Check server console terminal logs for the code).");
				else toast.success("OTP code sent to vishwatutioncenter@gmail.com!");
				setOtpStep(2);
			} else toast.error(res.error || "Failed to generate OTP");
		} catch (err) {
			toast.error(err.message || "Failed to send OTP code");
		} finally {
			setOtpLoading(false);
		}
	};
	const handleVerifyAndReset = async (e) => {
		e.preventDefault();
		if (otpCode.length !== 6) {
			toast.error("Please enter a valid 6-digit OTP code");
			return;
		}
		if (!newPass.trim()) {
			toast.error("Password cannot be empty");
			return;
		}
		if (newPass.length < 4) {
			toast.error("Password must be at least 4 characters long");
			return;
		}
		if (newPass !== confirmPass) {
			toast.error("Passwords do not match");
			return;
		}
		setOtpVerifying(true);
		try {
			const res = await verifyOtpAndResetPassword({ data: {
				otp: otpCode,
				newPassword: newPass.trim()
			} });
			if (res.success) {
				localStorage.setItem("tms.admin_password", newPass.trim());
				localStorage.setItem("tms.auth_token", res.token || "vishwa_admin_session_token_123");
				toast.success("Password updated successfully! Welcome to dashboard.");
				setForgotOpen(false);
				window.location.href = "/";
			} else toast.error(res.error || "Verification failed");
		} catch (err) {
			toast.error(err.message || "Failed to reset password");
		} finally {
			setOtpVerifying(false);
		}
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		const inputPassword = password.trim();
		if (!inputPassword) {
			toast.error("Password is required");
			return;
		}
		setLoading(true);
		try {
			if (inputPassword === (localStorage.getItem("tms.admin_password") || "vishwa@123")) {
				localStorage.setItem("tms.auth_token", "vishwa_admin_session_token_123");
				toast.success("Successfully logged in!");
				window.location.href = "/";
				return;
			}
			const res = await loginAdmin({ data: inputPassword });
			if (res.success) {
				localStorage.setItem("tms.auth_token", res.token);
				toast.success("Successfully logged in!");
				window.location.href = "/";
			} else toast.error(res.error || "Incorrect password");
		} catch (err) {
			toast.error(err.message || "Failed to authenticate");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen w-full items-center justify-center bg-background px-4 relative overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0 -z-10 overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-[40%] -left-[20%] h-[80%] w-[60%] rounded-full bg-primary/10 blur-[120px]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-[40%] -right-[20%] h-[80%] w-[60%] rounded-full bg-purple-500/10 blur-[120px]" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass w-full max-w-md rounded-3xl p-8 shadow-glow border border-border/60",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-12 w-12 place-items-center rounded-2xl gradient-brand text-white shadow-glow mb-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "h-6 w-6" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl font-black tracking-tight gradient-text",
								children: "Vishwa Tuition Center"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 text-sm text-muted-foreground",
								children: "Admin Portal Authentication"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSubmit,
						className: "mt-8 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
									children: "Admin Password"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "password",
										placeholder: "••••••••",
										value: password,
										onChange: (e) => setPassword(e.target.value),
										className: "h-11 rounded-xl pl-10 border-border/60 bg-secondary/30 focus-visible:bg-card focus-visible:ring-1",
										disabled: loading
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: handleOpenForgot,
										className: "text-xs text-primary hover:underline font-semibold",
										children: "Forgot Password?"
									})
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: loading,
							className: "w-full h-11 rounded-xl gradient-brand text-white font-semibold shadow-glow mt-6",
							children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Login" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-2 h-4 w-4" })]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 text-center text-xs text-muted-foreground",
						children: [
							"Default password is ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "vishwa@123" }),
							" (unless updated in settings)."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: forgotOpen,
				onOpenChange: setForgotOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md rounded-2xl animate-in zoom-in-95 duration-200",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "text-xl font-bold flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-5.5 w-5.5 text-primary" }), "Reset Admin Password"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "We will send a 6-digit OTP code to the administrator email address." })] }), otpStep === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-primary leading-normal",
							children: ["An OTP (One-Time Password) will be sent to the registered email:", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-bold mt-1 text-base text-foreground font-mono",
								children: "vishwatutioncenter@gmail.com"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							onClick: handleSendOtp,
							disabled: otpLoading,
							className: "w-full h-11 rounded-xl gradient-brand text-white font-semibold shadow-glow",
							children: otpLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : "Send OTP Code"
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleVerifyAndReset,
						className: "space-y-4 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "otp",
									children: "Enter 6-Digit OTP"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "otp",
									maxLength: 6,
									placeholder: "e.g. 123456",
									value: otpCode,
									onChange: (e) => setOtpCode(e.target.value.replace(/\D/g, "")),
									className: "rounded-xl border-border/60 font-mono tracking-[0.3em] text-center text-lg h-11",
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "newPass",
									children: "New Password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "newPass",
									type: "password",
									placeholder: "••••••••",
									value: newPass,
									onChange: (e) => setNewPass(e.target.value),
									className: "rounded-xl border-border/60 h-11",
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "confirmPass",
									children: "Confirm Password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "confirmPass",
									type: "password",
									placeholder: "••••••••",
									value: confirmPass,
									onChange: (e) => setConfirmPass(e.target.value),
									className: "rounded-xl border-border/60 h-11",
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "pt-4 gap-2 flex flex-col-reverse sm:flex-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setOtpStep(1),
									className: "rounded-xl h-11",
									disabled: otpVerifying,
									children: "Back"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									disabled: otpVerifying,
									className: "rounded-xl gradient-brand h-11 flex-1 text-white font-semibold",
									children: otpVerifying ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : "Reset & Login"
								})]
							})
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { LoginPage as component };
