import { o as __toESM } from "../_runtime.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-BuCw9PeA.mjs";
import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime, j as Slot } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/db-BMGMEAbh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var isServer = typeof window === "undefined";
var cachedSql = null;
async function getSql() {
	if (typeof window !== "undefined") return null;
	if (cachedSql) return cachedSql;
	const connectionString = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL;
	if (!connectionString) return null;
	try {
		const { default: postgres } = await import("../_libs/postgres.mjs").then((n) => n.t);
		cachedSql = postgres(connectionString.replace(/^["']|["']$/g, ""), {
			ssl: "require",
			max: 10,
			idle_timeout: 20,
			connect_timeout: 10
		});
		return cachedSql;
	} catch (err) {
		console.error("Failed to dynamically import postgres driver:", err);
		return null;
	}
}
async function initDb() {
	const sql = await getSql();
	if (!sql) {
		console.log("Database connection string not configured. Skipping initialization.");
		return;
	}
	try {
		if ((await sql`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'students' AND column_name = 'gender'
    `).length === 0) {
			console.log("Migrating database schemas to match TypeScript interfaces...");
			await sql`DROP TABLE IF EXISTS students CASCADE`;
			await sql`DROP TABLE IF EXISTS attendance CASCADE`;
			await sql`DROP TABLE IF EXISTS fees CASCADE`;
			await sql`DROP TABLE IF EXISTS materials CASCADE`;
			await sql`DROP TABLE IF EXISTS settings CASCADE`;
		}
		await sql`
      CREATE TABLE IF NOT EXISTS students (
        "id" TEXT PRIMARY KEY,
        "photo" TEXT,
        "name" TEXT NOT NULL,
        "gender" TEXT NOT NULL,
        "dob" TEXT NOT NULL,
        "school" TEXT NOT NULL,
        "standard" TEXT NOT NULL,
        "section" TEXT NOT NULL,
        "parentName" TEXT NOT NULL,
        "fatherMobile" TEXT NOT NULL,
        "motherMobile" TEXT NOT NULL,
        "address" TEXT NOT NULL,
        "joiningDate" TEXT NOT NULL,
        "monthlyFees" INTEGER NOT NULL,
        "admissionFees" INTEGER NOT NULL,
        "notes" TEXT,
        "createdAt" TEXT NOT NULL
      )
    `;
		await sql`
      CREATE TABLE IF NOT EXISTS attendance (
        "id" TEXT PRIMARY KEY,
        "studentId" TEXT NOT NULL,
        "date" TEXT NOT NULL,
        "status" TEXT NOT NULL,
        "remarks" TEXT
      )
    `;
		await sql`
      CREATE TABLE IF NOT EXISTS fees (
        "id" TEXT PRIMARY KEY,
        "studentId" TEXT NOT NULL,
        "month" TEXT NOT NULL,
        "amount" INTEGER NOT NULL,
        "paidAmount" INTEGER NOT NULL,
        "paidDate" TEXT,
        "status" TEXT NOT NULL
      )
    `;
		await sql`
      CREATE TABLE IF NOT EXISTS materials (
        "id" TEXT PRIMARY KEY,
        "standard" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "fileName" TEXT NOT NULL,
        "fileType" TEXT NOT NULL,
        "size" INTEGER NOT NULL,
        "driveUrl" TEXT NOT NULL,
        "driveFileId" TEXT NOT NULL,
        "createdAt" TEXT NOT NULL
      )
    `;
		await sql`
      CREATE TABLE IF NOT EXISTS settings (
        "key" TEXT PRIMARY KEY,
        "value" TEXT NOT NULL
      )
    `;
		await sql`
      CREATE TABLE IF NOT EXISTS message_logs (
        "id" TEXT PRIMARY KEY,
        "type" TEXT NOT NULL,
        "studentId" TEXT NOT NULL,
        "studentName" TEXT NOT NULL,
        "recipientPhone" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "status" TEXT NOT NULL,
        "error" TEXT,
        "timestamp" TEXT NOT NULL
      )
    `;
		console.log("Neon Postgres Database tables checked/initialized successfully!");
	} catch (err) {
		console.error("Neon Postgres Database initialization failed:", err);
	}
}
if (isServer) initDb();
var isDbConfigured = createServerFn({ method: "GET" }).handler(createSsrRpc("c5eb8a68e4ec900442dce8a00888e100157bc1876de6aeed1aae613bc9cda6f0"));
var getDbStudents = createServerFn({ method: "GET" }).handler(createSsrRpc("ef01ed4999ef9934a8ac9c2cd2b8185094865576b81122715a0d6094abc82017"));
var syncDbStudents = createServerFn({ method: "POST" }).validator((students) => students).handler(createSsrRpc("aa8ae33754abdd005f7751348dd9d155619066b4e57f5237315066d57ddeadea"));
var getDbAttendance = createServerFn({ method: "GET" }).handler(createSsrRpc("6207d2bdafd8de10423a08fa3b76fa9832b35b4bfa8e6f5773fdcb2c581bb555"));
var syncDbAttendance = createServerFn({ method: "POST" }).validator((attendance) => attendance).handler(createSsrRpc("fed33b670184b4a477a31eb9cf33f2f500e195e50fd132a81598e2aa1f6ee06c"));
var getDbFees = createServerFn({ method: "GET" }).handler(createSsrRpc("52066844ace69045f2c28451d013fa29c371a9f68b25781593b896e5aa768c59"));
var syncDbFees = createServerFn({ method: "POST" }).validator((fees) => fees).handler(createSsrRpc("ffe37f11922aea0eed5ce0e1c85a59696529f381da248a76ec5298dfcd2aad64"));
var getDbMaterials = createServerFn({ method: "GET" }).handler(createSsrRpc("039f1c84c7d3e5a9d36b54c2246e98ed21558a5a3e724bf6aac138005dccd739"));
var syncDbMaterials = createServerFn({ method: "POST" }).validator((materials) => materials).handler(createSsrRpc("fcfa01bb33417347dd9afa325159acc162b3decf91fb70e5d51bbd8e42fccb0c"));
var getDbSettings = createServerFn({ method: "GET" }).handler(createSsrRpc("8c314cc40ab74b642ec11974ee9e82f2bacbda17ce4c76c45f3be27fd9530a57"));
var syncDbSettings = createServerFn({ method: "POST" }).validator((settings) => settings).handler(createSsrRpc("fc4cb5544d6e8ad5f1d76da0e7848034ce2a5a66a1f2da46a5074d7a3d2071af"));
var sendWhatsAppAlert = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("6550f40d0d6bd6fc3c0ec9ee35d7f6610d97916e42d3cfb1d876d5f5a2b88aa7"));
var getBaileysStatus = createServerFn({ method: "GET" }).handler(createSsrRpc("cbb6d0a066e9cd203ec8a282513e97fef76181da468af218e37e4d6c17379f5f"));
var connectBaileys = createServerFn({ method: "POST" }).handler(createSsrRpc("d45ac4fa59cfed8f508f7a3df567d9c2a2498f98f204353b09ea8425b6803156"));
var disconnectBaileys = createServerFn({ method: "POST" }).handler(createSsrRpc("d9e5634cd66743fd04ea6d7ea2e0e17257eb7e79a593574f42517290d41ce6e8"));
var sendWhatsAppReceipt = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("5f1038d906fe4e903f229fcadab432689aebbe3076d0dd633006d57ae6dc2dad"));
var getMessageLogs = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("d6ac73139492144ab665712d21dbfe25698970e7bee47dc17360cdfbe8c367f2"));
var getMessageLogStats = createServerFn({ method: "GET" }).handler(createSsrRpc("6cd6b42355a0e909586427fea7b9d4ced6e3da0d6b7bca7d5b72d2e8b90347c3"));
var deleteDbMessageLog = createServerFn({ method: "POST" }).validator((id) => id).handler(createSsrRpc("05e0065d3f1de2545dd11c7aa8919eb8910c8c515ddb9710ffda28d7d082155b"));
var clearAllDbMessageLogs = createServerFn({ method: "POST" }).handler(createSsrRpc("11742a2342af451ac969619af62aa2e61035f77409c43f46eded95c7339afcf7"));
var sendBulkAttendanceAlerts = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("f11fad9f43e85b657fad11ff47a766ff43b8fb7a7fbf9d27c6e4df239a262bf1"));
var sendMonthlyFeeReminders = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("99219519f29c1519dfba38ef3cc31f42d06d7dba6bfecedeef3d0b70e7a0af8e"));
var sendFeeOverdueReminders = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("db76bd9ccdccbb8a7e6332fd5566a2173747a8996054e5e01fdefd78a5a7ac1e"));
var checkAndSendBirthdayWishes = createServerFn({ method: "POST" }).handler(createSsrRpc("79989711839cf161caae6860a1ec23a58954010c75ddf7e7435ffa11ff4204b0"));
var checkAndSendFestivalGreetings = createServerFn({ method: "POST" }).handler(createSsrRpc("2bb2e6ec9cbe835d7c74c0ae53952b0d552c165a6b95de3f812eb789f5adf0f3"));
var loginAdmin = createServerFn({ method: "POST" }).validator((password) => password).handler(createSsrRpc("88830e17169b508f96bdac39016eacc7a7078dd59237ad345b1c7ab4c73f2f3c"));
//#endregion
export { syncDbStudents as A, sendMonthlyFeeReminders as C, syncDbFees as D, syncDbAttendance as E, syncDbMaterials as O, sendFeeOverdueReminders as S, sendWhatsAppReceipt as T, getMessageLogStats as _, checkAndSendFestivalGreetings as a, loginAdmin as b, connectBaileys as c, getBaileysStatus as d, getDbAttendance as f, getDbStudents as g, getDbSettings as h, checkAndSendBirthdayWishes as i, syncDbSettings as k, deleteDbMessageLog as l, getDbMaterials as m, Input as n, clearAllDbMessageLogs as o, getDbFees as p, buttonVariants as r, cn as s, Button as t, disconnectBaileys as u, getMessageLogs as v, sendWhatsAppAlert as w, sendBulkAttendanceAlerts as x, isDbConfigured as y };
