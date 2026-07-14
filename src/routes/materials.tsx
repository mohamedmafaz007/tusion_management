import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  Upload, Search, Trash2, Download, Eye, FileText, FileImage, FileVideo,
  FileType, Presentation, FolderOpen,
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

function MaterialsPage() {
  useHydrated();
  const [materials, setMaterialsState] = useMaterials();
  const [standard, setStandard] = useState<Standard>("6th");
  const [type, setType] = useState<string>("all");
  const [q, setQ] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [previewMaterial, setPreviewMaterial] = useState<typeof materials[0] | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handlePreview = (m: typeof materials[0]) => {
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
    if (!form.file || !form.title.trim()) {
      toast.error("Provide a title and file");
      return;
    }
    const file = form.file;
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = file.size < 3 * 1024 * 1024 ? (reader.result as string) : undefined;
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
          dataUrl,
          createdAt: new Date().toISOString(),
        },
      ]);
      toast.success("Material uploaded");
      setUploadOpen(false);
      setForm({ title: "", type: "Notes", file: null });
    };
    reader.readAsDataURL(file);
  };

  const remove = (id: string) => {
    setMaterialsState(materials.filter((m) => m.id !== id));
    toast.success("Material deleted");
  };

  const download = (id: string) => {
    const m = materials.find((mm) => mm.id === id);
    if (!m?.dataUrl) return toast.error("File data unavailable (large files not stored)");
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
                <div className="grid h-11 w-11 place-items-center rounded-xl gradient-brand text-white shadow-glow">
                  {extIcon(m.fileType)}
                </div>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase">{m.fileType || "file"}</span>
              </div>
              <div className="min-w-0">
                <div className="truncate font-semibold">{m.title}</div>
                <div className="truncate text-xs text-muted-foreground">{m.fileName}</div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  {m.type} • {(m.size / 1024).toFixed(1)} KB
                </div>
              </div>
              <div className="mt-auto flex gap-1">
                <Button size="sm" variant="outline" className="flex-1 rounded-lg" onClick={() => handlePreview(m)} disabled={!m.dataUrl}>
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
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Algebra Notes Ch. 3" />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as MaterialType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MATERIAL_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>File</Label>
              <div
                onClick={() => fileRef.current?.click()}
                className="cursor-pointer rounded-xl border-2 border-dashed border-border/60 p-6 text-center transition hover:border-primary hover:bg-accent/30"
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
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadOpen(false)}>Cancel</Button>
            <Button className="gradient-brand" onClick={handleUpload}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewUrl} onOpenChange={(o) => !o && handleClosePreview()}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Preview - {previewMaterial?.title}</DialogTitle>
          </DialogHeader>
          {previewUrl && previewMaterial && (
            previewMaterial.fileType && ["jpg", "jpeg", "png", "gif", "webp"].includes(previewMaterial.fileType.toLowerCase()) ? (
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
