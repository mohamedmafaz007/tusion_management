import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { s as cn } from "./hooks-BQeneTLO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/StatCard-CUMrAwTq.js
var import_jsx_runtime = require_jsx_runtime();
function StatCard({ label, value, icon, hint, gradient, trend }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("group relative overflow-hidden rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-glow", gradient ? "gradient-brand text-white" : "glass"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("text-xs font-medium uppercase tracking-wider", gradient ? "text-white/80" : "text-muted-foreground"),
						children: label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 text-3xl font-black tracking-tight",
						children: value
					}),
					hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("mt-1 text-xs", gradient ? "text-white/70" : "text-muted-foreground"),
						children: hint
					}),
					trend && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold", gradient ? "bg-white/20 text-white" : trend.positive ? "bg-emerald-500/10 text-emerald-600" : "bg-destructive/10 text-destructive"),
						children: trend.value
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-transform group-hover:scale-110", gradient ? "bg-white/20 text-white" : "gradient-brand text-white shadow-glow"),
				children: icon
			})]
		})
	});
}
//#endregion
export { StatCard as t };
