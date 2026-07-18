import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  Pencil,
  Trash2,
  UserPlus,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FeeStatusBadge } from "@/components/StatusBadges";
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
import { useAttendance, useFees, useHydrated, useStudents } from "@/lib/hooks";
import { STANDARDS, type Standard } from "@/lib/types";
import { formatCurrency, initials, studentAttendancePct, studentAvatarStyle, studentFeeStatus } from "@/lib/derive";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/students/")({
  head: () => ({
    meta: [
      { title: "Students — Vishwa Tuition Center" },
      { name: "description", content: "Manage all registered students with search, filters, and CRUD actions." },
    ],
  }),
  component: StudentsPage,
});

const PAGE_SIZE = 8;

function StudentsPage() {
  const hydrated = useHydrated();
  const [students, setStudentsState] = useStudents();
  const [attendance, setAttendanceState] = useAttendance();
  const [fees, setFeesState] = useFees();
  const navigate = useNavigate();

  const url = typeof window !== "undefined" ? new URL(window.location.href) : null;
  const initialQ = url?.searchParams.get("q") ?? "";

  const [q, setQ] = useState(initialQ);
  const [standard, setStandard] = useState<string>("all");
  const [school, setSchool] = useState<string>("all");
  const [feeStatus, setFeeStatus] = useState<string>("all");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const schools = useMemo(() => Array.from(new Set(students.map((s) => s.school))).sort(), [students]);

  const filtered = useMemo(() => {
    let out = students.filter((s) => {
      const matchQ =
        !q ||
        s.name.toLowerCase().includes(q.toLowerCase()) ||
        (s.registrationNo || "").toLowerCase().includes(q.toLowerCase()) ||
        s.parentName.toLowerCase().includes(q.toLowerCase()) ||
        s.fatherMobile.includes(q);
      const matchStd = standard === "all" || s.standard === standard;
      const matchSch = school === "all" || s.school === school;
      const fs = studentFeeStatus(s.id, fees);
      const matchFee =
        feeStatus === "all" ||
        (feeStatus === "paid" && !fs.hasPending) ||
        (feeStatus === "pending" && fs.hasPending);
      return matchQ && matchStd && matchSch && matchFee;
    });
    out = out.sort((a, b) => (sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
    return out;
  }, [students, q, standard, school, feeStatus, fees, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleDelete = () => {
    if (!deleteId) return;
    setStudentsState(students.filter((s) => s.id !== deleteId));
    setAttendanceState(attendance.filter((a) => a.studentId !== deleteId));
    setFeesState(fees.filter((f) => f.studentId !== deleteId));
    toast.success("Student deleted");
    setDeleteId(null);
  };

  const exportCsv = () => {
    const rows = [
      ["Name", "School", "Standard", "Parent", "Mobile", "Fees"],
      ...filtered.map((s) => [s.name, s.school, s.standard, s.parentName, s.fatherMobile, String(s.monthlyFees)]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported to CSV");
  };

  const activeFilters = [
    standard !== "all" && { label: `Std: ${standard}`, clear: () => setStandard("all") },
    school !== "all" && { label: `School: ${school}`, clear: () => setSchool("all") },
    feeStatus !== "all" && { label: `Fees: ${feeStatus}`, clear: () => setFeeStatus("all") },
    q && { label: `Search: ${q}`, clear: () => setQ("") },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description={`${filtered.length} of ${students.length} students`}
        actions={
          <>
            <Button variant="outline" onClick={exportCsv} className="rounded-xl">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button asChild className="rounded-xl gradient-brand shadow-glow">
              <Link to="/students/new">
                <UserPlus className="mr-2 h-4 w-4" /> New Student
              </Link>
            </Button>
          </>
        }
      />

      <div className="glass rounded-2xl p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, parent, mobile…"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              className="h-10 rounded-xl pl-9"
            />
          </div>
          <Select value={standard} onValueChange={(v) => { setStandard(v); setPage(1); }}>
            <SelectTrigger className="h-10 w-[140px] rounded-xl">
              <SelectValue placeholder="Standard" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Standards</SelectItem>
              {STANDARDS.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={school} onValueChange={(v) => { setSchool(v); setPage(1); }}>
            <SelectTrigger className="h-10 w-[180px] rounded-xl">
              <SelectValue placeholder="School" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Schools</SelectItem>
              {schools.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={feeStatus} onValueChange={(v) => { setFeeStatus(v); setPage(1); }}>
            <SelectTrigger className="h-10 w-[140px] rounded-xl">
              <SelectValue placeholder="Fees" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fees</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="h-10 rounded-xl" onClick={() => setSortAsc((v) => !v)}>
            <ArrowUpDown className="mr-2 h-4 w-4" /> Sort {sortAsc ? "A→Z" : "Z→A"}
          </Button>
        </div>

        {activeFilters.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            {activeFilters.map((f, i) => (
              <button
                key={i}
                onClick={f.clear}
                className="animate-in fade-in slide-in-from-left-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition hover:bg-primary/20"
              >
                {f.label} ✕
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="glass overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/40 hover:bg-secondary/40">
                <TableHead>Student</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Std</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Monthly</TableHead>
                <TableHead>Attn %</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!hydrated && (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">Loading…</TableCell>
                </TableRow>
              )}
              {hydrated && paged.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                    No students match your filters.
                  </TableCell>
                </TableRow>
              )}
              {paged.map((s) => {
                const fs = studentFeeStatus(s.id, fees);
                const attn = studentAttendancePct(s.id, attendance);
                return (
                  <TableRow key={s.id} className="group transition-colors hover:bg-accent/40">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full text-xs font-bold text-white"
                          style={s.photo ? undefined : studentAvatarStyle(s)}
                        >
                          {s.photo ? <img src={s.photo} alt={s.name} className="h-full w-full object-cover" /> : initials(s.name)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium">{s.name}</div>
                          <div className="text-xs text-muted-foreground">{s.gender}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate">{s.school}</TableCell>
                    <TableCell><Badge variant="secondary">{s.standard}</Badge></TableCell>
                    <TableCell className="max-w-[160px] truncate">{s.parentName}</TableCell>
                    <TableCell className="font-mono text-xs">{s.fatherMobile}</TableCell>
                    <TableCell>{formatCurrency(s.monthlyFees)}</TableCell>
                    <TableCell>
                      <span className={cn("font-semibold", attn >= 75 ? "text-emerald-600" : attn >= 50 ? "text-amber-600" : "text-destructive")}>
                        {attn}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                        <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
                          <Link to="/students/$id" params={{ id: s.id }}><Eye className="h-4 w-4" /></Link>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => navigate({ to: "/students/$id", params: { id: s.id }, search: { edit: "1" } as any })}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => setDeleteId(s.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border/60 px-4 py-3">
          <div className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-1">
            <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg" disabled={currentPage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => (
              <Button
                key={i}
                size="sm"
                variant={currentPage === i + 1 ? "default" : "outline"}
                className={cn("h-8 w-8 rounded-lg p-0", currentPage === i + 1 && "gradient-brand text-white")}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg" disabled={currentPage === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Standard-wise quick filter chips */}
      <div className="glass rounded-2xl p-5">
        <h3 className="mb-3 font-semibold">Filter by Standard</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setStandard("all"); setPage(1); }}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition",
              standard === "all" ? "gradient-brand border-transparent text-white shadow-glow" : "border-border hover:bg-accent",
            )}
          >
            All ({students.length})
          </button>
          {STANDARDS.map((s) => {
            const count = students.filter((st) => st.standard === s).length;
            const active = standard === s;
            return (
              <button
                key={s}
                onClick={() => { setStandard(s as Standard); setPage(1); }}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition",
                  active ? "gradient-brand border-transparent text-white shadow-glow" : "border-border hover:bg-accent",
                )}
              >
                {s} <span className="ml-1 opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this student?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the student and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
