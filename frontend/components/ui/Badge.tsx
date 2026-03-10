import { clsx } from "clsx";

interface BadgeProps {
  label: string;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "neutral";
  className?: string;
}

const colorMap = {
  primary: "bg-blue-100 text-blue-600 border border-blue-200",
  secondary: "bg-indigo-100 text-indigo-600 border border-indigo-200",
  success: "bg-emerald-100 text-emerald-600 border border-emerald-200",
  warning: "bg-orange-100 text-orange-600 border border-orange-200",
  danger: "bg-red-100 text-red-600 border border-red-200",
  neutral: "bg-slate-100 text-slate-600 border border-slate-200",
};

export function Badge({ label, variant = "neutral", className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest",
        colorMap[variant],
        className
      )}
    >
      {label}
    </span>
  );
}
