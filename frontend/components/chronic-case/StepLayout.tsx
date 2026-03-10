"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface StepLayoutProps {
  title: string;
  subtitle: string;
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

export default function StepLayout({
  title,
  subtitle,
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
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-6">
        <div>
          <h2 className="text-lg font-black text-slate-900  ">{title}</h2>
          <p className="text-xs font-medium text-slate-500 mt-0.5 tracking-tight">{subtitle}</p>
        </div>
        {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
      </div>

      {error && (
        <div className="flex items-center gap-4 p-3 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[10px] font-black uppercase tracking-widest mb-6 animate-in shake duration-500">
          <div className="w-5 h-5 shrink-0 flex items-center justify-center bg-red-100 rounded-lg">
            <span>!</span>
          </div>
          {error}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-h-0">
        {children}
      </div>

      {/* Navigation */}
      <div
        className={`flex items-center pt-6 mt-8 border-t border-slate-100 ${
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
            size="md"
          >
            {backLabel}
          </Button>
        )}
        <Button
          type={onNext ? "button" : "submit"}
          onClick={onNext}
          variant="primary"
          size="md"
          rightIcon={!isSubmitting && !isLastStep ? nextIcon : undefined}
          leftIcon={isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLastStep ? nextIcon : undefined)}
          isLoading={isSubmitting}
          className={isLastStep ? "shadow-2xl shadow-brand-primary/20 min-w-[160px]" : "min-w-[160px]"}
        >
          {nextLabel}
        </Button>
      </div>
    </div>
  );
}
