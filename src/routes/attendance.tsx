import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarIcon, CheckCheck, XCircle, Users, Send, Loader2 } from "lucide-react";
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
import { useAttendance, useHydrated, useStudents, useSettings } from "@/lib/hooks";
import { STANDARDS, type AttendanceStatus } from "@/lib/types";
import { uid } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { initials, studentAvatarStyle } from "@/lib/derive";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { sendWhatsAppAlert, sendBulkAttendanceAlerts } from "@/lib/db";

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export const Route = createFileRoute("/attendance")({
  head: () => ({
    meta: [
      { title: "Attendance — Vishwa Tuition Center" },
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
  const [settings] = useSettings();
  const [standard, setStandard] = useState<string>("all");
  const [date, setDate] = useState<Date>(new Date());
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const [isSendingAlerts, setIsSendingAlerts] = useState(false);

  const dateKey = format(date, "yyyy-MM-dd");

  const handleSaveAndSendBulkAlerts = async () => {
    const provider = settings.whatsappProvider || "manual";
    if (provider === "manual") {
      toast.warning("WhatsApp Provider is set to Manual. Please select Twilio, UltraMsg, or Baileys in Settings to send automated notifications.");
      return;
    }

    setIsSendingAlerts(true);
    const loadingToast = toast.loading(`Sending automated bulk attendance alerts to parents...`);
    try {
      const res = await sendBulkAttendanceAlerts({ 
        data: {
          date: dateKey, 
          standard 
        }
      });

      if (res.success) {
        toast.success(`Success! Sent ${res.sent} attendance alerts (${res.failed} failed)`, { id: loadingToast });
      } else {
        toast.error("Failed to send bulk alerts.", { id: loadingToast });
      }
    } catch (err: any) {
      toast.error(`Error: ${err.message || err}`, { id: loadingToast });
    } finally {
      setIsSendingAlerts(false);
    }
  };
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

  const handleSendWhatsApp = async (s: typeof students[0], status: AttendanceStatus) => {
    const template = status === "Present"
      ? settings.whatsappTemplatePresent
      : settings.whatsappTemplateAbsent;
      
    // Format the date/time on frontend
    const formattedDate = dateKey.split("-").reverse().join("/"); // YYYY-MM-DD -> DD/MM/YYYY
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedTime = `${hours}:${minutes} ${ampm}`;

    const messageText = (template || `Dear Parent, your child [student_name] was marked [status] today on [date] at [time].`)
      .replace("[student_name]", s.name)
      .replace("[status]", status)
      .replace("[date]", formattedDate)
      .replace("[time]", formattedTime);

    const parentMobile = s.fatherMobile || s.motherMobile;
    if (!parentMobile) {
      toast.error("No registered parent mobile number found for this student.");
      return;
    }

    const provider = settings.whatsappProvider || "manual";

    if (provider === "manual") {
      let phone = parentMobile.replace(/[\s\-\(\)\+]/g, "");
      if (phone.length === 10) phone = "91" + phone;
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(messageText)}`;
      window.open(url, "_blank");
      toast.success("Opening WhatsApp chat link...");
    } else {
      const loadingToast = toast.loading(`Sending automated WhatsApp alert to ${s.name}'s parent...`);
      try {
        const res = await sendWhatsAppAlert({
          data: {
            recipientPhone: parentMobile,
            studentName: s.name,
            status: status,
            date: dateKey // Pass the date of attendance to the server
          }
        });
        if (res.success) {
          toast.success(`WhatsApp alert sent successfully!`, { id: loadingToast });
        } else {
          toast.error("Failed to send WhatsApp alert.", { id: loadingToast });
        }
      } catch (err: any) {
        toast.error(`Error: ${err.message || err}`, { id: loadingToast });
      }
    }
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
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => markAll("Present")}>
              <CheckCheck className="mr-2 h-4 w-4" /> Mark All Present
            </Button>
            <Button variant="outline" className="rounded-xl" onClick={() => markAll("Absent")}>
              <XCircle className="mr-2 h-4 w-4" /> Mark All Absent
            </Button>
            <Button 
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-glow" 
              onClick={handleSaveAndSendBulkAlerts}
              disabled={isSendingAlerts || filtered.length === 0}
            >
              {isSendingAlerts ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> Save & Send Alerts
                </>
              )}
            </Button>
          </div>
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
                  
                  {st && (st === "Present" || st === "Absent") && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleSendWhatsApp(s, st)}
                      className="h-9 w-9 shrink-0 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                      title="Send WhatsApp Alert to Parent"
                    >
                      <WhatsAppIcon className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
