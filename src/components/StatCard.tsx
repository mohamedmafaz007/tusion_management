import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon,
  hint,
  gradient,
  trend,
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  hint?: string;
  gradient?: boolean;
  trend?: { value: string; positive?: boolean };
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-glow",
        gradient ? "gradient-brand text-white" : "glass",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className={cn("text-xs font-medium uppercase tracking-wider", gradient ? "text-white/80" : "text-muted-foreground")}>
            {label}
          </div>
          <div className="mt-2 text-3xl font-black tracking-tight">{value}</div>
          {hint && (
            <div className={cn("mt-1 text-xs", gradient ? "text-white/70" : "text-muted-foreground")}>{hint}</div>
          )}
          {trend && (
            <div
              className={cn(
                "mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                gradient
                  ? "bg-white/20 text-white"
                  : trend.positive
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-destructive/10 text-destructive",
              )}
            >
              {trend.value}
            </div>
          )}
        </div>
        <div
          className={cn(
            "grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-transform group-hover:scale-110",
            gradient ? "bg-white/20 text-white" : "gradient-brand text-white shadow-glow",
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
