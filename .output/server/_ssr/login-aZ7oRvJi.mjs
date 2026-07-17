import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as Input, t as Button, x as loginAdmin } from "./db-BANGggGZ.mjs";
import { A as Lock, P as GraduationCap, ft as ArrowRight, j as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-aZ7oRvJi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const [password, setPassword] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!password.trim()) {
			toast.error("Password is required");
			return;
		}
		setLoading(true);
		try {
			const res = await loginAdmin({ data: password });
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
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute inset-0 -z-10 overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-[40%] -left-[20%] h-[80%] w-[60%] rounded-full bg-primary/10 blur-[120px]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-[40%] -right-[20%] h-[80%] w-[60%] rounded-full bg-purple-500/10 blur-[120px]" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
							children: "Admin Password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "password",
								placeholder: "••••••••",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								className: "h-11 rounded-xl pl-10 border-border/60 bg-secondary/30 focus-visible:bg-card focus-visible:ring-1",
								disabled: loading
							})]
						})]
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
					children: ["Default password is ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "vishwa@123" })]
				})
			]
		})]
	});
}
//#endregion
export { LoginPage as component };
