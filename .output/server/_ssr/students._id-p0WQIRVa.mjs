import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/students._id-p0WQIRVa.js
var $$splitComponentImporter = () => import("./students._id-B3Tah8Y7.mjs");
var Route = createFileRoute("/students/$id")({
	head: () => ({ meta: [{ title: "Student Profile — Vishwa Tuition Center" }, {
		name: "description",
		content: "Detailed student profile with attendance, fees, and performance."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
