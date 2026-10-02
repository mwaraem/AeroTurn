import React from "react";
import { RiskLevel } from "@/types";
import { AlertTriangle, CheckCircle2, AlertOctagon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TurnaroundRiskBadgeProps {
  level: RiskLevel;
  showIcon?: boolean;
  className?: string;
}

export function TurnaroundRiskBadge({
  level,
  showIcon = true,
  className,
}: TurnaroundRiskBadgeProps) {
  const configs: Record<
    RiskLevel,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    GREEN: {
      label: "ON TRACK",
      bg: "bg-emerald-500/10",
      text: "text-emerald-500 dark:text-emerald-400",
      border: "border-emerald-500/20",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    AMBER: {
      label: "AT RISK",
      bg: "bg-amber-500/10",
      text: "text-amber-500 dark:text-amber-400",
      border: "border-amber-500/20",
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
    },
    RED: {
      label: "CRITICAL / DELAYED",
      bg: "bg-rose-500/10",
      text: "text-rose-500 dark:text-rose-400",
      border: "border-rose-500/20",
      icon: <AlertOctagon className="w-3.5 h-3.5" />,
    },
  };

  const config = configs[level];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border",
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      {showIcon && config.icon}
      {config.label}
    </span>
  );
}
