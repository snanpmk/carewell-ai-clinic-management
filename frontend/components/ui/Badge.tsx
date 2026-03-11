import { clsx } from "clsx";

interface BadgeProps {
  label: string;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "neutral";
  className?: string;
}

const colorMap = {
  primary: "bg-brand-primary/10 text-brand-primary border border-brand-primary/20",
  secondary: "bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20",
  success: "bg-emerald-100 text-emerald-600 border border-emerald-200",
  warning: "bg-orange-100 text-orange-600 border border-orange-200",
  danger: "bg-red-100 text-red-600 border border-red-200",
  neutral: "bg-slate-100 text-slate-600 border border-slate-200",
};

export function Badge({ label, variant = "neutral", className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-tight",
        colorMap[variant],
        className
      )}
    >
      {label}
    </span>
  );
}
