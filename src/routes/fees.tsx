import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Wallet, CheckCircle, Clock, Printer, Receipt, History } from "lucide-react";
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
import { StatCard } from "@/components/StatCard";
import { FeeStatusBadge } from "@/components/StatusBadges";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFees, useHydrated, useStudents, useSettings } from "@/lib/hooks";
import { uid } from "@/lib/storage";
import { currentMonthKey, formatCurrency, initials, studentAvatarStyle } from "@/lib/derive";
import { STANDARDS } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/fees")({
  head: () => ({
    meta: [
      { title: "Fees — Bright Minds Tuition" },
      { name: "description", content: "Track fee payments, generate receipts, and view fee history." },
    ],
  }),
  component: FeesPage,
});

function FeesPage() {
  useHydrated();
  const [students] = useStudents();
  const [fees, setFeesState] = useFees();
  const [settings] = useSettings();
  const [q, setQ] = useState("");
  const [month, setMonth] = useState(currentMonthKey());
  const [standard, setStandard] = useState("all");
  const [historyOf, setHistoryOf] = useState<string | null>(null);
  const [receiptOf, setReceiptOf] = useState<{ studentId: string; feeId: string } | null>(null);

  const months = useMemo(() => {
    const set = new Set<string>();
    fees.forEach((f) => set.add(f.month));
    set.add(currentMonthKey());
    return Array.from(set).sort().reverse();
  }, [fees]);

  const rows = useMemo(() => {
    return students
      .filter((s) => (standard === "all" || s.standard === standard) && (!q || s.name.toLowerCase().includes(q.toLowerCase())))
      .map((s) => {
        const fee =
          fees.find((f) => f.studentId === s.id && f.month === month) ??
          ({
            id: "temp-" + s.id,
            studentId: s.id,
            month,
            amount: s.monthlyFees,
            paidAmount: 0,
            status: "Pending" as const,
          });
        return { student: s, fee };
      });
  }, [students, fees, q, month, standard]);

  const totals = useMemo(() => {
    const monthFees = fees.filter((f) => f.month === month);
    const total = monthFees.reduce((s, f) => s + f.amount, 0) + students
      .filter((s) => !fees.some((f) => f.studentId === s.id && f.month === month))
      .reduce((s, st) => s + st.monthlyFees, 0);
    const paid = monthFees.reduce((s, f) => s + f.paidAmount, 0);
    return { total, paid, pending: total - paid };
  }, [fees, students, month]);

  const markPaid = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;
    const existing = fees.find((f) => f.studentId === studentId && f.month === month);
    const paidDate = new Date().toISOString().slice(0, 10);
    if (existing) {
      setFeesState(
        fees.map((f) =>
          f.id === existing.id ? { ...f, paidAmount: f.amount, status: "Paid", paidDate } : f,
        ),
      );
    } else {
      setFeesState([
        ...fees,
        {
          id: uid(),
          studentId,
          month,
          amount: student.monthlyFees,
          paidAmount: student.monthlyFees,
          paidDate,
          status: "Paid",
        },
      ]);
    }
    toast.success(`Payment recorded for ${student.name}`);
  };

  const receiptData = useMemo(() => {
    if (!receiptOf) return null;
    const s = students.find((st) => st.id === receiptOf.studentId);
    const f = fees.find((ff) => ff.id === receiptOf.feeId);
    return s && f ? { s, f } : null;
  }, [receiptOf, students, fees]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fees Management"
        description="Track collections, mark payments and generate receipts."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Fees" value={formatCurrency(totals.total)} icon={<Wallet className="h-5 w-5" />} gradient />
        <StatCard label="Paid" value={formatCurrency(totals.paid)} icon={<CheckCircle className="h-5 w-5" />} />
        <StatCard label="Pending" value={formatCurrency(totals.pending)} icon={<Clock className="h-5 w-5" />} />
      </div>

      <div className="glass flex flex-wrap gap-3 rounded-2xl p-4">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search student…" value={q} onChange={(e) => setQ(e.target.value)} className="h-10 rounded-xl pl-9" />
        </div>
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className="h-10 w-[160px] rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            {months.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={standard} onValueChange={setStandard}>
          <SelectTrigger className="h-10 w-[140px] rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Standards</SelectItem>
            {STANDARDS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="glass overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/40 hover:bg-secondary/40">
                <TableHead>Student</TableHead>
                <TableHead>Standard</TableHead>
                <TableHead>Monthly Fee</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Pending</TableHead>
                <TableHead>Paid Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && (
                <TableRow><TableCell colSpan={8} className="py-10 text-center text-muted-foreground">No students found.</TableCell></TableRow>
              )}
              {rows.map(({ student: s, fee: f }) => (
                <TableRow key={s.id} className="hover:bg-accent/40">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center overflow-hidden rounded-full text-xs font-bold text-white"
                        style={s.photo ? undefined : studentAvatarStyle(s)}>
                        {s.photo ? <img src={s.photo} alt="" className="h-full w-full object-cover" /> : initials(s.name)}
                      </div>
                      <span className="font-medium">{s.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{s.standard}</TableCell>
                  <TableCell>{formatCurrency(f.amount)}</TableCell>
                  <TableCell className="text-emerald-600">{formatCurrency(f.paidAmount)}</TableCell>
                  <TableCell className="text-destructive">{formatCurrency(f.amount - f.paidAmount)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{f.paidDate ?? "—"}</TableCell>
                  <TableCell><FeeStatusBadge status={f.status} /></TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-lg"
                        disabled={f.status === "Paid"}
                        onClick={() => markPaid(s.id)}
                      >
                        <CheckCircle className="mr-1 h-3.5 w-3.5" /> Mark Paid
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => f.id.startsWith("temp-") ? toast.error("No payment yet") : setReceiptOf({ studentId: s.id, feeId: f.id })}
                      >
                        <Receipt className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setHistoryOf(s.id)}>
                        <History className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* History dialog */}
      <Dialog open={!!historyOf} onOpenChange={(o) => !o && setHistoryOf(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fee History</DialogTitle>
            <DialogDescription>{students.find((s) => s.id === historyOf)?.name}</DialogDescription>
          </DialogHeader>
          <div className="max-h-[400px] space-y-2 overflow-auto">
            {fees.filter((f) => f.studentId === historyOf).sort((a, b) => b.month.localeCompare(a.month)).map((f) => (
              <div key={f.id} className="flex items-center justify-between rounded-xl border border-border/60 bg-secondary/40 p-3">
                <div>
                  <div className="font-medium">{f.month}</div>
                  <div className="text-xs text-muted-foreground">Paid {formatCurrency(f.paidAmount)} of {formatCurrency(f.amount)}</div>
                </div>
                <FeeStatusBadge status={f.status} />
              </div>
            ))}
            {fees.filter((f) => f.studentId === historyOf).length === 0 && (
              <p className="text-sm text-muted-foreground">No history yet.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Receipt dialog */}
      <Dialog open={!!receiptData} onOpenChange={(o) => !o && setReceiptOf(null)}>
        <DialogContent className="max-w-md print:shadow-none">
          <DialogHeader>
            <DialogTitle>Fee Receipt</DialogTitle>
          </DialogHeader>
          {receiptData && (
            <div className="rounded-xl border border-border/60 p-5 text-sm">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold gradient-text">{settings.instituteName}</div>
                  <div className="text-xs text-muted-foreground">{settings.address}</div>
                </div>
                <Wallet className="h-8 w-8 text-primary" />
              </div>
              <div className="my-3 border-t border-dashed border-border/60" />
              <dl className="space-y-1.5">
                <Row k="Student" v={receiptData.s.name} />
                <Row k="Standard" v={`${receiptData.s.standard} - ${receiptData.s.section}`} />
                <Row k="Month" v={receiptData.f.month} />
                <Row k="Amount" v={formatCurrency(receiptData.f.amount)} />
                <Row k="Paid" v={formatCurrency(receiptData.f.paidAmount)} />
                <Row k="Date" v={receiptData.f.paidDate ?? "—"} />
                <Row k="Receipt #" v={receiptData.f.id.slice(0, 8).toUpperCase()} />
              </dl>
              <div className="my-3 border-t border-dashed border-border/60" />
              <div className="text-center text-xs text-muted-foreground">Thank you for your payment.</div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReceiptOf(null)}>Close</Button>
            <Button className="gradient-brand" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-medium">{v}</dd>
    </div>
  );
}
