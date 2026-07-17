import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { s as cn } from "./db-BANGggGZ.mjs";
import { t as Badge } from "./hooks-B2IK0jt7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/StatusBadges-1LIj98qH.js
var import_jsx_runtime = require_jsx_runtime();
function FeeStatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "outline",
		className: cn("border", {
			Paid: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
			Pending: "bg-destructive/15 text-destructive border-destructive/30",
			Partial: "bg-amber-500/15 text-amber-600 border-amber-500/30"
		}[status]),
		children: status
	});
}
function AttendanceStatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "outline",
		className: cn("border", {
			Present: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
			Absent: "bg-destructive/15 text-destructive border-destructive/30",
			Late: "bg-amber-500/15 text-amber-600 border-amber-500/30",
			Holiday: "bg-blue-500/15 text-blue-600 border-blue-500/30"
		}[status]),
		children: status
	});
}
//#endregion
export { FeeStatusBadge as n, AttendanceStatusBadge as t };
