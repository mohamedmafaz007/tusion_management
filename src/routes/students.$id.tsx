import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Pencil, Trash2, Phone, MapPin, Calendar, School as SchoolIcon, Save, X, Download } from "lucide-react";
import { getRegistrationPdf } from "@/lib/db";
import { PageHeader } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/StatCard";
import { AttendanceStatusBadge, FeeStatusBadge } from "@/components/StatusBadges";
import { useAttendance, useFees, useHydrated, useMaterials, useStudents } from "@/lib/hooks";
import { formatCurrency, initials, studentAttendancePct, studentAvatarStyle, studentFeeStatus, currentMonthKey } from "@/lib/derive";
import { toast } from "sonner";
import { uid } from "@/lib/storage";
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
import { Users, CalendarCheck, Wallet, BookOpen } from "lucide-react";

export const Route = createFileRoute("/students/$id")({
  head: () => ({
    meta: [
      { title: "Student Profile — Vishwa Tuition Center" },
      { name: "description", content: "Detailed student profile with attendance, fees, and performance." },
    ],
  }),
  component: StudentProfilePage,
});

function StudentProfilePage() {
  const { id } = Route.useParams();
  const hydrated = useHydrated();
  const [students, setStudentsState] = useStudents();
  const [attendance, setAttendanceState] = useAttendance();
  const [fees, setFeesState] = useFees();
  const [materials] = useMaterials();
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const student = students.find((s) => s.id === id);
  const [draft, setDraft] = useState(student);
  const [draftPending, setDraftPending] = useState(0);

  const recent = useMemo(
    () =>
      attendance
        .filter((r) => r.studentId === id)
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 10),
    [attendance, id],
  );

  const studentFees = useMemo(() => fees.filter((f) => f.studentId === id), [fees, id]);

  if (!hydrated) return <div className="p-6 text-muted-foreground">Loading…</div>;
  if (!student) {
    return (
      <div className="glass mx-auto max-w-md rounded-3xl p-10 text-center">
        <h2 className="text-xl font-semibold">Student not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">This student may have been deleted.</p>
        <Button asChild className="mt-4"><Link to="/students">Back to students</Link></Button>
      </div>
    );
  }

  const attn = studentAttendancePct(student.id, attendance);
  const fs = studentFeeStatus(student.id, fees);

  const save = () => {
    if (!draft) return;

    if (!draft.registrationNo?.trim()) {
      toast.error("Registration number is required");
      return;
    }

    if (!draft.name.trim()) {
      toast.error("Name is required");
      return;
    }

    const regNoClean = draft.registrationNo.trim();
    const isDuplicate = students.some(
      (s) => s.id !== id && s.registrationNo.trim().toLowerCase() === regNoClean.toLowerCase()
    );
    if (isDuplicate) {
      toast.error(`Registration number "${regNoClean}" is already in use by another student.`);
      return;
    }

    const fatherClean = draft.fatherMobile?.trim() || "";
    const motherClean = draft.motherMobile?.trim() || "";

    if (!fatherClean && !motherClean) {
      toast.error("At least one parent mobile number is required");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (fatherClean && !phoneRegex.test(fatherClean)) {
      toast.error("Father mobile must be 10 digits");
      return;
    }

    if (motherClean && !phoneRegex.test(motherClean)) {
      toast.error("Mother mobile must be 10 digits");
      return;
    }

    const updatedStudent = {
      ...draft,
      registrationNo: regNoClean,
      fatherMobile: fatherClean,
      motherMobile: motherClean,
      address: draft.address?.trim() || "",
    };

    setStudentsState(students.map((s) => (s.id === id ? updatedStudent : s)));

    // Update pending fees
    const newPending = Math.max(0, draftPending);
    const currentMonth = currentMonthKey();

    let studentFees = fees.filter((f) => f.studentId === id);
    const otherFees = fees.filter((f) => f.studentId !== id);

    const hasCurrentMonth = studentFees.some((f) => f.month === currentMonth);
    if (!hasCurrentMonth) {
      studentFees.push({
        id: uid(),
        studentId: id,
        month: currentMonth,
        amount: draft.monthlyFees,
        paidAmount: 0,
        status: "Pending",
      });
    }

    // Sort student fees descending (newest month first)
    studentFees.sort((a, b) => b.month.localeCompare(a.month));

    let remainingPending = newPending;
    studentFees = studentFees.map((f) => {
      const allocatedPending = Math.min(remainingPending, f.amount);
      const paidAmount = f.amount - allocatedPending;
      remainingPending -= allocatedPending;

      let status: typeof f.status = "Pending";
      if (allocatedPending === 0) {
        status = "Paid";
      } else if (allocatedPending === f.amount) {
        status = "Pending";
      } else {
        status = "Partial";
      }

      const paidDate = status === "Paid" ? (f.paidDate || new Date().toISOString().slice(0, 10)) : undefined;

      return {
        ...f,
        paidAmount,
        status,
        paidDate,
      };
    });

    if (remainingPending > 0 && studentFees.length > 0) {
      studentFees[0].amount += remainingPending;
      studentFees[0].paidAmount = 0;
      studentFees[0].status = "Pending";
      studentFees[0].paidDate = undefined;
    }

    setFeesState([...otherFees, ...studentFees]);
    toast.success("Student updated");
    setEdit(false);
  };

  const del = () => {
    setStudentsState(students.filter((s) => s.id !== id));
    setAttendanceState(attendance.filter((a) => a.studentId !== id));
    setFeesState(fees.filter((f) => f.studentId !== id));
    toast.success("Student deleted");
    navigate({ to: "/students" });
  };

  const downloadForm = async () => {
    const loader = toast.loading("Generating registration form PDF...");
    try {
      const res = await getRegistrationPdf({ data: { studentId: student.id } });
      if (res && res.pdfBase64) {
        const link = document.createElement("a");
        link.href = `data:application/pdf;base64,${res.pdfBase64}`;
        link.download = res.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Registration form downloaded successfully!", { id: loader });
      } else {
        toast.error("Failed to generate PDF.", { id: loader });
      }
    } catch (err: any) {
      console.error(err);
      toast.error(`Download failed: ${err.message || err}`, { id: loader });
    }
  };

  const assignedMaterials = materials.filter((m) => m.standard === student.standard).slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/students"><ArrowLeft className="mr-1 h-4 w-4" /> Back</Link>
        </Button>
      </div>

      <div className="glass overflow-hidden rounded-3xl">
        <div className="gradient-brand h-32" />
        <div className="grid gap-6 p-6 pt-0 sm:grid-cols-[auto_1fr_auto]">
          <div
            className="-mt-16 h-32 w-32 shrink-0 overflow-hidden rounded-3xl border-4 border-background shadow-glow"
            style={student.photo ? undefined : studentAvatarStyle(student)}
          >
            {student.photo ? (
              <img src={student.photo} alt={student.name} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full place-items-center text-3xl font-black text-white">{initials(student.name)}</div>
            )}
          </div>
          <div className="min-w-0 pt-4">
            <h2 className="truncate text-2xl font-bold">{student.name}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline" className="border-primary/50 text-primary font-semibold">{student.registrationNo}</Badge>
              <Badge variant="secondary">{student.standard} - {student.section}</Badge>
              <span className="inline-flex items-center gap-1"><SchoolIcon className="h-3.5 w-3.5" /> {student.school}</span>
              <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Joined {student.joiningDate}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              <span className="inline-flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> {student.fatherMobile}</span>
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {student.address}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-start gap-2 pt-4">
            {!edit ? (
              <>
                <Button variant="outline" className="rounded-xl" onClick={downloadForm}>
                  <Download className="mr-2 h-4 w-4" /> Download Form
                </Button>
                <Button variant="outline" className="rounded-xl" onClick={() => { setDraft(student); setDraftPending(fs.pending); setEdit(true); }}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button variant="outline" className="rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => setConfirmDel(true)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="rounded-xl" onClick={() => setEdit(false)}>
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
                <Button className="rounded-xl gradient-brand" onClick={save}>
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Attendance" value={`${attn}%`} icon={<CalendarCheck className="h-5 w-5" />} gradient />
        <StatCard label="Monthly Fee" value={formatCurrency(student.monthlyFees)} icon={<Wallet className="h-5 w-5" />} />
        <StatCard label="Pending" value={formatCurrency(fs.pending)} icon={<Wallet className="h-5 w-5" />} />
        <StatCard label="Assigned Materials" value={assignedMaterials.length} icon={<BookOpen className="h-5 w-5" />} />
      </div>

      {edit && draft && (
        <div className="glass rounded-2xl p-6">
          <h3 className="mb-4 font-semibold">Edit Details</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Fld label="Registration No"><Input value={draft.registrationNo} onChange={(e) => setDraft({ ...draft, registrationNo: e.target.value })} /></Fld>
            <Fld label="Name"><Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Fld>
            <Fld label="School"><Input value={draft.school} onChange={(e) => setDraft({ ...draft, school: e.target.value })} /></Fld>
            <Fld label="Section"><Input value={draft.section} onChange={(e) => setDraft({ ...draft, section: e.target.value })} /></Fld>
            <Fld label="Parent Name"><Input value={draft.parentName} onChange={(e) => setDraft({ ...draft, parentName: e.target.value })} /></Fld>
            <Fld label="Father Mobile"><Input value={draft.fatherMobile} onChange={(e) => setDraft({ ...draft, fatherMobile: e.target.value })} /></Fld>
            <Fld label="Mother Mobile"><Input value={draft.motherMobile} onChange={(e) => setDraft({ ...draft, motherMobile: e.target.value })} /></Fld>
            <Fld label="Monthly Fee"><Input type="number" value={draft.monthlyFees} onChange={(e) => setDraft({ ...draft, monthlyFees: +e.target.value })} /></Fld>
            <Fld label="Admission Fee"><Input type="number" value={draft.admissionFees} onChange={(e) => setDraft({ ...draft, admissionFees: +e.target.value })} /></Fld>
            <Fld label="Pending Fee"><Input type="number" value={draftPending} onChange={(e) => setDraftPending(+e.target.value)} /></Fld>
            <div className="md:col-span-2"><Fld label="Address"><Textarea rows={2} value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} /></Fld></div>
            <div className="md:col-span-2"><Fld label="Notes"><Textarea rows={2} value={draft.notes ?? ""} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} /></Fld></div>
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <h3 className="mb-4 font-semibold">Recent Attendance</h3>
          <ul className="space-y-2">
            {recent.length === 0 && <li className="text-sm text-muted-foreground">No attendance records yet.</li>}
            {recent.map((r) => (
              <li key={r.id} className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-accent/50">
                <span className="text-sm">{r.date}</span>
                <AttendanceStatusBadge status={r.status} />
              </li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="mb-4 font-semibold">Fee History</h3>
          <ul className="space-y-2">
            {studentFees.length === 0 && <li className="text-sm text-muted-foreground">No fee records yet.</li>}
            {studentFees.map((f) => (
              <li key={f.id} className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-accent/50">
                <div>
                  <div className="text-sm font-medium">{f.month}</div>
                  <div className="text-xs text-muted-foreground">{formatCurrency(f.amount)} • paid {formatCurrency(f.paidAmount)}</div>
                </div>
                <FeeStatusBadge status={f.status} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="mb-4 font-semibold">Assigned Materials ({student.standard})</h3>
        {assignedMaterials.length === 0 ? (
          <p className="text-sm text-muted-foreground">No materials uploaded for this standard yet.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {assignedMaterials.map((m) => (
              <div key={m.id} className="rounded-xl border border-border/60 bg-secondary/40 p-3">
                <div className="text-xs text-muted-foreground">{m.type}</div>
                <div className="font-medium">{m.title}</div>
                <div className="text-xs text-muted-foreground">{m.fileName}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={confirmDel} onOpenChange={setConfirmDel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {student.name}?</AlertDialogTitle>
            <AlertDialogDescription>This will remove the student and all references permanently.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={del} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Fld({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      {children}
    </div>
  );
}
