import { useMemo, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Wallet,
  TrendingUp,
  BookOpen,
  UserPlus,
  CalendarCheck,
  BarChart3,
  ArrowRight,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/layout/AppShell";
import { StatCard } from "@/components/StatCard";
import { useAttendance, useFees, useHydrated, useStudents } from "@/lib/hooks";
import { currentMonthKey, formatCurrency, initials, studentAvatarStyle, todayKey } from "@/lib/derive";
import { STANDARDS } from "@/lib/types";
import { createFileRoute, Link } from "@tanstack/react-router";
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
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Vishwa Tuition Center" },
      { name: "description", content: "Overview of students, attendance, and fee collection." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const hydrated = useHydrated();
  const [students] = useStudents();
  const [attendance] = useAttendance();
  const [fees] = useFees();

  const availableMonths = useMemo(() => {
    const months = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
      months.push({ value: val, label });
    }
    return months;
  }, []);

  const [reportMonth, setReportMonth] = useState(availableMonths[0].value);

  const downloadMonthlyReport = () => {
    const headers = [
      "Student Name",
      "Standard",
      "Section",
      "Gender",
      "Parent Name",
      "Father Mobile",
      "Mother Mobile",
      "Monthly Fee",
      `Fee Status (${reportMonth})`,
      `Paid Amount (${reportMonth})`,
      `Payment Date (${reportMonth})`,
      `Present Days (${reportMonth})`,
      `Absent Days (${reportMonth})`,
      `Late Days (${reportMonth})`,
      `Attendance % (${reportMonth})`
    ];

    const rows = students.map((s) => {
      const sFee = fees.find((f) => f.studentId === s.id && f.month === reportMonth);
      const feeStatus = sFee ? sFee.status : "Pending";
      const paidAmount = sFee ? sFee.paidAmount : 0;
      const paidDate = sFee && sFee.paidDate ? sFee.paidDate : "—";

      const mRecs = attendance.filter(
        (r) => r.studentId === s.id && r.date.startsWith(reportMonth) && r.status !== "Holiday"
      );

      const uniqueDates = new Map<string, typeof mRecs[0]>();
      for (const r of mRecs) {
        uniqueDates.set(r.date, r);
      }
      const uniqueMRecs = Array.from(uniqueDates.values());

      const totalDays = uniqueMRecs.length;
      const present = uniqueMRecs.filter((r) => r.status === "Present").length;
      const absent = uniqueMRecs.filter((r) => r.status === "Absent").length;
      const late = uniqueMRecs.filter((r) => r.status === "Late").length;
      
      const totalPresent = present + late;
      const attPct = totalDays ? Math.round((totalPresent / totalDays) * 100) : 100;

      return [
        s.name,
        s.standard,
        s.section || "—",
        s.gender || "—",
        s.parentName || "—",
        s.fatherMobile || "—",
        s.motherMobile || "—",
        s.monthlyFees,
        feeStatus,
        paidAmount,
        paidDate,
        present,
        absent,
        late,
        `${attPct}%`
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((val) => {
            const strVal = String(val === undefined || val === null ? "" : val);
            if (strVal.includes(",") || strVal.includes('"') || strVal.includes("\n")) {
              return `"${strVal.replace(/"/g, '""')}"`;
            }
            return strVal;
          })
          .join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Monthly_Report_${reportMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = useMemo(() => {
    const today = todayKey();
    const todayRecs = attendance.filter((r) => r.date === today);
    const present = todayRecs.filter((r) => r.status === "Present" || r.status === "Late").length;
    const absent = todayRecs.filter((r) => r.status === "Absent").length;

    const cm = currentMonthKey();
    const activeStudentIds = new Set(students.map((s) => s.id));
    const monthFees = fees.filter((f) => f.month === cm && activeStudentIds.has(f.studentId));
    const collected = monthFees.reduce((s, f) => s + f.paidAmount, 0);

    const unpaidStudents = students.filter(
      (s) => s.joiningDate.slice(0, 7) <= cm && !fees.some((f) => f.studentId === s.id && f.month === cm)
    );
    const pending = monthFees.reduce((s, f) => s + (f.amount - f.paidAmount), 0) +
      unpaidStudents.reduce((s, st) => s + st.monthlyFees, 0);

    const total = attendance.length;
    const presentAll = attendance.filter((r) => r.status === "Present" || r.status === "Late").length;
    const attPct = total ? Math.round((presentAll / total) * 100) : 0;

    return { present, absent, collected, pending, attPct };
  }, [attendance, fees, students]);

  const stdCounts = useMemo(
    () =>
      STANDARDS.map((s) => ({
        standard: s,
        count: students.filter((st) => st.standard === s).length,
      })),
    [students],
  );

  const trend = useMemo(() => {
    const days = 7;
    const out: { day: string; pct: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().slice(0, 10);
      const rs = attendance.filter((r) => r.date === ds && r.status !== "Holiday");
      const present = rs.filter((r) => r.status === "Present" || r.status === "Late").length;
      out.push({
        day: d.toLocaleDateString("en", { weekday: "short" }),
        pct: rs.length ? Math.round((present / rs.length) * 100) : 0,
      });
    }
    return out;
  }, [attendance]);

  const feeTrend = useMemo(() => {
    const out: { month: string; collected: number; pending: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const rs = fees.filter((f) => f.month === key);
      out.push({
        month: d.toLocaleDateString("en", { month: "short" }),
        collected: rs.reduce((s, f) => s + f.paidAmount, 0),
        pending: rs.reduce((s, f) => s + (f.amount - f.paidAmount), 0),
      });
    }
    return out;
  }, [fees]);

  const pieData = useMemo(() => {
    const today = todayKey();
    const rs = attendance.filter((r) => r.date === today);
    const p = rs.filter((r) => r.status === "Present").length;
    const a = rs.filter((r) => r.status === "Absent").length;
    const l = rs.filter((r) => r.status === "Late").length;
    return [
      { name: "Present", value: p, color: "oklch(0.65 0.18 150)" },
      { name: "Absent", value: a, color: "oklch(0.6 0.24 25)" },
      { name: "Late", value: l, color: "oklch(0.75 0.18 85)" },
    ];
  }, [attendance]);

  const recent = useMemo(
    () =>
      [...students]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [students],
  );

  if (!hydrated) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="A quick overview of your institute today."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Select value={reportMonth} onValueChange={setReportMonth}>
              <SelectTrigger className="w-[170px] h-10 rounded-xl bg-card border-border/60">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                {availableMonths.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={downloadMonthlyReport} className="rounded-xl gradient-brand shadow-glow">
              <Download className="mr-2 h-4 w-4" /> Download Report
            </Button>
          </div>
        }
      />

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Students" value={students.length} icon={<Users className="h-5 w-5" />} gradient />
        <StatCard label="Present Today" value={stats.present} icon={<UserCheck className="h-5 w-5" />} trend={{ value: "+8%", positive: true }} />
        <StatCard label="Absent Today" value={stats.absent} icon={<UserX className="h-5 w-5" />} trend={{ value: "-2", positive: true }} />
        <StatCard label="Attendance %" value={`${stats.attPct}%`} icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard label="Monthly Collection" value={formatCurrency(stats.collected)} icon={<Wallet className="h-5 w-5" />} />
        <StatCard label="Pending Fees" value={formatCurrency(stats.pending)} icon={<Wallet className="h-5 w-5" />} />
        <StatCard label="Total Standards" value={STANDARDS.length} icon={<BookOpen className="h-5 w-5" />} />
        <StatCard label="Recent Joinings" value={recent.length} icon={<UserPlus className="h-5 w-5" />} hint="Last additions" />
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Attendance Trend</h3>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="oklch(0.62 0.19 260)" />
                    <stop offset="100%" stopColor="oklch(0.58 0.24 300)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)" }} />
                <Line type="monotone" dataKey="pct" stroke="url(#lineGrad)" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="font-semibold">Today's Attendance</h3>
          <p className="text-xs text-muted-foreground">Breakdown of statuses</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={4}>
                  {pieData.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <h3 className="font-semibold">Standard-wise Students</h3>
          <p className="mb-4 text-xs text-muted-foreground">Distribution across classes</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stdCounts}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.58 0.24 300)" />
                    <stop offset="100%" stopColor="oklch(0.62 0.19 260)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="standard" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)" }} />
                <Bar dataKey="count" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="font-semibold">Fee Collection Trend</h3>
          <p className="mb-4 text-xs text-muted-foreground">Last 6 months</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={feeTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)" }} />
                <Bar dataKey="collected" fill="oklch(0.62 0.19 260)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="pending" fill="oklch(0.6 0.24 25)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent + Quick actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Recent Registrations</h3>
            <Link to="/students" className="text-xs font-semibold text-primary hover:underline">
              View all
            </Link>
          </div>
          <ul className="space-y-3">
            {recent.length === 0 && <li className="text-sm text-muted-foreground">No students yet.</li>}
            {recent.map((s) => (
              <li key={s.id} className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-accent/50">
                <div
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xs font-bold text-white"
                  style={s.photo ? undefined : studentAvatarStyle(s)}
                >
                  {s.photo ? (
                    <img src={s.photo} alt={s.name} className="h-full w-full rounded-xl object-cover" />
                  ) : (
                    initials(s.name)
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{s.name}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {s.standard} • {s.school}
                  </div>
                </div>
                <Link
                  to="/students/$id"
                  params={{ id: s.id }}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10"
                >
                  View
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">Quick Actions</h3>
          {[
            { to: "/students/new", label: "Register Student", icon: UserPlus, desc: "Add a new admission" },
            { to: "/attendance", label: "Mark Attendance", icon: CalendarCheck, desc: "Today's attendance" },
            { to: "/fees", label: "Collect Fees", icon: Wallet, desc: "Record fee payments" },
            { to: "/reports", label: "View Reports", icon: BarChart3, desc: "Attendance analytics" },
          ].map((q) => (
            <Link
              key={q.to}
              to={q.to}
              className="glass group flex items-center gap-3 rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-glow"
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl gradient-brand text-white shadow-glow">
                <q.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{q.label}</div>
                <div className="text-xs text-muted-foreground">{q.desc}</div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
