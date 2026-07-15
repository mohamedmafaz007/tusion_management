import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  Upload, Search, Trash2, Download, Eye, FileText, FileImage, FileVideo,
  FileType, Presentation, FolderOpen, Cloud,
} from "lucide-react";
import { PageHeader } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useHydrated, useMaterials } from "@/lib/hooks";
import { uid } from "@/lib/storage";
import { MATERIAL_TYPES, STANDARDS, type MaterialType, type Standard } from "@/lib/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";


export const Route = createFileRoute("/materials")({
  head: () => ({
    meta: [
      { title: "Study Materials — Bright Minds Tuition" },
      { name: "description", content: "Upload and organize notes, question papers, and study materials by class." },
    ],
  }),
  component: MaterialsPage,
});

function extIcon(ext: string) {
  if (["pdf"].includes(ext)) return <FileType className="h-6 w-6" />;
  if (["doc", "docx"].includes(ext)) return <FileText className="h-6 w-6" />;
  if (["ppt", "pptx"].includes(ext)) return <Presentation className="h-6 w-6" />;
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return <FileImage className="h-6 w-6" />;
  if (["mp4", "mov", "webm"].includes(ext)) return <FileVideo className="h-6 w-6" />;
  return <FileText className="h-6 w-6" />;
}

function dataUrlToBlobUrl(dataUrl: string): string {
  try {
    const parts = dataUrl.split(",");
    const mime = parts[0].match(/:(.*?);/)?.[1] || "";
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const blob = new Blob([u8arr], { type: mime });
    return URL.createObjectURL(blob);
  } catch (e) {
    console.error("Failed to convert dataURL to BlobURL:", e);
    return dataUrl;
  }
}

