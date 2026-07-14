import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarIcon, CheckCheck, XCircle, Users } from "lucide-react";
import { format } from "date-fns";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { StatCard } from "@/components/StatCard";
import { AttendanceStatusBadge } from "@/components/StatusBadges";
import { useAttendance, useHydrated, useStudents } from "@/lib/hooks";
import { STANDARDS, type AttendanceStatus } from "@/lib/types";
import { uid } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { initials, studentAvatarStyle } from "@/lib/derive";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/attendance")({
  head: () => ({
    meta: [
      { title: "Attendance — Bright Minds Tuition" },
      { name: "description", content: "Mark daily attendance for students by class." },
    ],
  }),
  component: AttendancePage,
});

const STATUSES: AttendanceStatus[] = ["Present", "Absent", "Late", "Holiday"];

function AttendancePage() {
  const hydrated = useHydrated();
  const [students] = useStudents();
  const [attendance, setAttendanceState] = useAttendance();
  const [standard, setStandard] = useState<string>("all");
  const [date, setDate] = useState<Date>(new Date());
  const [remarks, setRemarks] = useState<Record<string, string>>({});

  const dateKey = format(date, "yyyy-MM-dd");
  const filtered = useMemo(
    () => (standard === "all" ? students : students.filter((s) => s.standard === standard)),
    [students, standard],
  );

  const todayRecords = useMemo(
    () => attendance.filter((r) => r.date === dateKey),
    [attendance, dateKey],
  );
  const statusFor = (sid: string): AttendanceStatus | null =>
    todayRecords.find((r) => r.studentId === sid)?.status ?? null;

  const setStatus = (sid: string, status: AttendanceStatus) => {
    const others = attendance.filter((r) => !(r.studentId === sid && r.date === dateKey));
    setAttendanceState([
      ...others,
      { id: uid(), studentId: sid, date: dateKey, status, remarks: remarks[sid] },
    ]);
  };

  const markAll = (status: AttendanceStatus) => {
    const others = attendance.filter(
      (r) => !(r.date === dateKey && filtered.some((s) => s.id === r.studentId)),
    );
    const newOnes = filtered.map((s) => ({
      id: uid(),
      studentId: s.id,
      date: dateKey,
      status,
      remarks: remarks[s.id],
    }));
    setAttendanceState([...others, ...newOnes]);
    toast.success(`Marked ${filtered.length} students as ${status}`);
  };

  const summary = useMemo(() => {
    const recs = todayRecords.filter((r) => filtered.some((s) => s.id === r.studentId));
    return {
      present: recs.filter((r) => r.status === "Present").length,
      absent: recs.filter((r) => r.status === "Absent").length,
      late: recs.filter((r) => r.status === "Late").length,
      total: filtered.length,
    };
  }, [todayRecords, filtered]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daily Attendance"
        description="Mark attendance for the selected date and standard."
        actions={
          <>
            <Button variant="outline" className="rounded-xl" onClick={() => markAll("Present")}>
              <CheckCheck className="mr-2 h-4 w-4" /> Mark All Present
            </Button>
            <Button variant="outline" className="rounded-xl" onClick={() => markAll("Absent")}>
              <XCircle className="mr-2 h-4 w-4" /> Mark All Absent
            </Button>
          </>
        }
      />

      <div className="glass flex flex-wrap items-center gap-3 rounded-2xl p-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("h-10 rounded-xl", !date && "text-muted-foreground")}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(date, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => d && setDate(d)}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>

        <Select value={standard} onValueChange={setStandard}>
          <SelectTrigger className="h-10 w-[160px] rounded-xl">
            <SelectValue placeholder="Standard" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Standards</SelectItem>
            {STANDARDS.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto text-sm text-muted-foreground">
          {filtered.length} students on {format(date, "PPP")}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total" value={summary.total} icon={<Users className="h-5 w-5" />} gradient />
        <StatCard label="Present" value={summary.present} icon={<CheckCheck className="h-5 w-5" />} />
        <StatCard label="Absent" value={summary.absent} icon={<XCircle className="h-5 w-5" />} />
        <StatCard label="Late" value={summary.late} icon={<CalendarIcon className="h-5 w-5" />} />
      </div>

      <div className="glass overflow-hidden rounded-2xl">
        {!hydrated && <div className="p-6 text-muted-foreground">Loading…</div>}
        {hydrated && filtered.length === 0 && (
          <div className="p-10 text-center text-muted-foreground">No students in this standard.</div>
        )}
        <ul className="divide-y divide-border/60">
          {filtered.map((s) => {
            const st = statusFor(s.id);
            return (
              <li key={s.id} className="grid grid-cols-1 gap-3 p-4 transition-colors hover:bg-accent/40 md:grid-cols-[minmax(0,1fr)_auto_auto]">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full text-xs font-bold text-white"
                    style={s.photo ? undefined : studentAvatarStyle(s)}
                  >
                    {s.photo ? <img src={s.photo} alt="" className="h-full w-full object-cover" /> : initials(s.name)}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.standard} - {s.section}</div>
                  </div>
                </div>
                <RadioGroup
                  className="flex flex-wrap items-center gap-2"
                  value={st ?? ""}
                  onValueChange={(v) => setStatus(s.id, v as AttendanceStatus)}
                >
                  {STATUSES.map((v) => (
                    <Label
                      key={v}
                      htmlFor={`${s.id}-${v}`}
                      className={cn(
                        "cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition",
                        st === v
                          ? v === "Present"
                            ? "border-transparent bg-emerald-500 text-white"
                            : v === "Absent"
                              ? "border-transparent bg-destructive text-destructive-foreground"
                              : v === "Late"
                                ? "border-transparent bg-amber-500 text-white"
                                : "border-transparent bg-blue-500 text-white"
                          : "border-border hover:bg-accent",
                      )}
                    >
                      <RadioGroupItem id={`${s.id}-${v}`} value={v} className="sr-only" />
                      {v}
                    </Label>
                  ))}
                </RadioGroup>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Remarks"
                    className="h-9 w-40 rounded-lg"
                    value={remarks[s.id] ?? ""}
                    onChange={(e) => setRemarks({ ...remarks, [s.id]: e.target.value })}
                  />
                  {st && <AttendanceStatusBadge status={st} />}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
