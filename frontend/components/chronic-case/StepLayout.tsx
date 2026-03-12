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
  customActions?: ReactNode;
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
  customActions,
  error,
}: StepLayoutProps) {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100 mb-8">
        <div>
          <h2 className="text-xl font-light text-slate-900 tracking-tight">
            Section <span className="font-semibold">{title}</span>
          </h2>
          <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">{subtitle}</p>
        </div>
        {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 no-scrollbar">
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
        {customActions ? (
          customActions
        ) : (
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
        )}
      </div>
    </div>
  );
}
