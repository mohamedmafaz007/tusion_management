import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Phone,
  MapPin,
  GraduationCap,
  MessageCircle,
} from "lucide-react";
import { PageHeader } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTeachers, useHydrated } from "@/lib/hooks";
import { uid } from "@/lib/storage";
import { type Teacher } from "@/lib/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/teachers")({
  head: () => ({
    meta: [
      { title: "Teachers Directory — Vishwa Tuition Center" },
      { name: "description", content: "Manage teacher details, qualifications, and contacts." },
    ],
  }),
  component: TeachersPage,
});

// Vibrant gradients for avatars
const AVATAR_GRADIENTS = [
  "from-pink-500 to-rose-500",
  "from-violet-500 to-indigo-500",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-fuchsia-500 to-purple-500",
];

function getAvatarGradient(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function TeachersPage() {
  const hydrated = useHydrated();
  const [teachers, setTeachersState] = useTeachers();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [name, setName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [address, setAddress] = useState("");
  const [qualification, setQualification] = useState("");

  const filteredTeachers = useMemo(() => {
    if (!search.trim()) return teachers;
    const q = search.toLowerCase();
    return teachers.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.qualification.toLowerCase().includes(q) ||
        t.mobileNo.includes(q) ||
        t.address.toLowerCase().includes(q)
    );
  }, [teachers, search]);

  const openAddDialog = () => {
    setEditingTeacher(null);
    setName("");
    setMobileNo("");
    setAddress("");
    setQualification("");
    setDialogOpen(true);
  };

  const openEditDialog = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setName(teacher.name);
    setMobileNo(teacher.mobileNo);
    setAddress(teacher.address);
    setQualification(teacher.qualification);
    setDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
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
      // Edit mode
      const idx = updatedList.findIndex((t) => t.id === editingTeacher.id);
      if (idx !== -1) {
        updatedList[idx] = {
          ...editingTeacher,
          name: name.trim(),
          mobileNo: cleanMobile,
          address: address.trim(),
          qualification: qualification.trim(),
        };
        await setTeachersState(updatedList);
        toast.success("Teacher details updated successfully!");
      }
    } else {
      // Add mode
      const newTeacher: Teacher = {
        id: uid(),
        name: name.trim(),
        mobileNo: cleanMobile,
        address: address.trim(),
        qualification: qualification.trim(),
        createdAt: new Date().toISOString(),
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

  if (!hydrated) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <GraduationCap className="h-10 w-10 animate-bounce text-primary" />
          <p className="text-sm text-muted-foreground">Loading directory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Teachers Directory"
          description="Manage teacher personal records, contact numbers, and qualifications details."
        />
        <Button onClick={openAddDialog} className="rounded-xl gradient-brand self-start sm:self-auto shadow-glow">
          <Plus className="mr-2 h-4.5 w-4.5" /> Add Teacher
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass p-5 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Teachers</div>
            <div className="text-3xl font-extrabold mt-1">{teachers.length}</div>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary grid place-items-center">
            <GraduationCap className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search teachers by name, qualification, contact..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl bg-card border-border/60"
          />
        </div>
      </div>

      {/* Teachers Grid */}
      {filteredTeachers.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center text-muted-foreground">
          <GraduationCap className="mx-auto mb-3 h-12 w-12 opacity-40 text-primary" />
          <p className="text-lg font-medium">No teachers found</p>
          <p className="text-sm text-muted-foreground mt-1">Try refining your search query or add a new teacher.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTeachers.map((t) => (
            <div
              key={t.id}
              className="glass group flex flex-col justify-between rounded-2xl border border-border/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
            >
              <div>
                {/* Header card details */}
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-sm font-bold text-white shadow-glow",
                      getAvatarGradient(t.id)
                    )}
                  >
                    {getInitials(t.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-base text-foreground leading-tight group-hover:text-primary transition-colors truncate">
                      {t.name}
                    </h3>
                    <Badge variant="secondary" className="mt-1.5 font-semibold text-[11px] rounded-lg">
                      {t.qualification}
                    </Badge>
                  </div>
                </div>

                {/* Body details */}
                <div className="mt-5 space-y-2.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 shrink-0 text-muted-foreground/75" />
                    <a href={`tel:${t.mobileNo}`} className="hover:text-primary hover:underline font-mono">
                      +91 {t.mobileNo.slice(0, 5)} {t.mobileNo.slice(5)}
                    </a>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 shrink-0 text-muted-foreground/75 mt-0.5" />
                    <span className="line-clamp-2 leading-snug">{t.address}</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
                <a
                  href={`https://wa.me/91${t.mobileNo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:opacity-85 transition"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-500 fill-emerald-500/10" />
                  WhatsApp
                </a>

                <div className="flex gap-1.5">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"
                    onClick={() => openEditDialog(t)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setDeleteId(t.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl animate-in zoom-in-95 duration-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editingTeacher ? "Edit Teacher Details" : "Add New Teacher"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Teacher Name</Label>
              <Input
                id="name"
                placeholder="e.g. Prof. Anita Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border-border/60"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobileNo">Mobile Number</Label>
              <Input
                id="mobileNo"
                type="tel"
                maxLength={10}
                placeholder="e.g. 9876543210 (10 digits)"
                value={mobileNo}
                onChange={(e) => setMobileNo(e.target.value)}
                className="rounded-xl border-border/60"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="qualification">Qualification</Label>
              <Input
                id="qualification"
                placeholder="e.g. M.Sc. Physics, B.Ed."
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                className="rounded-xl border-border/60"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="Full residential address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="rounded-xl border-border/60 min-h-[80px]"
                required
              />
            </div>

            <DialogFooter className="pt-4 gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl gradient-brand">
                {editingTeacher ? "Save Changes" : "Register Teacher"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the teacher's record. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              Delete Record
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
