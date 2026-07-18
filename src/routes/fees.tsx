import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Wallet, CheckCircle, Clock, Printer, Receipt, History, Send, Loader2 } from "lucide-react";
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
import { sendWhatsAppReceipt } from "@/lib/db";
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
      { title: "Fees — Vishwa Tuition Center" },
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
      .filter((s) => s.joiningDate.slice(0, 7) <= month || fees.some((f) => f.studentId === s.id && f.month === month))
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
    let total = 0;
    let paid = 0;
    for (const r of rows) {
      total += r.fee.amount;
      paid += r.fee.paidAmount;
    }
    return { total, paid, pending: total - paid };
  }, [rows]);

  const [isSendingReceipt, setIsSendingReceipt] = useState(false);

  const handleManualShare = async (studentId: string, feeId: string, name: string) => {
    setIsSendingReceipt(true);
    const loader = toast.loading(`Sending WhatsApp receipt to ${name}'s parent...`);
    try {
      await sendWhatsAppReceipt({ data: { studentId, feeId } });
      toast.success("WhatsApp receipt sent successfully!", { id: loader });
    } catch (err: any) {
      console.error("Failed to send manual WhatsApp receipt:", err);
      toast.error(`Failed to send WhatsApp receipt: ${err.message || err}`, { id: loader });
    } finally {
      setIsSendingReceipt(false);
    }
  };

  const markPaid = async (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;
    const existing = fees.find((f) => f.studentId === studentId && f.month === month);
    const paidDate = new Date().toISOString().slice(0, 10);
    const feeId = existing ? existing.id : uid();

    if (existing) {
      await setFeesState(
        fees.map((f) =>
          f.id === existing.id ? { ...f, paidAmount: f.amount, status: "Paid", paidDate } : f,
        ),
      );
    } else {
      await setFeesState([
        ...fees,
        {
          id: feeId,
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

    // Automatically send receipt if Baileys is the provider
    if (settings.whatsappProvider === "baileys") {
      const parentMobile = student.fatherMobile || student.motherMobile;
      if (!parentMobile) {
        toast.warning("Could not send automated WhatsApp receipt: No parent mobile number found.");
        return;
      }
      const loader = toast.loading(`Sending automated WhatsApp receipt to ${student.name}'s parent...`);
      try {
        await sendWhatsAppReceipt({ data: { studentId, feeId } });
        toast.success("WhatsApp receipt sent successfully!", { id: loader });
      } catch (err: any) {
        console.error("Failed to send automated WhatsApp receipt:", err);
        toast.error(`Failed to send WhatsApp receipt: ${err.message || err}`, { id: loader });
      }
    }
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
          <DialogFooter className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setReceiptOf(null)}>Close</Button>
            {settings.whatsappProvider === "baileys" && receiptData && (
              <Button
                variant="outline"
                className="border-emerald-500/50 hover:bg-emerald-50/50 hover:text-emerald-700 dark:hover:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400"
                onClick={() => handleManualShare(receiptData.s.id, receiptData.f.id, receiptData.s.name)}
                disabled={isSendingReceipt}
              >
                {isSendingReceipt ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Send via WhatsApp
                  </>
                )}
              </Button>
            )}
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
