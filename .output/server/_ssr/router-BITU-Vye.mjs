import { o as __toESM } from "../_runtime.mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { _ as sendMonthlyFeeReminders, o as checkAndSendBirthdayWishes } from "./hooks-D6hNI9RI.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as AppShell } from "./AppShell-CJAo8Cx0.mjs";
import { t as Route$12 } from "./students._id-mfoEe5dj.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { i as stringType, n as enumType, r as objectType, t as coerce } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BITU-Vye.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-RTN9NhZf.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-[60vh] items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass max-w-md rounded-3xl p-10 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "gradient-text text-7xl font-black",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-xl gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:opacity-90",
						children: "Back to Dashboard"
					})
				})
			]
		})
	}) });
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass max-w-md rounded-3xl p-10 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong. Try refreshing or head back to the dashboard."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-xl gradient-brand px-4 py-2 text-sm font-medium text-white",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-xl border border-input bg-background px-4 py-2 text-sm font-medium transition hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$11 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Vishwa Tuition Center — Tuition Management Dashboard" },
			{
				name: "description",
				content: "Premium tuition management dashboard for tracking students, attendance, fees, and study materials with a modern glassmorphism UI."
			},
			{
				name: "author",
				content: "Vishwa Tuition Center"
			},
			{
				property: "og:title",
				content: "Vishwa Tuition Center — Tuition Management Dashboard"
			},
			{
				property: "og:description",
				content: "Manage students, attendance, fees and study materials in one premium admin dashboard."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/tution-logo.png",
				type: "image/png"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			style: { fontFamily: "Inter, system-ui, sans-serif" },
			children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})]
		})]
	});
}
function RootComponent() {
	const { queryClient } = Route$11.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			position: "top-right",
			richColors: true
		})]
	});
}
var BASE_URL = "";
var Route$10 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async () => {
	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[
		{
			path: "/",
			changefreq: "weekly",
			priority: "1.0"
		},
		{
			path: "/students",
			changefreq: "weekly",
			priority: "0.8"
		},
		{
			path: "/students/new",
			changefreq: "monthly",
			priority: "0.6"
		},
		{
			path: "/attendance",
			changefreq: "weekly",
			priority: "0.7"
		},
		{
			path: "/reports",
			changefreq: "weekly",
			priority: "0.7"
		},
		{
			path: "/fees",
			changefreq: "weekly",
			priority: "0.7"
		},
		{
			path: "/materials",
			changefreq: "weekly",
			priority: "0.7"
		},
		{
			path: "/settings",
			changefreq: "monthly",
			priority: "0.5"
		}
	].map((e) => `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`).join("\n")}\n</urlset>`;
	return new Response(xml, { headers: {
		"Content-Type": "application/xml",
		"Cache-Control": "public, max-age=3600"
	} });
} } } });
var $$splitComponentImporter$8 = () => import("./settings-5Uyy0mzZ.mjs");
var Route$9 = createFileRoute("/settings")({
	head: () => ({ meta: [{ title: "Settings — Vishwa Tuition Center" }, {
		name: "description",
		content: "Configure institute details, theme, notifications and preferences."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./reports-DRth4WwH.mjs");
var Route$8 = createFileRoute("/reports")({
	head: () => ({ meta: [{ title: "Attendance Reports — Vishwa Tuition Center" }, {
		name: "description",
		content: "Beautiful charts and analytics for attendance trends."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./messages-BYuJjEmM.mjs");
var Route$7 = createFileRoute("/messages")({
	head: () => ({ meta: [{ title: "Message Logs — Vishwa Tuition Center" }, {
		name: "description",
		content: "Trace automatic WhatsApp alerts and trigger bulk parent notifications."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./materials-DNwXAFPA.mjs");
var Route$6 = createFileRoute("/materials")({
	head: () => ({ meta: [{ title: "Study Materials — Vishwa Tuition Center" }, {
		name: "description",
		content: "Upload and organize notes, question papers, and study materials by class."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./fees-B9kgHBJ4.mjs");
var Route$5 = createFileRoute("/fees")({
	head: () => ({ meta: [{ title: "Fees — Vishwa Tuition Center" }, {
		name: "description",
		content: "Track fee payments, generate receipts, and view fee history."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./attendance-DKKl73v7.mjs");
var Route$4 = createFileRoute("/attendance")({
	head: () => ({ meta: [{ title: "Attendance — Vishwa Tuition Center" }, {
		name: "description",
		content: "Mark daily attendance for students by class."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./routes-B0sVPTGF.mjs");
var Route$3 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "Dashboard — Vishwa Tuition Center" }, {
		name: "description",
		content: "Overview of students, attendance, and fee collection."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./students.index-aVDa2jvD.mjs");
var Route$2 = createFileRoute("/students/")({
	head: () => ({ meta: [{ title: "Students — Vishwa Tuition Center" }, {
		name: "description",
		content: "Manage all registered students with search, filters, and CRUD actions."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./students.new-BekpbGJ0.mjs");
objectType({
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
var Route$1 = createFileRoute("/students/new")({
	head: () => ({ meta: [{ title: "Register Student — Vishwa Tuition Center" }, {
		name: "description",
		content: "Enroll a new student into the tuition center."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var Route = createFileRoute("/api/cron")({ server: { handlers: { GET: async () => {
	console.log("[Cron] Starting automated daily message checks...");
	try {
		const birthdayRes = await checkAndSendBirthdayWishes();
		let feeRes = {
			sent: 0,
			failed: 0,
			total: 0
		};
		const today = /* @__PURE__ */ new Date();
		if (today.getDate() === 1) feeRes = await sendMonthlyFeeReminders({ data: { month: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}` } });
		return new Response(JSON.stringify({
			success: true,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			birthdays: {
				found: birthdayRes.birthdaysFound || 0,
				sent: birthdayRes.sent || 0,
				failed: birthdayRes.failed || 0
			},
			feeReminders: {
				sent: feeRes.sent || 0,
				failed: feeRes.failed || 0,
				totalScan: feeRes.total || 0
			}
		}), { headers: { "Content-Type": "application/json" } });
	} catch (err) {
		console.error("[Cron] Auto-campaign failed:", err);
		return new Response(JSON.stringify({
			success: false,
			error: err.message || String(err)
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
} } } });
var SitemapDotxmlRoute = Route$10.update({
	id: "/sitemap.xml",
	path: "/sitemap.xml",
	getParentRoute: () => Route$11
});
var SettingsRoute = Route$9.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => Route$11
});
var ReportsRoute = Route$8.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => Route$11
});
var MessagesRoute = Route$7.update({
	id: "/messages",
	path: "/messages",
	getParentRoute: () => Route$11
});
var MaterialsRoute = Route$6.update({
	id: "/materials",
	path: "/materials",
	getParentRoute: () => Route$11
});
var FeesRoute = Route$5.update({
	id: "/fees",
	path: "/fees",
	getParentRoute: () => Route$11
});
var AttendanceRoute = Route$4.update({
	id: "/attendance",
	path: "/attendance",
	getParentRoute: () => Route$11
});
var IndexRoute = Route$3.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$11
});
var StudentsIndexRoute = Route$2.update({
	id: "/students/",
	path: "/students/",
	getParentRoute: () => Route$11
});
var StudentsNewRoute = Route$1.update({
	id: "/students/new",
	path: "/students/new",
	getParentRoute: () => Route$11
});
var StudentsIdRoute = Route$12.update({
	id: "/students/$id",
	path: "/students/$id",
	getParentRoute: () => Route$11
});
var rootRouteChildren = {
	IndexRoute,
	AttendanceRoute,
	FeesRoute,
	MaterialsRoute,
	MessagesRoute,
	ReportsRoute,
	SettingsRoute,
	SitemapDotxmlRoute,
	ApiCronRoute: Route.update({
		id: "/api/cron",
		path: "/api/cron",
		getParentRoute: () => Route$11
	}),
	StudentsIdRoute,
	StudentsNewRoute,
	StudentsIndexRoute
};
var routeTree = Route$11._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
