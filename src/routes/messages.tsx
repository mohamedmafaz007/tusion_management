import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { 
  MessageSquare, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  Send, 
  Gift, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Settings as SettingsIcon,
  HelpCircle,
  Trash2,
  Loader2,
  Sparkles
} from "lucide-react";
import { PageHeader } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { StatCard } from "@/components/StatCard";
import { useHydrated } from "@/lib/hooks";
import { toast } from "sonner";
import { 
  getMessageLogs, 
  getMessageLogStats, 
  sendMonthlyFeeReminders, 
  sendFeeOverdueReminders, 
  checkAndSendBirthdayWishes,
  checkAndSendFestivalGreetings,
  getBaileysStatus,
  deleteDbMessageLog,
  clearAllDbMessageLogs
} from "@/lib/db";
import type { MessageLog, MessageType } from "@/lib/types";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "Message Logs — Vishwa Tuition Center" },
      { name: "description", content: "Trace automatic WhatsApp alerts and trigger bulk parent notifications." },
    ],
  }),
  component: MessageLogsPage,
});

const TYPE_LABELS: Record<MessageType, { label: string; color: string }> = {
  welcome: { label: "Welcome / Form", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  attendance: { label: "Attendance", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  fee_reminder: { label: "Fee Reminder", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  fee_receipt: { label: "Fee Receipt", color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" },
  birthday: { label: "Birthday Wish", color: "bg-pink-500/10 text-pink-500 border-pink-500/20" },
  fee_overdue: { label: "Fee Overdue", color: "bg-red-500/10 text-red-500 border-red-500/20" },
  campaign: { label: "Campaign / Bulk", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
};

function MessageLogsPage() {
  useHydrated();
  const [logs, setLogs] = useState<MessageLog[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    sent: 0,
    failed: 0,
    today: 0,
    byType: {} as Record<string, number>,
  });
  const [wsStatus, setWsStatus] = useState<"disconnected" | "connecting" | "qrcode" | "connected">("disconnected");
  
  // Filtering and pagination state
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Trigger loading states
  const [isSendingReminders, setIsSendingReminders] = useState(false);
  const [isSendingOverdue, setIsSendingOverdue] = useState(false);
  const [isSendingBirthdays, setIsSendingBirthdays] = useState(false);

  // Month selector for fee triggers
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const limit = 15;

  const fetchStatsAndStatus = async () => {
    try {
      const [sData, wsData] = await Promise.all([
        getMessageLogStats(),
        getBaileysStatus(),
      ]);
      setStats(sData);
      setWsStatus(wsData.status as any);
    } catch (err) {
      console.error("Failed to load message stats/status:", err);
    }
  };

  const fetchLogs = async () => {
    setIsRefreshing(true);
    try {
      const queryType = filterType === "all" ? undefined : filterType;
      const queryStatus = filterStatus === "all" ? undefined : filterStatus;
      
      const res = await getMessageLogs({
        data: {
          limit,
          offset: page * limit,
          type: queryType,
          status: queryStatus
        }
      });
      
      setLogs(res.logs);
      setTotalRecords(res.total);
    } catch (err) {
      console.error("Failed to load logs:", err);
      toast.error("Failed to load message logs");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchStatsAndStatus();
    fetchLogs();
  }, [filterType, filterStatus, page]);

  // Auto-refresh stats and status every 10 seconds
  useEffect(() => {
    const t = setInterval(fetchStatsAndStatus, 10000);
    return () => clearInterval(t);
  }, []);

  const totalPages = Math.ceil(totalRecords / limit);

  const handleRefreshAll = () => {
    fetchStatsAndStatus();
    fetchLogs();
    toast.success("Logs and stats updated!");
  };

  const handleDeleteLog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message log?")) return;
    try {
      const res = await deleteDbMessageLog({ data: id });
      if (res.success) {
        toast.success("Message log deleted");
        fetchStatsAndStatus();
        fetchLogs();
      } else {
        toast.error("Failed to delete message log");
      }
    } catch (err: any) {
      toast.error(`Error: ${err.message || err}`);
    }
  };

  const handleClearAllLogs = async () => {
    if (!confirm("Are you sure you want to clear ALL message logs? This cannot be undone.")) return;
    try {
      const res = await clearAllDbMessageLogs();
      if (res.success) {
        toast.success("All message logs cleared");
        fetchStatsAndStatus();
        fetchLogs();
      } else {
        toast.error("Failed to clear message logs");
      }
    } catch (err: any) {
      toast.error(`Error: ${err.message || err}`);
    }
  };

  // Triggers
  const triggerFeeReminders = async () => {
    if (wsStatus !== "connected") {
      toast.error("WhatsApp must be connected to send automated reminders. Please pair in Settings.");
      return;
    }
    
    setIsSendingReminders(true);
    const loader = toast.loading(`Checking and sending pending fee reminders...`);
    try {
      const res = await sendMonthlyFeeReminders({
        data: { month: selectedMonth }
      });
      if (res.manual) {
        toast.error("WhatsApp provider is set to manual. Cannot send automatic bulk alerts.", { id: loader });
      } else {
        toast.success(`Success! Sent ${res.sent} fee reminders (${res.failed} failed)`, { id: loader });
        handleRefreshAll();
      }
    } catch (err: any) {
      toast.error(`Failed: ${err.message || err}`, { id: loader });
    } finally {
      setIsSendingReminders(false);
    }
  };

  const triggerOverdueAlerts = async () => {
    if (wsStatus !== "connected") {
      toast.error("WhatsApp must be connected to send automated reminders. Please pair in Settings.");
      return;
    }

    setIsSendingOverdue(true);
    const loader = toast.loading(`Checking and sending overdue alerts...`);
    try {
      const res = await sendFeeOverdueReminders({
        data: { month: selectedMonth }
      });
      if (res.manual) {
        toast.error("WhatsApp provider is set to manual. Cannot send automatic bulk alerts.", { id: loader });
      } else {
        toast.success(`Success! Sent ${res.sent} overdue alerts (${res.failed} failed)`, { id: loader });
        handleRefreshAll();
      }
    } catch (err: any) {
      toast.error(`Failed: ${err.message || err}`, { id: loader });
    } finally {
      setIsSendingOverdue(false);
    }
  };

  const triggerBirthdayWishes = async () => {
    if (wsStatus !== "connected") {
      toast.error("WhatsApp must be connected to send automated wishes. Please pair in Settings.");
      return;
    }

    setIsSendingBirthdays(true);
    const loader = toast.loading(`Checking for today's birthdays...`);
    try {
      const res = await checkAndSendBirthdayWishes();
      if (res.manual) {
        toast.error("WhatsApp provider is set to manual. Cannot send birthday wishes automatically.", { id: loader });
      } else {
        if (res.birthdaysFound === 0) {
          toast.info("No student birthdays found for today.", { id: loader });
        } else {
          toast.success(`Success! Dispatched ${res.sent} birthday wishes (${res.failed} failed)`, { id: loader });
          handleRefreshAll();
        }
      }
    } catch (err: any) {
      toast.error(`Failed: ${err.message || err}`, { id: loader });
    } finally {
      setIsSendingBirthdays(false);
    }
  };
  const [isSendingFestivals, setIsSendingFestivals] = useState(false);

  const triggerFestivalGreetings = async () => {
    if (wsStatus !== "connected") {
      toast.error("WhatsApp must be connected to send automated greetings. Please pair in Settings.");
      return;
    }

    setIsSendingFestivals(true);
    const loader = toast.loading(`Checking for today's Indian festivals...`);
    try {
      const res = await checkAndSendFestivalGreetings();
      if (res.manual) {
        toast.error("WhatsApp provider is set to manual. Cannot send festival greetings automatically.", { id: loader });
      } else {
        if (!res.festival) {
          toast.info("No Indian festival greetings registered for today's date.", { id: loader });
        } else {
          toast.success(`Success! Dispatched ${res.sent} wishes for ${res.festival} (${res.failed} failed)`, { id: loader });
          handleRefreshAll();
        }
      }
    } catch (err: any) {
      toast.error(`Failed: ${err.message || err}`, { id: loader });
    } finally {
      setIsSendingFestivals(false);
    }
  };
  return (
    <div className="space-y-6">
      <PageHeader
        title="Message Logs & Automation"
        description="Monitor automated parent notifications and trigger mass WhatsApp alerts."
        actions={
          <Button variant="outline" className="rounded-xl" onClick={handleRefreshAll} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh Dashboard
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard 
          label="Total Automated" 
          value={stats.total} 
          icon={<MessageSquare className="h-5 w-5" />} 
          gradient 
        />
        <StatCard 
          label="Today's Outbox" 
          value={stats.today} 
          icon={<Clock className="h-5 w-5" />} 
        />
        <StatCard 
          label="Failed Deliveries" 
          value={stats.failed} 
          icon={<AlertCircle className="h-5 w-5" />} 
          hint={stats.failed > 0 ? "Check logs below" : undefined}
        />
        
        {/* WhatsApp Connection Card */}
        <div className="glass relative overflow-hidden rounded-2xl p-5 border border-border/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">WhatsApp Status</span>
            <div className="rounded-full bg-accent/60 p-2 text-accent-foreground">
              <Send className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight">
              {wsStatus === "connected" ? "Connected" : wsStatus === "connecting" ? "Connecting" : "Offline"}
            </span>
            <span className={`h-2.5 w-2.5 rounded-full ${wsStatus === "connected" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : wsStatus === "connecting" ? "bg-amber-500 animate-pulse" : "bg-red-500"}`} />
          </div>
          <div className="mt-3 flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Direct Baileys Web connection</span>
            <Link to="/settings" className="font-semibold text-primary hover:underline flex items-center gap-1">
              <SettingsIcon className="h-3 w-3" /> Configure
            </Link>
          </div>
        </div>
      </div>

      {/* Trigger Panels */}
      <div className="glass rounded-2xl p-6 border border-border/50 space-y-6">
        <h3 className="text-lg font-semibold tracking-tight flex items-center gap-2">
          <Send className="h-5 w-5 text-primary" />
          Trigger Automated Campaigns
        </h3>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Fee Reminders Card */}
          <div className="flex flex-col justify-between p-4 rounded-xl border border-border/60 bg-accent/20 hover:bg-accent/30 transition-all">
            <div className="space-y-2">
              <h4 className="font-bold flex items-center gap-2 text-sm text-foreground">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Fee Payment Reminders
              </h4>
              <p className="text-xs text-muted-foreground">
                Scans students with unpaid/pending fees for the selected month and automatically alerts parents on WhatsApp.
              </p>
              
              <div className="pt-2">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Reminders Month</label>
                <input 
                  type="month" 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="mt-1 block w-full text-xs bg-background/50 border border-border rounded-lg p-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            
            <div className="mt-4 flex gap-2">
              <Button 
                onClick={triggerFeeReminders} 
                disabled={isSendingReminders}
                className="flex-1 rounded-xl text-xs"
                size="sm"
              >
                {isSendingReminders ? (
                  <>
                    <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> Sending...
                  </>
                ) : (
                  "Send Reminders"
                )}
              </Button>
              <Button 
                variant="outline"
                onClick={triggerOverdueAlerts}
                disabled={isSendingOverdue}
                className="flex-1 rounded-xl text-xs text-red-500 hover:text-red-600 border-red-500/20 hover:bg-red-50 dark:hover:bg-red-950/20"
                size="sm"
              >
                {isSendingOverdue ? (
                  <>
                    <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> Sending...
                  </>
                ) : (
                  "Send Overdue"
                )}
              </Button>
            </div>
          </div>

          {/* Birthday Wishes Card */}
          <div className="flex flex-col justify-between p-4 rounded-xl border border-border/60 bg-accent/20 hover:bg-accent/30 transition-all">
            <div className="space-y-2">
              <h4 className="font-bold flex items-center gap-2 text-sm text-foreground">
                <Gift className="h-4 w-4 text-pink-500" />
                Student Birthday Greetings
              </h4>
              <p className="text-xs text-muted-foreground font-normal">
                Checks if any student has a birthday today and automatically delivers a warm wishing template text via WhatsApp.
              </p>
            </div>
            
            <div className="mt-4">
              <Button 
                onClick={triggerBirthdayWishes} 
                disabled={isSendingBirthdays}
                className="w-full rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs"
                size="sm"
              >
                {isSendingBirthdays ? (
                  <>
                    <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> Sending...
                  </>
                ) : (
                  "Trigger Birthdays Wish"
                )}
              </Button>
            </div>
          </div>

          {/* Festival Greetings Card */}
          <div className="flex flex-col justify-between p-4 rounded-xl border border-border/60 bg-accent/20 hover:bg-accent/30 transition-all">
            <div className="space-y-2">
              <h4 className="font-bold flex items-center gap-2 text-sm text-foreground">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Festival Greetings
              </h4>
              <p className="text-xs text-muted-foreground font-normal">
                Scans today's date for major Indian festivals and automatically delivers a beautiful wishing template to parents.
              </p>
            </div>
            
            <div className="mt-4">
              <Button 
                onClick={triggerFestivalGreetings} 
                disabled={isSendingFestivals}
                className="w-full rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs"
                size="sm"
              >
                {isSendingFestivals ? (
                  <>
                    <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> Sending...
                  </>
                ) : (
                  "Trigger Festival Wishes"
                )}
              </Button>
            </div>
          </div>

          {/* Info Card */}
          <div className="flex flex-col justify-between p-4 rounded-xl border border-border/60 bg-accent/20">
            <div className="space-y-2 text-xs">
              <h4 className="font-bold flex items-center gap-2 text-sm text-muted-foreground">
                <HelpCircle className="h-4 w-4 text-primary" />
                Automated Workflows Info
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                👉 <strong>Welcome forms</strong> are automatically compiled into A4 registration PDFs and dispatched when a new student is saved.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                👉 <strong>Daily Attendance</strong> notifications (Present, Absent, and Late timestamps) will now prompt you to send bulk alerts as soon as you submit the class checklist!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="glass rounded-2xl border border-border/50 overflow-hidden">
        {/* Table header filters */}
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-border/40 bg-accent/10">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold">Message Log History</span>
            {logs.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                className="h-8 rounded-lg text-xs"
                onClick={handleClearAllLogs}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" /> Clear All Logs
              </Button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 ml-auto">
            <Select value={filterType} onValueChange={(v) => { setFilterType(v); setPage(0); }}>
              <SelectTrigger className="h-9 w-[150px] rounded-lg text-xs">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="welcome">Welcome Form</SelectItem>
                <SelectItem value="attendance">Attendance</SelectItem>
                <SelectItem value="fee_reminder">Fee Reminder</SelectItem>
                <SelectItem value="fee_receipt">Fee Receipt</SelectItem>
                <SelectItem value="birthday">Birthday Wish</SelectItem>
                <SelectItem value="fee_overdue">Fee Overdue</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setPage(0); }}>
              <SelectTrigger className="h-9 w-[130px] rounded-lg text-xs">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table body */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-accent/20 text-xs font-semibold text-muted-foreground">
                <th className="p-3">Time</th>
                <th className="p-3">Type</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Recipient Mobile</th>
                <th className="p-3">Message Preview</th>
                <th className="p-3 text-right">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isRefreshing && logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-muted-foreground">Loading logs...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-muted-foreground">No matching logs found.</td>
                </tr>
              ) : (
                logs.map((log) => {
                  const typeInfo = TYPE_LABELS[log.type] || { label: log.type, color: "bg-gray-500/10 text-gray-500 border-gray-500/20" };
                  const formattedTime = new Date(log.timestamp).toLocaleString("en-IN", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  
                  return (
                    <tr key={log.id} className="hover:bg-accent/40 transition-colors">
                      <td className="p-3 whitespace-nowrap text-xs text-muted-foreground">{formattedTime}</td>
                      <td className="p-3 whitespace-nowrap">
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${typeInfo.color}`}>
                          {typeInfo.label}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-foreground whitespace-nowrap">{log.studentName || "—"}</td>
                      <td className="p-3 text-muted-foreground whitespace-nowrap">{log.recipientPhone}</td>
                      <td className="p-3 max-w-xs truncate text-xs" title={log.message}>
                        {log.message}
                      </td>
                      <td className="p-3 whitespace-nowrap text-right">
                        {log.status === "sent" ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Sent
                          </span>
                        ) : (
                          <span 
                            className="inline-flex items-center gap-1 text-xs font-bold text-red-500 cursor-help"
                            title={log.error || "Delivery failed"}
                          >
                            <AlertCircle className="h-3.5 w-3.5" /> Failed
                          </span>
                        )}
                      </td>
                      <td className="p-3 whitespace-nowrap text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg animate-fade-in"
                          onClick={() => handleDeleteLog(log.id)}
                          title="Delete Log"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border bg-accent/10">
            <span className="text-xs text-muted-foreground">
              Showing page {page + 1} of {totalPages} ({totalRecords} records)
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-lg"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-lg"
                disabled={page >= totalPages - 1}
                onClick={() => setPage(page + 1)}
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
