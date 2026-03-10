import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";
import { clsx } from "clsx";

interface AlertProps {
  type: "error" | "success" | "info" | "warning";
  message: string;
}

const styles = {
  error: "bg-red-50 border-red-100 text-red-600",
  success: "bg-brand-primary/10 border-brand-primary/20 text-brand-primary",
  info: "bg-brand-accent/10 border-brand-accent/20 text-brand-accent",
  warning: "bg-amber-50 border-amber-100 text-amber-600",
};

const Icons = {
  error: XCircle,
  success: CheckCircle2,
  info: Info,
  warning: AlertCircle,
};

export function Alert({ type, message }: AlertProps) {
  const Icon = Icons[type];
  
  return (
    <div
      className={clsx(
        "flex items-center gap-4 rounded-[1.5rem] border p-5 text-sm transition-all animate-in fade-in duration-500",
        styles[type]
      )}
      role="alert"
    >
      <div className="shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <p className="font-black uppercase tracking-widest text-[11px] leading-tight">{message}</p>
    </div>
  );
}
