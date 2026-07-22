import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as Input, s as cn, t as Button } from "./db-BwnUP-Gi.mjs";
import { a as uid, c as useHydrated, f as useTeachers, t as Badge } from "./hooks-6SRUr3Oq.mjs";
import { A as MapPin, C as Plus, L as GraduationCap, O as MessageCircle, T as Pencil, h as Search, u as Trash2, w as Phone } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as PageHeader } from "./AppShell-ml-5lpNv.mjs";
import { t as Label } from "./label-CDt-7BRc.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-DMNAXHok.mjs";
import { t as Textarea } from "./textarea-D2Q9MZx4.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-DLq_d9IE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/teachers-fRESTJvz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AVATAR_GRADIENTS = [
	"from-pink-500 to-rose-500",
	"from-violet-500 to-indigo-500",
	"from-blue-500 to-cyan-500",
	"from-emerald-500 to-teal-500",
	"from-amber-500 to-orange-500",
	"from-fuchsia-500 to-purple-500"
];
function getAvatarGradient(id) {
	let hash = 0;
	for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
	return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}
function getInitials(name) {
	return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}
function TeachersPage() {
	const hydrated = useHydrated();
	const [teachers, setTeachersState] = useTeachers();
	const [search, setSearch] = (0, import_react.useState)("");
	const [dialogOpen, setDialogOpen] = (0, import_react.useState)(false);
	const [deleteId, setDeleteId] = (0, import_react.useState)(null);
	const [editingTeacher, setEditingTeacher] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [mobileNo, setMobileNo] = (0, import_react.useState)("");
	const [address, setAddress] = (0, import_react.useState)("");
	const [qualification, setQualification] = (0, import_react.useState)("");
	const filteredTeachers = (0, import_react.useMemo)(() => {
		if (!search.trim()) return teachers;
		const q = search.toLowerCase();
		return teachers.filter((t) => t.name.toLowerCase().includes(q) || t.qualification.toLowerCase().includes(q) || t.mobileNo.includes(q) || t.address.toLowerCase().includes(q));
	}, [teachers, search]);
	const openAddDialog = () => {
		setEditingTeacher(null);
		setName("");
		setMobileNo("");
		setAddress("");
		setQualification("");
		setDialogOpen(true);
	};
	const openEditDialog = (teacher) => {
		setEditingTeacher(teacher);
		setName(teacher.name);
		setMobileNo(teacher.mobileNo);
		setAddress(teacher.address);
		setQualification(teacher.qualification);
		setDialogOpen(true);
	};
	const handleSave = async (e) => {
		e.preventDefault();
		if (!name.trim()) {
			toast.error("Name is required");
			return;
		}
		const cleanMobile = mobileNo.replace(/\D/g, "");
		if (!cleanMobile || cleanMobile.length !== 10) {
			toast.error("Mobile number must be a valid 10-digit number");
			return;
		}
		if (!qualification.trim()) {
			toast.error("Qualification is required");
			return;
		}
		if (!address.trim()) {
			toast.error("Address is required");
			return;
		}
		const updatedList = [...teachers];
		if (editingTeacher) {
			const idx = updatedList.findIndex((t) => t.id === editingTeacher.id);
			if (idx !== -1) {
				updatedList[idx] = {
					...editingTeacher,
					name: name.trim(),
					mobileNo: cleanMobile,
					address: address.trim(),
					qualification: qualification.trim()
				};
				await setTeachersState(updatedList);
				toast.success("Teacher details updated successfully!");
			}
		} else {
			const newTeacher = {
				id: uid(),
				name: name.trim(),
				mobileNo: cleanMobile,
				address: address.trim(),
				qualification: qualification.trim(),
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			await setTeachersState([...updatedList, newTeacher]);
			toast.success("New teacher added successfully!");
		}
		setDialogOpen(false);
	};
	const handleDelete = async () => {
		if (!deleteId) return;
		const updatedList = teachers.filter((t) => t.id !== deleteId);
		await setTeachersState(updatedList);
		toast.success("Teacher record deleted.");
		setDeleteId(null);
	};
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-[80vh] items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "h-10 w-10 animate-bounce text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Loading directory..."
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6 p-4 md:p-6 animate-in fade-in slide-in-from-bottom-2 duration-300",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
					title: "Teachers Directory",
					description: "Manage teacher personal records, contact numbers, and qualifications details."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: openAddDialog,
					className: "rounded-xl gradient-brand self-start sm:self-auto shadow-glow",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4.5 w-4.5" }), " Add Teacher"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass p-5 rounded-2xl flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
						children: "Total Teachers"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-3xl font-extrabold mt-1",
						children: teachers.length
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-12 w-12 rounded-2xl bg-primary/10 text-primary grid place-items-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "h-6 w-6" })
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2 max-w-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Search teachers by name, qualification, contact...",
						value: search,
						onChange: (e) => setSearch(e.target.value),
						className: "pl-9 h-10 rounded-xl bg-card border-border/60"
					})]
				})
			}),
			filteredTeachers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-2xl p-12 text-center text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "mx-auto mb-3 h-12 w-12 opacity-40 text-primary" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-lg font-medium",
						children: "No teachers found"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-1",
						children: "Try refining your search query or add a new teacher."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: filteredTeachers.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass group flex flex-col justify-between rounded-2xl border border-border/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-sm font-bold text-white shadow-glow", getAvatarGradient(t.id)),
							children: getInitials(t.name)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-base text-foreground leading-tight group-hover:text-primary transition-colors truncate",
								children: t.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								className: "mt-1.5 font-semibold text-[11px] rounded-lg",
								children: t.qualification
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 space-y-2.5 text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4 shrink-0 text-muted-foreground/75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `tel:${t.mobileNo}`,
								className: "hover:text-primary hover:underline font-mono",
								children: [
									"+91 ",
									t.mobileNo.slice(0, 5),
									" ",
									t.mobileNo.slice(5)
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 shrink-0 text-muted-foreground/75 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "line-clamp-2 leading-snug",
								children: t.address
							})]
						})]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex items-center justify-between border-t border-border/50 pt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: `https://wa.me/91${t.mobileNo}`,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:opacity-85 transition",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4 text-emerald-500 fill-emerald-500/10" }), "WhatsApp"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								className: "h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary",
								onClick: () => openEditDialog(t),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								className: "h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive",
								onClick: () => setDeleteId(t.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})]
						})]
					})]
				}, t.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: dialogOpen,
				onOpenChange: setDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md rounded-2xl animate-in zoom-in-95 duration-200",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "text-xl font-bold",
						children: editingTeacher ? "Edit Teacher Details" : "Add New Teacher"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSave,
						className: "space-y-4 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "name",
									children: "Teacher Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "name",
									placeholder: "e.g. Prof. Anita Sharma",
									value: name,
									onChange: (e) => setName(e.target.value),
									className: "rounded-xl border-border/60",
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "mobileNo",
									children: "Mobile Number"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "mobileNo",
									type: "tel",
									maxLength: 10,
									placeholder: "e.g. 9876543210 (10 digits)",
									value: mobileNo,
									onChange: (e) => setMobileNo(e.target.value),
									className: "rounded-xl border-border/60",
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "qualification",
									children: "Qualification"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "qualification",
									placeholder: "e.g. M.Sc. Physics, B.Ed.",
									value: qualification,
									onChange: (e) => setQualification(e.target.value),
									className: "rounded-xl border-border/60",
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "address",
									children: "Address"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "address",
									placeholder: "Full residential address",
									value: address,
									onChange: (e) => setAddress(e.target.value),
									className: "rounded-xl border-border/60 min-h-[80px]",
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "pt-4 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setDialogOpen(false),
									className: "rounded-xl",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "rounded-xl gradient-brand",
									children: editingTeacher ? "Save Changes" : "Register Teacher"
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: !!deleteId,
				onOpenChange: (open) => !open && setDeleteId(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, {
					className: "rounded-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Are you absolutely sure?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "This will permanently delete the teacher's record. This action cannot be undone." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
						className: "rounded-xl",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
						onClick: handleDelete,
						className: "rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground",
						children: "Delete Record"
					})] })]
				})
			})
		]
	});
}
//#endregion
export { TeachersPage as component };
