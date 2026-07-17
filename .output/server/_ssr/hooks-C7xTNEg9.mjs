import { o as __toESM } from "../_runtime.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-XI7Y1Ew-.mjs";
import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime, j as Slot } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hooks-C7xTNEg9.js
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
var badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
		outline: "text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var KEYS = {
	students: "tms.students",
	attendance: "tms.attendance",
	fees: "tms.fees",
	materials: "tms.materials",
	settings: "tms.settings",
	seeded: "tms.seeded"
};
function uid() {
	return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
function read(key, fallback) {
	if (typeof window === "undefined") return fallback;
	try {
		const raw = localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
}
function write(key, value) {
	if (typeof window === "undefined") return;
	localStorage.setItem(key, JSON.stringify(value));
	window.dispatchEvent(new CustomEvent("tms:storage", { detail: { key } }));
}
var getStudents = () => read(KEYS.students, []);
var setStudents = (v) => write(KEYS.students, v);
var getAttendance = () => read(KEYS.attendance, []);
var setAttendance = (v) => write(KEYS.attendance, v);
var getFees = () => read(KEYS.fees, []);
var setFees = (v) => write(KEYS.fees, v);
var getMaterials = () => read(KEYS.materials, []);
var setMaterials = (v) => write(KEYS.materials, v);
var DEFAULT_SETTINGS = {
	standards: [
		"6th",
		"7th",
		"8th",
		"9th",
		"10th",
		"11th",
		"12th"
	],
	instituteName: "Vishwa Tuition Center",
	teacherName: "Prof. Anita Sharma",
	contact: "+91 98765 43210",
	address: "12 MG Road, Bengaluru, IN",
	theme: "light",
	notifications: true,
	language: "English",
	whatsappProvider: "manual",
	whatsappTemplatePresent: "Dear Parent, your child [student_name] was marked ✅ PRESENT at Vishwa Tuition Center today ([date]) at [time]. Regards, Vishwa Tuition Center.",
	whatsappTemplateAbsent: "Dear Parent, your child [student_name] was marked ❌ ABSENT from Vishwa Tuition Center today ([date]). Please check with them. Regards, Vishwa Tuition Center.",
	whatsappTemplateLate: "Dear Parent, your child [student_name] arrived ⏰ LATE at Vishwa Tuition Center today ([date]) at [time]. Regards, Vishwa Tuition Center.",
	whatsappTemplateWelcome: "Dear Parent, thank you for registering [student_name] at Vishwa Tuition Center. We are excited to guide them on their academic journey. Regards, Prof. Anita Sharma.",
	whatsappTemplateFeeReminder: "Dear Parent, this is a reminder that the tuition fee of Rs. [amount] for [student_name] (Std: [standard]) for [month] is pending. Please arrange payment at your earliest convenience. Regards, Vishwa Tuition Center.",
	whatsappTemplateFeeOverdue: "Dear Parent, the tuition fee of Rs. [amount] for [student_name] for [month] is overdue. Kindly clear the dues to avoid any inconvenience. Regards, Vishwa Tuition Center.",
	whatsappTemplateBirthday: "Dear Parent, Vishwa Tuition Center wishes [student_name] a very Happy Birthday! 🎉🎂 May this year bring them great success. Regards, Vishwa Tuition Center."
};
var getSettings = () => read(KEYS.settings, DEFAULT_SETTINGS);
var setSettings = (v) => write(KEYS.settings, v);
var SAMPLE_NAMES = [
	"Aarav Sharma",
	"Ishita Verma",
	"Rohan Iyer",
	"Priya Nair",
	"Kabir Singh",
	"Ananya Rao",
	"Aditya Kumar",
	"Sneha Patel",
	"Vivaan Mehta",
	"Diya Kapoor",
	"Arjun Reddy",
	"Meera Joshi",
	"Yash Malhotra",
	"Aisha Khan",
	"Karan Gupta",
	"Nisha Bansal",
	"Rahul Das",
	"Kavya Menon",
	"Devansh Roy",
	"Tara Bhatt"
];
var SCHOOLS = [
	"Delhi Public School",
	"St. Xavier's",
	"Ryan International",
	"Kendriya Vidyalaya",
	"DAV Public"
];
var STDS = [
	"6th",
	"7th",
	"8th",
	"9th",
	"10th",
	"11th",
	"12th"
];
function seedIfNeeded() {
	if (typeof window === "undefined") return;
	if (!localStorage.getItem("tms.seeded_materials") && getMaterials().length === 0) {
		setMaterials([
			{
				id: uid(),
				standard: "6th",
				type: "Notes",
				title: "Mathematics Chapter 1: Number Systems",
				fileName: "math_ch1_numbers.pdf",
				fileType: "pdf",
				size: 125430,
				driveUrl: "https://drive.google.com/file/d/1UMwKbEB28d3VBEXgDLhpypnsseufSenG/view",
				driveFileId: "1UMwKbEB28d3VBEXgDLhpypnsseufSenG",
				createdAt: (/* @__PURE__ */ new Date(Date.now() - 3 * 864e5)).toISOString()
			},
			{
				id: uid(),
				standard: "6th",
				type: "Worksheets",
				title: "Science Worksheet: Light & Shadows",
				fileName: "science_light_shadows.pdf",
				fileType: "pdf",
				size: 98450,
				driveUrl: "https://drive.google.com/file/d/1UMwKbEB28d3VBEXgDLhpypnsseufSenG/view",
				driveFileId: "1UMwKbEB28d3VBEXgDLhpypnsseufSenG",
				createdAt: (/* @__PURE__ */ new Date(Date.now() - 2 * 864e5)).toISOString()
			},
			{
				id: uid(),
				standard: "7th",
				type: "Assignments",
				title: "Social Science Syllabus 2024-25",
				fileName: "sst_syllabus_2024.pdf",
				fileType: "pdf",
				size: 204500,
				driveUrl: "https://drive.google.com/file/d/1UMwKbEB28d3VBEXgDLhpypnsseufSenG/view",
				driveFileId: "1UMwKbEB28d3VBEXgDLhpypnsseufSenG",
				createdAt: (/* @__PURE__ */ new Date(Date.now() - 5 * 864e5)).toISOString()
			},
			{
				id: uid(),
				standard: "8th",
				type: "Worksheets",
				title: "English Grammar Worksheet: Tenses",
				fileName: "english_grammar_tenses.pdf",
				fileType: "pdf",
				size: 76500,
				driveUrl: "https://drive.google.com/file/d/1UMwKbEB28d3VBEXgDLhpypnsseufSenG/view",
				driveFileId: "1UMwKbEB28d3VBEXgDLhpypnsseufSenG",
				createdAt: (/* @__PURE__ */ new Date(Date.now() - 1 * 864e5)).toISOString()
			},
			{
				id: uid(),
				standard: "8th",
				type: "Question Papers",
				title: "Term 1 Science Question Paper",
				fileName: "science_term1_2023.pdf",
				fileType: "pdf",
				size: 312e3,
				driveUrl: "https://drive.google.com/file/d/1UMwKbEB28d3VBEXgDLhpypnsseufSenG/view",
				driveFileId: "1UMwKbEB28d3VBEXgDLhpypnsseufSenG",
				createdAt: (/* @__PURE__ */ new Date(Date.now() - 4 * 864e5)).toISOString()
			}
		]);
		localStorage.setItem("tms.seeded_materials", "1");
	}
	if (localStorage.getItem(KEYS.seeded)) return;
	const students = SAMPLE_NAMES.map((name, i) => ({
		id: uid(),
		name,
		gender: i % 3 === 0 ? "Female" : "Male",
		dob: `20${10 + i % 6}-0${i % 9 + 1}-1${i % 9}`,
		school: SCHOOLS[i % SCHOOLS.length],
		standard: STDS[i % STDS.length],
		section: [
			"A",
			"B",
			"C"
		][i % 3],
		parentName: `Parent of ${name.split(" ")[0]}`,
		fatherMobile: `98${(1e6 + i * 12345).toString().slice(0, 8)}`,
		motherMobile: `97${(2e6 + i * 54321).toString().slice(0, 8)}`,
		address: `${i + 1} Sample Street, City`,
		joiningDate: `2024-0${i % 9 + 1}-15`,
		monthlyFees: 1500 + i % 5 * 500,
		admissionFees: 2e3,
		notes: "",
		createdAt: (/* @__PURE__ */ new Date(Date.now() - i * 864e5)).toISOString()
	}));
	setStudents(students);
	const today = /* @__PURE__ */ new Date();
	const attendance = [];
	for (let d = 0; d < 30; d++) {
		const date = new Date(today);
		date.setDate(today.getDate() - d);
		const ds = date.toISOString().slice(0, 10);
		students.forEach((s, i) => {
			const r = (i + d) % 10;
			const status = r < 7 ? "Present" : r < 8 ? "Late" : r < 9 ? "Absent" : "Holiday";
			attendance.push({
				id: uid(),
				studentId: s.id,
				date: ds,
				status
			});
		});
	}
	setAttendance(attendance);
	const fees = [];
	const now = /* @__PURE__ */ new Date();
	for (let m = 0; m < 3; m++) {
		const md = new Date(now.getFullYear(), now.getMonth() - m, 1);
		const monthKey = `${md.getFullYear()}-${String(md.getMonth() + 1).padStart(2, "0")}`;
		students.forEach((s, i) => {
			const paid = m === 0 ? i % 3 !== 0 : i % 4 !== 0;
			fees.push({
				id: uid(),
				studentId: s.id,
				month: monthKey,
				amount: s.monthlyFees,
				paidAmount: paid ? s.monthlyFees : 0,
				paidDate: paid ? `${monthKey}-05` : void 0,
				status: paid ? "Paid" : "Pending"
			});
		});
	}
	setFees(fees);
	localStorage.setItem(KEYS.seeded, "1");
}
var STANDARDS = [
	"6th",
	"7th",
	"8th",
	"9th",
	"10th",
	"11th",
	"12th"
];
var MATERIAL_TYPES = [
	"Notes",
	"Assignments",
	"Question Papers",
	"Model Papers",
	"Worksheets",
	"Important Questions",
	"Previous Year Papers"
];
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
function useSynced(getter, setter, key) {
	const [state, setState] = (0, import_react.useState)(getter);
	(0, import_react.useEffect)(() => {
		const fetchFromDb = async () => {
			try {
				if (!await isDbConfigured()) return;
				let dbData = null;
				if (key === "students") dbData = await getDbStudents();
				else if (key === "attendance") dbData = await getDbAttendance();
				else if (key === "fees") dbData = await getDbFees();
				else if (key === "materials") dbData = await getDbMaterials();
				else if (key === "settings") dbData = await getDbSettings();
				if (dbData !== null && dbData !== void 0 && (!Array.isArray(dbData) || dbData.length > 0)) {
					setter(dbData);
					setState(dbData);
				}
			} catch (err) {
				console.error(`Failed to load ${key} from cloud database:`, err);
			}
		};
		fetchFromDb();
		const handler = (e) => {
			const detail = e.detail;
			if (!detail || detail.key?.includes(key)) setState(getter());
		};
		window.addEventListener("tms:storage", handler);
		window.addEventListener("storage", () => setState(getter()));
		return () => window.removeEventListener("tms:storage", handler);
	}, []);
	const update = async (v) => {
		const next = typeof v === "function" ? v(state) : v;
		setter(next);
		setState(next);
		try {
			if (!await isDbConfigured()) return;
			if (key === "students") await syncDbStudents({ data: next });
			else if (key === "attendance") await syncDbAttendance({ data: next });
			else if (key === "fees") await syncDbFees({ data: next });
			else if (key === "materials") await syncDbMaterials({ data: next });
			else if (key === "settings") await syncDbSettings({ data: next });
		} catch (err) {
			console.error(`Failed to sync ${key} to cloud database:`, err);
		}
	};
	return [state, update];
}
function useHydrated() {
	const [h, setH] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		seedIfNeeded();
		setH(true);
	}, []);
	return h;
}
var useStudents = () => useSynced(getStudents, setStudents, "students");
var useAttendance = () => useSynced(getAttendance, setAttendance, "attendance");
var useFees = () => useSynced(getFees, setFees, "fees");
var useMaterials = () => useSynced(getMaterials, setMaterials, "materials");
var useSettings = () => {
	const [settings, setSettingsState] = useSynced(getSettings, setSettings, "settings");
	if (settings && settings.standards && Array.isArray(settings.standards) && settings.standards.length > 0) STANDARDS.splice(0, STANDARDS.length, ...settings.standards);
	else STANDARDS.splice(0, STANDARDS.length, "6th", "7th", "8th", "9th", "10th", "11th", "12th");
	return [settings, setSettingsState];
};
//#endregion
export { useHydrated as A, syncDbAttendance as C, uid as D, syncDbStudents as E, useSettings as M, useStudents as N, useAttendance as O, sendWhatsAppReceipt as S, syncDbMaterials as T, getMessageLogs as _, MATERIAL_TYPES as a, sendMonthlyFeeReminders as b, checkAndSendBirthdayWishes as c, cn as d, connectBaileys as f, getMessageLogStats as g, getBaileysStatus as h, Input as i, useMaterials as j, useFees as k, checkAndSendFestivalGreetings as l, disconnectBaileys as m, Button as n, STANDARDS as o, deleteDbMessageLog as p, DEFAULT_SETTINGS as r, buttonVariants as s, Badge as t, clearAllDbMessageLogs as u, sendBulkAttendanceAlerts as v, syncDbFees as w, sendWhatsAppAlert as x, sendFeeOverdueReminders as y };
