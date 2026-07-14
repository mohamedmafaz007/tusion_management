import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { AttendanceStatus, FeeStatus } from "@/lib/types";

export function FeeStatusBadge({ status }: { status: FeeStatus }) {
  const map: Record<FeeStatus, string> = {
    Paid: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
    Pending: "bg-destructive/15 text-destructive border-destructive/30",
    Partial: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  };
  return <Badge variant="outline" className={cn("border", map[status])}>{status}</Badge>;
}

export function AttendanceStatusBadge({ status }: { status: AttendanceStatus }) {
  const map: Record<AttendanceStatus, string> = {
    Present: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
    Absent: "bg-destructive/15 text-destructive border-destructive/30",
    Late: "bg-amber-500/15 text-amber-600 border-amber-500/30",
    Holiday: "bg-blue-500/15 text-blue-600 border-blue-500/30",
  };
  return <Badge variant="outline" className={cn("border", map[status])}>{status}</Badge>;
}
