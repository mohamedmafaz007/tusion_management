import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Download, Printer, CheckCheck, XCircle, TrendingUp, Users, 
  FileSpreadsheet, BarChart3, HelpCircle, Calendar, DollarSign
} from "lucide-react";
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
import { useAttendance, useFees, useHydrated, useStudents } from "@/lib/hooks";
import { STANDARDS } from "@/lib/types";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Attendance & Fees Reports — Vishwa Tuition Center" },
      { name: "description", content: "Query, preview, and download attendance and fees reports by year, month, and day." },
    ],
  }),
  component: ReportsPage,
});

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function ReportsPage() {
  const hydrated = useHydrated();
  const [students] = useStudents();
  const [attendance] = useAttendance();
  const [fees] = useFees();

  // Tab State
  const [activeTab, setActiveTab] = useState<"export" | "charts">("export");

  // Chart States
  const [range, setRange] = useState<"7" | "14" | "30">("14");
  const [scope, setScope] = useState<string>("all");

  // Export Center States
  const [reportType, setReportType] = useState<"attendance" | "fees">("attendance");
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString().padStart(2, "0"));
  const [selectedDay, setSelectedDay] = useState<string>("all");
  const [selectedStandard, setSelectedStandard] = useState<string>("all");

  // Time options for selectors
  const years = ["2026", "2025", "2024"];
  
  const months = useMemo(() => [
    { value: "all", label: "All Months" },
    ...MONTH_NAMES.map((name, i) => ({
      value: String(i + 1).padStart(2, "0"),
      label: name,
    })),
  ], []);

  const days = useMemo(() => [
    { value: "all", label: "All Days" },
    ...Array.from({ length: 31 }, (_, i) => ({
      value: String(i + 1).padStart(2, "0"),
      label: String(i + 1),
    })),
  ], []);

  // Filtered attendance data
  const filteredAttendance = useMemo(() => {
    return attendance.filter((r) => {
      const s = students.find((st) => st.id === r.studentId);
      if (!s) return false;

      if (selectedStandard !== "all" && s.standard !== selectedStandard) return false;

      const [year, month, day] = r.date.split("-");
      if (year !== selectedYear) return false;
      if (selectedMonth !== "all" && month !== selectedMonth) return false;
      if (selectedDay !== "all" && day !== selectedDay.padStart(2, "0")) return false;

      return true;
    });
  }, [attendance, students, selectedYear, selectedMonth, selectedDay, selectedStandard]);

  // Filtered fees data
  const filteredFees = useMemo(() => {
    return fees.filter((f) => {
      const s = students.find((st) => st.id === f.studentId);
      if (!s) return false;

      if (selectedStandard !== "all" && s.standard !== selectedStandard) return false;

      const [year, month] = f.month.split("-");
      if (year !== selectedYear) return false;
      if (selectedMonth !== "all" && month !== selectedMonth) return false;

      if (selectedDay !== "all") {
        if (!f.paidDate) return false;
        const [, , day] = f.paidDate.split("-");
        if (day !== selectedDay.padStart(2, "0")) return false;
      }

      return true;
    });
  }, [fees, students, selectedYear, selectedMonth, selectedDay, selectedStandard]);

  // Chart analytics calculations
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

  // Exporters
  const downloadAttendanceReport = () => {
    const headers = ["Student Name", "Standard", "Section", "Date (DD/MM/YYYY)", "Status", "Remarks"];
    const rows = filteredAttendance.map((r) => {
      const s = students.find((st) => st.id === r.studentId);
      const studentName = s ? s.name : "Unknown";
      const standard = s ? s.standard : "—";
      const section = s ? s.section : "—";
      const dateFormatted = r.date.split("-").reverse().join("/");
      return [studentName, standard, section, dateFormatted, r.status, r.remarks || "—"];
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
    link.setAttribute("download", `Attendance_Report_${selectedYear}_${selectedMonth}_${selectedDay}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Attendance report downloaded successfully!");
  };

  const downloadFeesReport = () => {
    const headers = [
      "Student Name",
      "Standard",
      "Section",
      "Fee Month",
      "Fee Amount",
      "Status",
      "Paid Amount",
      "Payment Date (Full)",
      "Paid Day",
      "Paid Month",
      "Paid Year"
    ];
    const rows = filteredFees.map((f) => {
      const s = students.find((st) => st.id === f.studentId);
      const studentName = s ? s.name : "Unknown";
      const standard = s ? s.standard : "—";
      const section = s ? s.section : "—";
      
      let paidDay = "—";
      let paidMonth = "—";
      let paidYear = "—";
      let fullPaidDate = "—";

      if (f.paidDate) {
        const parts = f.paidDate.split("-");
        paidDay = parseInt(parts[2], 10).toString();
        paidMonth = MONTH_NAMES[parseInt(parts[1], 10) - 1];
        paidYear = parts[0];
        fullPaidDate = parts.reverse().join("/");
      }

      return [
        studentName,
        standard,
        section,
        f.month,
        f.amount,
        f.status,
        f.paidAmount,
        fullPaidDate,
        paidDay,
        paidMonth,
        paidYear
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
    link.setAttribute("download", `Fees_Report_${selectedYear}_${selectedMonth}_${selectedDay}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Fees report downloaded successfully!");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institute Reports"
        description="Search, view, and export student reports for attendance and fee collection."
      />

      {/* Tabs */}
      <div className="flex border-b border-border/60">
        <button
          onClick={() => setActiveTab("export")}
          className={cn(
            "flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold transition-all",
            activeTab === "export"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <FileSpreadsheet className="h-4.5 w-4.5" /> Export Reports Center
        </button>
        <button
          onClick={() => setActiveTab("charts")}
          className={cn(
            "flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold transition-all",
            activeTab === "charts"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <BarChart3 className="h-4.5 w-4.5" /> Visual Analytics
        </button>
      </div>

      {!hydrated ? (
        <div className="glass rounded-2xl p-12 text-center text-muted-foreground">Loading report workspace...</div>
      ) : activeTab === "export" ? (
        <div className="space-y-6">
          {/* Query Filter Area */}
          <div className="glass rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Select Filter Criteria</h3>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Report Type</label>
                <Select value={reportType} onValueChange={(v: any) => setReportType(v)}>
                  <SelectTrigger className="h-10 rounded-xl bg-card border-border/60"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="attendance">Attendance Records</SelectItem>
                    <SelectItem value="fees">Fees Collections</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Standard</label>
                <Select value={selectedStandard} onValueChange={setSelectedStandard}>
                  <SelectTrigger className="h-10 rounded-xl bg-card border-border/60"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Standards</SelectItem>
                    {STANDARDS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Year</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="h-10 rounded-xl bg-card border-border/60"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {years.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Month</label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="h-10 rounded-xl bg-card border-border/60"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {months.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Day / Date</label>
                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger className="h-10 rounded-xl bg-card border-border/60"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {days.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border/60 pt-4 flex-wrap gap-3">
              <div className="text-xs font-semibold text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-xl border border-border/60">
                Found {reportType === "attendance" ? filteredAttendance.length : filteredFees.length} matching records
              </div>
              <Button
                onClick={reportType === "attendance" ? downloadAttendanceReport : downloadFeesReport}
                disabled={reportType === "attendance" ? filteredAttendance.length === 0 : filteredFees.length === 0}
                className="rounded-xl gradient-brand shadow-glow"
              >
                <Download className="mr-2 h-4 w-4" /> Download Report (CSV)
              </Button>
            </div>
          </div>

          {/* Preview Table Container */}
          <div className="glass rounded-2xl overflow-hidden border border-border/60">
            <div className="border-b border-border/60 bg-secondary/40 px-5 py-3">
              <h3 className="font-semibold text-sm">Data Preview Table</h3>
            </div>
            
            <div className="overflow-x-auto max-h-[500px]">
              {reportType === "attendance" ? (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/25 hover:bg-secondary/25">
                      <TableHead>Student Name</TableHead>
                      <TableHead>Standard</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Attendance Status</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAttendance.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                          No matching attendance records found. Adjust your time filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAttendance.map((r) => {
                        const s = students.find((st) => st.id === r.studentId);
                        return (
                          <TableRow key={r.id}>
                            <TableCell className="font-semibold">{s ? s.name : "Unknown"}</TableCell>
                            <TableCell>{s ? s.standard : "—"}</TableCell>
                            <TableCell>{s ? s.section : "—"}</TableCell>
                            <TableCell className="font-mono text-xs">{r.date.split("-").reverse().join("/")}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  r.status === "Present" ? "default" :
                                  r.status === "Late" ? "secondary" :
                                  r.status === "Absent" ? "destructive" : "outline"
                                }
                                className={cn(
                                  r.status === "Present" && "bg-emerald-500 hover:bg-emerald-600 text-white shadow-glow",
                                  r.status === "Late" && "bg-amber-500 hover:bg-amber-600 text-white shadow-glow"
                                )}
                              >
                                {r.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">{r.remarks || "—"}</TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/25 hover:bg-secondary/25">
                      <TableHead>Student Name</TableHead>
                      <TableHead>Standard</TableHead>
                      <TableHead>Fee Month</TableHead>
                      <TableHead>Monthly Fee</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Paid Amount</TableHead>
                      <TableHead>Full Paid Date</TableHead>
                      <TableHead>Paid Day</TableHead>
                      <TableHead>Paid Month</TableHead>
                      <TableHead>Paid Year</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFees.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="py-12 text-center text-muted-foreground">
                          No matching fee records found. Adjust your time filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredFees.map((f) => {
                        const s = students.find((st) => st.id === f.studentId);
                        let day = "—";
                        let monthStr = "—";
                        let year = "—";
                        let fullDate = "—";

                        if (f.paidDate) {
                          const parts = f.paidDate.split("-");
                          day = parseInt(parts[2], 10).toString();
                          monthStr = MONTH_NAMES[parseInt(parts[1], 10) - 1];
                          year = parts[0];
                          fullDate = parts.reverse().join("/");
                        }

                        return (
                          <TableRow key={f.id}>
                            <TableCell className="font-semibold">{s ? s.name : "Unknown"}</TableCell>
                            <TableCell>{s ? s.standard : "—"}</TableCell>
                            <TableCell className="font-mono text-xs">{f.month}</TableCell>
                            <TableCell className="font-semibold">₹{f.amount.toLocaleString("en-IN")}</TableCell>
                            <TableCell>
                              <Badge
                                variant={f.status === "Paid" ? "default" : "destructive"}
                                className={cn(f.status === "Paid" && "bg-emerald-500 hover:bg-emerald-600 text-white shadow-glow")}
                              >
                                {f.status}
                              </Badge>
                            </TableCell>
                            <TableCell>₹{f.paidAmount.toLocaleString("en-IN")}</TableCell>
                            <TableCell className="font-mono text-xs">{fullDate}</TableCell>
                            <TableCell className="font-mono text-xs">{day}</TableCell>
                            <TableCell className="text-xs">{monthStr}</TableCell>
                            <TableCell className="font-mono text-xs">{year}</TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Visual Analytics tab (previous graphics page content) */
        <div className="space-y-6">
          <div className="glass flex flex-wrap gap-3 rounded-2xl p-4">
            <Select value={range} onValueChange={(v) => setRange(v as any)}>
              <SelectTrigger className="h-10 w-[160px] rounded-xl bg-card border-border/60"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="14">Last 14 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
            <Select value={scope} onValueChange={setScope}>
              <SelectTrigger className="h-10 w-[160px] rounded-xl bg-card border-border/60"><SelectValue /></SelectTrigger>
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
      )}
    </div>
  );
}