function extractDriveFileId(url: string): string | null {
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
  useHydrated();
  const [materials, setMaterialsState] = useMaterials();
  const [standard, setStandard] = useState<Standard>("6th");
  const [type, setType] = useState<string>("all");
  const [q, setQ] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [previewMaterial, setPreviewMaterial] = useState<typeof materials[0] | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [uploadSource, setUploadSource] = useState<"local" | "drive">("local");
  const [driveUrl, setDriveUrl] = useState("");
  const [driveFileType, setDriveFileType] = useState("pdf");
  const [isUploading, setIsUploading] = useState(false);

  const handlePreview = (m: typeof materials[0]) => {
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
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setPreviewMaterial(null);
  };

  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<{ title: string; type: MaterialType; file: File | null }>({
    title: "",
    type: "Notes",
    file: null,
  });

  const filtered = useMemo(
    () =>
      materials
        .filter((m) => m.standard === standard)
        .filter((m) => type === "all" || m.type === type)
        .filter((m) => !q || m.title.toLowerCase().includes(q.toLowerCase()) || m.fileName.toLowerCase().includes(q.toLowerCase())),
    [materials, standard, type, q],
  );

  const countByStd = (s: Standard) => materials.filter((m) => m.standard === s).length;

  const handleUpload = () => {
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
      setMaterialsState([
        ...materials,
        {
          id: uid(),
          standard,
          type: form.type,
          title: form.title.trim(),
          fileName: "Google Drive File",
          fileType: driveFileType,
          size: 0,
          driveUrl: driveUrl.trim(),
          driveFileId: fileId,
          createdAt: new Date().toISOString(),
        },
      ]);
      toast.success("Google Drive material linked");
      setUploadOpen(false);
      setForm({ title: "", type: "Notes", file: null });
      setDriveUrl("");
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
          const fileBase64 = reader.result as string;
          
          const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
          const folderId = import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID;

          if (!scriptUrl || !folderId) {
            throw new Error("Upload configuration is missing. Please check your .env file.");
          }

          const response = await fetch(scriptUrl, {
            method: "POST",
            body: JSON.stringify({
              fileName: file.name,
              fileBase64,
              mimeType,
              folderId,
            }),
          });

          if (!response.ok) {
            throw new Error(`Upload server returned status ${response.status}`);
          }

          const result = (await response.json()) as { id?: string; link?: string; error?: string };
          
          if (result.error) {
            throw new Error(result.error);
          }

          const driveResult = {
            id: result.id!,
            link: result.link!,
          };

          setMaterialsState([
            ...materials,
            {
              id: uid(),
              standard,
              type: form.type,
              title: form.title.trim(),
              fileName: file.name,
              fileType: ext,
              size: file.size,
              driveUrl: driveResult.link,
              driveFileId: driveResult.id,
              createdAt: new Date().toISOString(),
            },
          ]);
          toast.success("File uploaded directly to Google Drive!");
          setUploadOpen(false);
          setForm({ title: "", type: "Notes", file: null });
        } catch (err: any) {
          console.error("Direct upload failed:", err);
          toast.error(err.message || "Failed to upload to Google Drive");
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const remove = (id: string) => {
    setMaterialsState(materials.filter((m) => m.id !== id));
    toast.success("Material deleted");
  };

  const download = (id: string) => {
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Study Materials"
        description="Organize notes, papers, and worksheets by standard."
        actions={
          <Button className="rounded-xl gradient-brand shadow-glow" onClick={() => setUploadOpen(true)}>
            <Upload className="mr-2 h-4 w-4" /> Upload Material
          </Button>
        }
      />

      {/* Standard folders */}
      <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {STANDARDS.map((s) => {
          const active = standard === s;
          return (
            <button
              key={s}
              onClick={() => setStandard(s)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-2xl p-4 transition-all hover:-translate-y-0.5",
                active ? "gradient-brand text-white shadow-glow" : "glass hover:shadow-glow",
              )}
            >
              <FolderOpen className="h-8 w-8" />
              <div className="text-sm font-bold">{s} Std</div>
              <div className={cn("text-xs", active ? "text-white/80" : "text-muted-foreground")}>
                {countByStd(s)} files
              </div>
            </button>
          );
        })}
      </div>

      <div className="glass flex flex-wrap gap-3 rounded-2xl p-4">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search materials…" value={q} onChange={(e) => setQ(e.target.value)} className="h-10 rounded-xl pl-9" />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="h-10 w-[200px] rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {MATERIAL_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-muted-foreground">
          <FolderOpen className="mx-auto mb-3 h-10 w-10 opacity-50" />
          <p>No materials in {standard} standard yet.</p>
          <Button className="mt-4 rounded-xl gradient-brand" onClick={() => setUploadOpen(true)}>
            <Upload className="mr-2 h-4 w-4" /> Upload the first one
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((m) => (
            <div key={m.id} className="glass group flex flex-col gap-3 rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-glow">
              <div className="flex items-start justify-between">
                {m.driveFileId ? (
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-500 text-white shadow-glow">
                    <Cloud className="h-6 w-6" />
                  </div>
                ) : (
                  <div className="grid h-11 w-11 place-items-center rounded-xl gradient-brand text-white shadow-glow">
                    {extIcon(m.fileType)}
                  </div>
                )}
                {m.driveFileId ? (
                  <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 text-[10px] font-bold uppercase">Google Drive</span>
                ) : (
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase">{m.fileType || "file"}</span>
                )}
              </div>
              <div className="min-w-0">
                <div className="truncate font-semibold">{m.title}</div>
                <div className="truncate text-xs text-muted-foreground">{m.fileName}</div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  {m.type} {m.driveFileId ? "• Cloud" : `• ${(m.size / 1024).toFixed(1)} KB`}
                </div>
              </div>
              <div className="mt-auto flex gap-1">
                <Button size="sm" variant="outline" className="flex-1 rounded-lg" onClick={() => handlePreview(m)} disabled={!m.dataUrl && !m.driveFileId}>
                  <Eye className="mr-1 h-3.5 w-3.5" /> Preview
                </Button>
                <Button size="sm" variant="outline" className="flex-1 rounded-lg" onClick={() => download(m.id)}>
                  <Download className="mr-1 h-3.5 w-3.5" /> Download
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => remove(m.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Study Material — {standard} Standard</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex rounded-xl bg-secondary/50 p-1">
              <button
                type="button"
                onClick={() => !isUploading && setUploadSource("local")}
                disabled={isUploading}
                className={cn(
                  "flex-1 rounded-lg py-1.5 text-xs font-semibold transition",
                  uploadSource === "local" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                  isUploading && "opacity-50 cursor-not-allowed"
                )}
              >
                Local File
              </button>
              <button
                type="button"
                onClick={() => !isUploading && setUploadSource("drive")}
                disabled={isUploading}
                className={cn(
                  "flex-1 rounded-lg py-1.5 text-xs font-semibold transition",
                  uploadSource === "drive" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                  isUploading && "opacity-50 cursor-not-allowed"
                )}
              >
                Google Drive Link
              </button>
            </div>

            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Algebra Notes Ch. 3" disabled={isUploading} />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as MaterialType })} disabled={isUploading}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MATERIAL_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {uploadSource === "local" ? (
              <div className="space-y-1.5">
                <Label>File</Label>
                <div
                  onClick={() => !isUploading && fileRef.current?.click()}
                  className={cn(
                    "cursor-pointer rounded-xl border-2 border-dashed border-border/60 p-6 text-center transition hover:border-primary hover:bg-accent/30",
                    isUploading && "opacity-50 cursor-not-allowed border-muted"
                  )}
                >
                  <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium">{form.file ? form.file.name : "Click to select file"}</p>
                  <p className="text-xs text-muted-foreground">PDF, DOC, PPT, image, video</p>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,image/*,video/*"
                  onChange={(e) => setForm({ ...form, file: e.target.files?.[0] ?? null })}
                  disabled={isUploading}
                />
              </div>
            ) : (
              <>
                <div className="space-y-1.5">
                  <Label>Google Drive Link</Label>
                  <Input
                    value={driveUrl}
                    onChange={(e) => setDriveUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                    disabled={isUploading}
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Ensure link permission is set to <strong>"Anyone with the link can view"</strong> on Google Drive.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label>File Type / Format</Label>
                  <Select value={driveFileType} onValueChange={setDriveFileType} disabled={isUploading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="doc">Word Document (Docx)</SelectItem>
                      <SelectItem value="ppt">PowerPoint Presentation (Pptx)</SelectItem>
                      <SelectItem value="image">Image (PNG, JPEG, WebP)</SelectItem>
                      <SelectItem value="video">Video (MP4, WebM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadOpen(false)} disabled={isUploading}>Cancel</Button>
            <Button className="gradient-brand" onClick={handleUpload} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewUrl} onOpenChange={(o) => !o && handleClosePreview()}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Preview - {previewMaterial?.title}</DialogTitle>
          </DialogHeader>
          {previewUrl && previewMaterial && (
            previewMaterial.driveFileId ? (
              <iframe src={previewUrl} title="drive-preview" className="h-[70vh] w-full rounded-xl" />
            ) : previewMaterial.fileType && ["jpg", "jpeg", "png", "gif", "webp"].includes(previewMaterial.fileType.toLowerCase()) ? (
              <img src={previewUrl} alt="preview" className="max-h-[70vh] w-full rounded-xl object-contain" />
            ) : previewMaterial.fileType && ["mp4", "mov", "webm"].includes(previewMaterial.fileType.toLowerCase()) ? (
              <video src={previewUrl} controls className="max-h-[70vh] w-full rounded-xl" />
            ) : previewMaterial.fileType && previewMaterial.fileType.toLowerCase() === "pdf" ? (
              <iframe src={previewUrl} title="pdf" className="h-[70vh] w-full rounded-xl" />
            ) : (
              <div className="p-6 text-center text-muted-foreground">Preview not available for this file type.</div>
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
