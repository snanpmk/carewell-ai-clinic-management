"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface StepLayoutProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  iconVariant?: "blue" | "amber" | "emerald" | "indigo" | "purple" | "rose" | "teal" | "gradient";
  children: ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  isSubmitting?: boolean;
  nextLabel?: string;
  backLabel?: string;
  nextIcon?: ReactNode;
  backIcon?: ReactNode;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  headerActions?: ReactNode;
  error?: string;
}

const variantStyles = {
  blue: "from-blue-50 to-indigo-50 border-blue-100/50 text-blue-600 shadow-blue-100",
  amber: "from-amber-50 to-orange-50 border-amber-100/50 text-amber-600 shadow-amber-100",
  emerald: "from-emerald-50 to-teal-50 border-emerald-100/50 text-emerald-600 shadow-emerald-100",
  indigo: "from-indigo-50 to-cyan-50 border-indigo-100/50 text-indigo-600 shadow-indigo-100",
  purple: "from-purple-50 to-fuchsia-50 border-purple-100/50 text-purple-600 shadow-purple-100",
  rose: "from-rose-50 to-pink-50 border-rose-100/50 text-rose-600 shadow-rose-100",
  teal: "from-teal-50 to-emerald-50 border-teal-100/50 text-teal-600 shadow-teal-100",
  gradient: "from-indigo-600 to-purple-600 border-indigo-500 text-white shadow-indigo-500/30",
};

export default function StepLayout({
  title,
  subtitle,
  icon,
  iconVariant = "blue",
  children,
  onBack,
  onNext,
  isSubmitting = false,
  nextLabel = "Continue",
  backLabel = "Back",
  nextIcon = <ChevronRight className="w-4 h-4" />,
  backIcon = <ChevronLeft className="w-4 h-4" />,
  isFirstStep = false,
  isLastStep = false,
  headerActions,
  error,
}: StepLayoutProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100/80">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 bg-linear-to-br border rounded-2xl flex items-center justify-center shadow-xs ${variantStyles[iconVariant]}`}
          >
            {icon}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
            <p className="text-sm font-medium text-slate-500 mt-0.5">{subtitle}</p>
          </div>
        </div>
        {headerActions && <div className="flex items-center gap-3">{headerActions}</div>}
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-bold shadow-xs">
          <div className="w-5 h-5 shrink-0 flex items-center justify-center bg-red-100 rounded-full">
            <span className="text-red-600 text-xs">!</span>
          </div>
          {error}
        </div>
      )}

      <div>{children}</div>

      {/* Navigation */}
      <div
        className={`flex items-center pt-8 border-t border-slate-100/80 ${
          isFirstStep ? "justify-end" : "justify-between"
        }`}
      >
        {!isFirstStep && (
          <Button
            type="button"
            onClick={onBack}
            variant="outline"
            leftIcon={backIcon}
            disabled={isSubmitting}
          >
            {backLabel}
          </Button>
        )}
        <Button
          type={onNext ? "button" : "submit"}
          onClick={onNext}
          variant="primary"
          rightIcon={!isSubmitting && !isLastStep ? nextIcon : undefined}
          leftIcon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (isLastStep ? nextIcon : undefined)}
          isLoading={isSubmitting}
          className={isLastStep ? "shadow-md shadow-blue-500/20" : ""}
        >
          {nextLabel}
        </Button>
      </div>
    </div>
  );
}
