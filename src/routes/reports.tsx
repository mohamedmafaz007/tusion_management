import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Printer } from "lucide-react";
import { PageHeader } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatCard } from "@/components/StatCard";
import { useAttendance, useHydrated, useStudents } from "@/lib/hooks";
import { STANDARDS } from "@/lib/types";
import { CheckCheck, XCircle, TrendingUp, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { studentAttendancePct } from "@/lib/derive";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Attendance Reports — Bright Minds Tuition" },
      { name: "description", content: "Beautiful charts and analytics for attendance trends." },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  useHydrated();
  const [students] = useStudents();
  const [attendance] = useAttendance();
  const [range, setRange] = useState<"7" | "14" | "30">("14");
  const [scope, setScope] = useState<string>("all");

  const scoped = useMemo(
    () => (scope === "all" ? attendance : attendance.filter((r) => students.find((s) => s.id === r.studentId)?.standard === scope)),
    [attendance, students, scope],
  );

  const overall = useMemo(() => {
    const rs = scoped.filter((r) => r.status !== "Holiday");
    const present = rs.filter((r) => r.status === "Present" || r.status === "Late").length;
    const absent = rs.filter((r) => r.status === "Absent").length;
    const pct = rs.length ? Math.round((present / rs.length) * 100) : 0;
    return { present, absent, pct, total: rs.length };
  }, [scoped]);

  const trend = useMemo(() => {
    const days = Number(range);
    const out: { day: string; pct: number; present: number; absent: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().slice(0, 10);
      const rs = scoped.filter((r) => r.date === ds && r.status !== "Holiday");
      const present = rs.filter((r) => r.status === "Present" || r.status === "Late").length;
      const absent = rs.filter((r) => r.status === "Absent").length;
      out.push({
        day: d.toLocaleDateString("en", { day: "2-digit", month: "short" }),
        pct: rs.length ? Math.round((present / rs.length) * 100) : 0,
        present,
        absent,
      });
    }
    return out;
  }, [scoped, range]);

  const pieData = useMemo(() => {
    const rs = scoped;
    return [
      { name: "Present", value: rs.filter((r) => r.status === "Present").length, color: "oklch(0.65 0.18 150)" },
      { name: "Late", value: rs.filter((r) => r.status === "Late").length, color: "oklch(0.75 0.18 85)" },
      { name: "Absent", value: rs.filter((r) => r.status === "Absent").length, color: "oklch(0.6 0.24 25)" },
      { name: "Holiday", value: rs.filter((r) => r.status === "Holiday").length, color: "oklch(0.62 0.19 260)" },
    ];
  }, [scoped]);

  const stdWise = useMemo(
    () =>
      STANDARDS.map((s) => {
        const ids = students.filter((st) => st.standard === s).map((st) => st.id);
        const rs = attendance.filter((r) => ids.includes(r.studentId) && r.status !== "Holiday");
        const present = rs.filter((r) => r.status === "Present" || r.status === "Late").length;
        return { standard: s, pct: rs.length ? Math.round((present / rs.length) * 100) : 0 };
      }),
    [students, attendance],
  );

  const studentWise = useMemo(
    () =>
      students
        .map((s) => ({ name: s.name, pct: studentAttendancePct(s.id, attendance), standard: s.standard }))
        .sort((a, b) => b.pct - a.pct)
        .slice(0, 10),
    [students, attendance],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Reports"
        description="Analytics across dates, standards, and individual students."
        actions={
          <>
            <Button variant="outline" className="rounded-xl" onClick={() => { toast.success("PDF export queued (UI demo)"); }}>
              <Download className="mr-2 h-4 w-4" /> Export PDF
            </Button>
            <Button variant="outline" className="rounded-xl" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
          </>
        }
      />

      <div className="glass flex flex-wrap gap-3 rounded-2xl p-4">
        <Select value={range} onValueChange={(v) => setRange(v as any)}>
          <SelectTrigger className="h-10 w-[160px] rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="14">Last 14 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
        <Select value={scope} onValueChange={setScope}>
          <SelectTrigger className="h-10 w-[160px] rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Standards</SelectItem>
            {STANDARDS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Overall Attendance" value={`${overall.pct}%`} icon={<TrendingUp className="h-5 w-5" />} gradient />
        <StatCard label="Total Present" value={overall.present} icon={<CheckCheck className="h-5 w-5" />} />
        <StatCard label="Total Absent" value={overall.absent} icon={<XCircle className="h-5 w-5" />} />
        <StatCard label="Records" value={overall.total} icon={<Users className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <h3 className="mb-4 font-semibold">Attendance Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <defs>
                  <linearGradient id="rLine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="oklch(0.62 0.19 260)" />
                    <stop offset="100%" stopColor="oklch(0.58 0.24 300)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12 }} />
                <Line dataKey="pct" stroke="url(#rLine)" strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="mb-4 font-semibold">Status Breakdown</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={4}>
                  {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <h3 className="mb-4 font-semibold">Standard-wise Attendance %</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stdWise}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="standard" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12 }} />
                <Bar dataKey="pct" fill="oklch(0.62 0.19 260)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="mb-4 font-semibold">Top 10 Students by Attendance</h3>
          <ul className="space-y-2">
            {studentWise.map((s, i) => (
              <li key={s.name} className="flex items-center gap-3 rounded-xl p-2 hover:bg-accent/50">
                <div className="grid h-8 w-8 place-items-center rounded-lg gradient-brand text-xs font-bold text-white">
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.standard}</div>
                </div>
                <div className="text-sm font-bold text-primary">{s.pct}%</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
