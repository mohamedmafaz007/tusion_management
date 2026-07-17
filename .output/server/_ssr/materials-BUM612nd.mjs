import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as Input, s as cn, t as Button } from "./db-_-56JTAZ.mjs";
import { c as useHydrated, i as STANDARDS, l as useMaterials, r as MATERIAL_TYPES } from "./hooks-P7UI8aLI.mjs";
import { G as Cloud, H as FileImage, L as FolderOpen, R as FileType, S as Presentation, U as Eye, V as FilePlay, W as Download, h as Search, s as Upload, u as Trash2, z as FileText } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as PageHeader } from "./AppShell-lF0Fo40s.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-HRfI_rwd.mjs";
import { t as Label } from "./label-B6_btTH_.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-DXeksx_D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/materials-BUM612nd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function extIcon(ext) {
	if (["pdf"].includes(ext)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileType, { className: "h-6 w-6" });
	if (["doc", "docx"].includes(ext)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-6 w-6" });
	if (["ppt", "pptx"].includes(ext)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presentation, { className: "h-6 w-6" });
	if ([
		"jpg",
		"jpeg",
		"png",
		"gif",
		"webp"
	].includes(ext)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileImage, { className: "h-6 w-6" });
	if ([
		"mp4",
		"mov",
		"webm"
	].includes(ext)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilePlay, { className: "h-6 w-6" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-6 w-6" });
}
function dataUrlToBlobUrl(dataUrl) {
	try {
		const parts = dataUrl.split(",");
		const mime = parts[0].match(/:(.*?);/)?.[1] || "";
		const bstr = atob(parts[1]);
		let n = bstr.length;
		const u8arr = new Uint8Array(n);
		while (n--) u8arr[n] = bstr.charCodeAt(n);
		const blob = new Blob([u8arr], { type: mime });
		return URL.createObjectURL(blob);
	} catch (e) {
		console.error("Failed to convert dataURL to BlobURL:", e);
		return dataUrl;
	}
}
function extractDriveFileId(url) {
	const reg1 = /\/file\/d\/([a-zA-Z0-9_-]{25,100})/i;
	const reg2 = /\/d\/([a-zA-Z0-9_-]{25,100})/i;
	const reg3 = /[?&]id=([a-zA-Z0-9_-]{25,100})/i;
	const m1 = url.match(reg1);
	if (m1) return m1[1];
	const m2 = url.match(reg2);
	if (m2) return m2[1];
	const m3 = url.match(reg3);
	if (m3) return m3[1];
	return null;
}
function MaterialsPage() {
	const hydrated = useHydrated();
	const [materials, setMaterialsState] = useMaterials();
	const [standard, setStandard] = (0, import_react.useState)("6th");
	const [type, setType] = (0, import_react.useState)("all");
	const [q, setQ] = (0, import_react.useState)("");
	const [uploadOpen, setUploadOpen] = (0, import_react.useState)(false);
	const [previewMaterial, setPreviewMaterial] = (0, import_react.useState)(null);
	const [previewUrl, setPreviewUrl] = (0, import_react.useState)(null);
	const [uploadSource, setUploadSource] = (0, import_react.useState)("local");
	const [driveUrl, setDriveUrl] = (0, import_react.useState)("");
	const [driveFileType, setDriveFileType] = (0, import_react.useState)("pdf");
	const [isUploading, setIsUploading] = (0, import_react.useState)(false);
	const handlePreview = (m) => {
		if (m.driveFileId) {
			setPreviewUrl(`https://drive.google.com/file/d/${m.driveFileId}/preview`);
			setPreviewMaterial(m);
			return;
		}
		if (!m.dataUrl) return;
		const url = dataUrlToBlobUrl(m.dataUrl);
		setPreviewUrl(url);
		setPreviewMaterial(m);
	};
	const handleClosePreview = () => {
		if (previewUrl && previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
		setPreviewUrl(null);
		setPreviewMaterial(null);
	};
	const fileRef = (0, import_react.useRef)(null);
	const [form, setForm] = (0, import_react.useState)({
		title: "",
		type: "Notes",
		file: null
	});
	const filtered = (0, import_react.useMemo)(() => materials.filter((m) => m.standard === standard).filter((m) => type === "all" || m.type === type).filter((m) => !q || m.title.toLowerCase().includes(q.toLowerCase()) || m.fileName.toLowerCase().includes(q.toLowerCase())), [
		materials,
		standard,
		type,
		q
	]);
	const countByStd = (s) => materials.filter((m) => m.standard === s).length;
	const handleUpload = async () => {
		let scriptUrl = "https://script.google.com/macros/s/AKfycbxbvZO510MwBJS5x6ik3Ly3PuckbzgCiHHqEp9Pmuf12LBhggartFxa_-R5KH7gfOLc/exec";
		let folderId = "1UMwKbEB28d3VBEXgDLhpypnsseufSenG";
		if (scriptUrl) scriptUrl = scriptUrl.replace(/^["']|["']$/g, "");
		if (folderId) folderId = folderId.replace(/^["']|["']$/g, "");
		if (!scriptUrl || !folderId) {
			toast.error("Upload configuration is missing. Please check your .env file.");
			return;
		}
		if (uploadSource === "drive") {
			if (!driveUrl.trim() || !form.title.trim()) {
				toast.error("Provide a title and Google Drive link");
				return;
			}
			const fileId = extractDriveFileId(driveUrl);
			if (!fileId) {
				toast.error("Invalid Google Drive URL. Could not extract File ID.");
				return;
			}
			setIsUploading(true);
			try {
				const response = await fetch(scriptUrl, {
					method: "POST",
					body: JSON.stringify({
						action: "link",
						fileId,
						title: form.title.trim(),
						standard,
						type: form.type,
						folderId
					})
				});
				if (!response.ok) throw new Error(`Upload server returned status ${response.status}`);
				const result = await response.json();
				if (result.error) throw new Error(result.error);
				setMaterialsState([...materials, {
					id: result.id,
					standard,
					type: form.type,
					title: form.title.trim(),
					fileName: "Google Drive File",
					fileType: driveFileType,
					size: 0,
					driveUrl: result.link,
					driveFileId: result.id,
					createdAt: (/* @__PURE__ */ new Date()).toISOString()
				}]);
				toast.success("Google Drive material linked");
				setUploadOpen(false);
				setForm({
					title: "",
					type: "Notes",
					file: null
				});
				setDriveUrl("");
			} catch (err) {
				console.error("Linking failed:", err);
				toast.error(err.message || "Failed to link Google Drive file");
			} finally {
				setIsUploading(false);
			}
		} else {
			if (!form.file || !form.title.trim()) {
				toast.error("Provide a title and file");
				return;
			}
			const file = form.file;
			const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
			const mimeType = file.type || "application/octet-stream";
			setIsUploading(true);
			const reader = new FileReader();
			reader.onload = async () => {
				try {
					const fileBase64 = reader.result;
					const response = await fetch(scriptUrl, {
						method: "POST",
						body: JSON.stringify({
							fileName: file.name,
							fileBase64,
							mimeType,
							folderId,
							title: form.title.trim(),
							standard,
							type: form.type
						})
					});
					if (!response.ok) throw new Error(`Upload server returned status ${response.status}`);
					const result = await response.json();
					if (result.error) throw new Error(result.error);
					setMaterialsState([...materials, {
						id: result.id,
						standard,
						type: form.type,
						title: form.title.trim(),
						fileName: file.name,
						fileType: ext,
						size: file.size,
						driveUrl: result.link,
						driveFileId: result.id,
						createdAt: (/* @__PURE__ */ new Date()).toISOString()
					}]);
					toast.success("File uploaded directly to Google Drive!");
					setUploadOpen(false);
					setForm({
						title: "",
						type: "Notes",
						file: null
					});
				} catch (err) {
					console.error("Direct upload failed:", err);
					toast.error(err.message || "Failed to upload to Google Drive");
				} finally {
					setIsUploading(false);
				}
			};
			reader.readAsDataURL(file);
		}
	};
	const remove = async (id) => {
		let scriptUrl = "https://script.google.com/macros/s/AKfycbxbvZO510MwBJS5x6ik3Ly3PuckbzgCiHHqEp9Pmuf12LBhggartFxa_-R5KH7gfOLc/exec";
		let folderId = "1UMwKbEB28d3VBEXgDLhpypnsseufSenG";
		if (scriptUrl) scriptUrl = scriptUrl.replace(/^["']|["']$/g, "");
		if (folderId) folderId = folderId.replace(/^["']|["']$/g, "");
		setMaterialsState(materials.filter((m) => m.id !== id));
		toast.success("Material deleted");
		if (scriptUrl && folderId) try {
			await fetch(scriptUrl, {
				method: "POST",
				body: JSON.stringify({
					action: "delete",
					fileId: id,
					folderId
				})
			});
		} catch (err) {
			console.error("Failed to delete file from Google Drive:", err);
		}
	};
	const download = (id) => {
		const m = materials.find((mm) => mm.id === id);
		if (!m) return;
		if (m.driveUrl) {
			window.open(m.driveUrl, "_blank");
			toast.success("Opening Google Drive file...");
			return;
		}
		if (!m.dataUrl) return toast.error("File data unavailable (large files not stored)");
		const a = document.createElement("a");
		a.href = m.dataUrl;
		a.download = m.fileName;
		a.click();
		toast.success("Download started");
	};
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Study Materials",
			description: "Organize notes, papers, and worksheets by standard.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "rounded-xl gradient-brand shadow-glow",
				disabled: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mr-2 h-4 w-4" }), " Upload Material"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 animate-pulse",
			children: [
				1,
				2,
				3,
				4,
				5,
				6,
				7
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass flex flex-col items-center gap-2 rounded-2xl p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-8 rounded-full bg-muted/30" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-12 rounded bg-muted/30" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-16 rounded bg-muted/30" })
				]
			}, i))
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Study Materials",
				description: "Organize notes, papers, and worksheets by standard.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "rounded-xl gradient-brand shadow-glow",
					onClick: () => setUploadOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mr-2 h-4 w-4" }), " Upload Material"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7",
				children: STANDARDS.map((s) => {
					const active = standard === s;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setStandard(s),
						className: cn("flex flex-col items-center gap-2 rounded-2xl p-4 transition-all hover:-translate-y-0.5", active ? "gradient-brand text-white shadow-glow" : "glass hover:shadow-glow"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, { className: "h-8 w-8" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-sm font-bold",
								children: [s, " Std"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cn("text-xs", active ? "text-white/80" : "text-muted-foreground"),
								children: [countByStd(s), " files"]
							})
						]
					}, s);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass flex flex-wrap gap-3 rounded-2xl p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative min-w-[220px] flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Search materials…",
						value: q,
						onChange: (e) => setQ(e.target.value),
						className: "h-10 rounded-xl pl-9"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: type,
					onValueChange: setType,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "h-10 w-[200px] rounded-xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "all",
						children: "All Types"
					}), MATERIAL_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: t,
						children: t
					}, t))] })]
				})]
			}),
			filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-2xl p-10 text-center text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, { className: "mx-auto mb-3 h-10 w-10 opacity-50" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"No materials in ",
						standard,
						" standard yet."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "mt-4 rounded-xl gradient-brand",
						onClick: () => setUploadOpen(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mr-2 h-4 w-4" }), " Upload the first one"]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
				children: filtered.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass group flex flex-col gap-3 rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-glow",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between",
							children: [m.driveFileId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-11 w-11 place-items-center rounded-xl bg-emerald-500 text-white shadow-glow",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className: "h-6 w-6" })
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-11 w-11 place-items-center rounded-xl gradient-brand text-white shadow-glow",
								children: extIcon(m.fileType)
							}), m.driveFileId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 text-[10px] font-bold uppercase",
								children: "Google Drive"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase",
								children: m.fileType || "file"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate font-semibold",
									children: m.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-xs text-muted-foreground",
									children: m.fileName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 text-[11px] text-muted-foreground",
									children: [
										m.type,
										" ",
										m.driveFileId ? "• Cloud" : `• ${(m.size / 1024).toFixed(1)} KB`
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-auto flex gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									className: "flex-1 rounded-lg",
									onClick: () => handlePreview(m),
									disabled: !m.dataUrl && !m.driveFileId,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "mr-1 h-3.5 w-3.5" }), " Preview"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									className: "flex-1 rounded-lg",
									onClick: () => download(m.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1 h-3.5 w-3.5" }), " Download"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									className: "h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive",
									onClick: () => remove(m.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
								})
							]
						})
					]
				}, m.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: uploadOpen,
				onOpenChange: setUploadOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: [
						"Upload Study Material — ",
						standard,
						" Standard"
					] }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex rounded-xl bg-secondary/50 p-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => !isUploading && setUploadSource("local"),
									disabled: isUploading,
									className: cn("flex-1 rounded-lg py-1.5 text-xs font-semibold transition", uploadSource === "local" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground", isUploading && "opacity-50 cursor-not-allowed"),
									children: "Local File"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => !isUploading && setUploadSource("drive"),
									disabled: isUploading,
									className: cn("flex-1 rounded-lg py-1.5 text-xs font-semibold transition", uploadSource === "drive" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground", isUploading && "opacity-50 cursor-not-allowed"),
									children: "Google Drive Link"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.title,
									onChange: (e) => setForm({
										...form,
										title: e.target.value
									}),
									placeholder: "e.g. Algebra Notes Ch. 3",
									disabled: isUploading
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Category" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: form.type,
									onValueChange: (v) => setForm({
										...form,
										type: v
									}),
									disabled: isUploading,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: MATERIAL_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: t,
										children: t
									}, t)) })]
								})]
							}),
							uploadSource === "local" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "File" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										onClick: () => !isUploading && fileRef.current?.click(),
										className: cn("cursor-pointer rounded-xl border-2 border-dashed border-border/60 p-6 text-center transition hover:border-primary hover:bg-accent/30", isUploading && "opacity-50 cursor-not-allowed border-muted"),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mx-auto mb-2 h-8 w-8 text-muted-foreground" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-medium",
												children: form.file ? form.file.name : "Click to select file"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: "PDF, DOC, PPT, image, video"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										ref: fileRef,
										type: "file",
										className: "hidden",
										accept: ".pdf,.doc,.docx,.ppt,.pptx,image/*,video/*",
										onChange: (e) => setForm({
											...form,
											file: e.target.files?.[0] ?? null
										}),
										disabled: isUploading
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Google Drive Link" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: driveUrl,
										onChange: (e) => setDriveUrl(e.target.value),
										placeholder: "https://drive.google.com/file/d/.../view?usp=sharing",
										disabled: isUploading
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[10px] text-muted-foreground",
										children: [
											"Ensure link permission is set to ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "\"Anyone with the link can view\"" }),
											" on Google Drive."
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "File Type / Format" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: driveFileType,
									onValueChange: setDriveFileType,
									disabled: isUploading,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select format" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "pdf",
											children: "PDF Document"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "doc",
											children: "Word Document (Docx)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "ppt",
											children: "PowerPoint Presentation (Pptx)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "image",
											children: "Image (PNG, JPEG, WebP)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "video",
											children: "Video (MP4, WebM)"
										})
									] })]
								})]
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setUploadOpen(false),
						disabled: isUploading,
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "gradient-brand",
						onClick: handleUpload,
						disabled: isUploading,
						children: isUploading ? "Uploading..." : "Upload"
					})] })
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!previewUrl,
				onOpenChange: (o) => !o && handleClosePreview(),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-3xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Preview - ", previewMaterial?.title] }) }), previewUrl && previewMaterial && (previewMaterial.driveFileId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
						src: previewUrl,
						title: "drive-preview",
						className: "h-[70vh] w-full rounded-xl"
					}) : previewMaterial.fileType && [
						"jpg",
						"jpeg",
						"png",
						"gif",
						"webp"
					].includes(previewMaterial.fileType.toLowerCase()) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: previewUrl,
						alt: "preview",
						className: "max-h-[70vh] w-full rounded-xl object-contain"
					}) : previewMaterial.fileType && [
						"mp4",
						"mov",
						"webm"
					].includes(previewMaterial.fileType.toLowerCase()) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						src: previewUrl,
						controls: true,
						className: "max-h-[70vh] w-full rounded-xl"
					}) : previewMaterial.fileType && previewMaterial.fileType.toLowerCase() === "pdf" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
						src: previewUrl,
						title: "pdf",
						className: "h-[70vh] w-full rounded-xl"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-6 text-center text-muted-foreground",
						children: "Preview not available for this file type."
					}))]
				})
			})
		]
	});
}
//#endregion
export { MaterialsPage as component };
