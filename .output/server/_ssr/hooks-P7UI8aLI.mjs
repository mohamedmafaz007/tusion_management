import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { A as syncDbStudents, D as syncDbFees, E as syncDbAttendance, O as syncDbMaterials, f as getDbAttendance, g as getDbStudents, h as getDbSettings, k as syncDbSettings, m as getDbMaterials, p as getDbFees, s as cn, y as isDbConfigured } from "./db-_-56JTAZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hooks-P7UI8aLI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
export { uid as a, useHydrated as c, useStudents as d, STANDARDS as i, useMaterials as l, DEFAULT_SETTINGS as n, useAttendance as o, MATERIAL_TYPES as r, useFees as s, Badge as t, useSettings as u };
