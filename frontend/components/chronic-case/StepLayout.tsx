"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, Loader2, User } from "lucide-react";

interface StepLayoutProps {
  title: string;
  subtitle: string;
  patientContext?: { name: string; age: number | string; gender: string };
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
}

export default function StepLayout({
  title,
  subtitle,
  patientContext,
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
}: StepLayoutProps) {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 relative">
      
      {/* 1. STICKY PATIENT CONTEXT BAR */}
      {patientContext?.name && (
        <div className="mb-8 -mx-1">
          <div className="bg-slate-900 text-white/90 px-5 py-3 rounded-[1.5rem] shadow-2xl flex items-center justify-between border border-white/10 ring-4 ring-white shadow-brand-primary/10">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-brand-primary/20 rounded-lg">
                <User className="w-3.5 h-3.5 text-brand-primary" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-primary leading-none mb-0.5">Clinical Profile</p>
                <h4 className="text-xs font-bold leading-none">{patientContext.name}</h4>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 leading-none mb-1">Metrics</p>
                <p className="text-[10px] font-bold">{patientContext.age}y • {patientContext.gender}</p>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div className="px-3 py-1 bg-white/5 rounded-full border border-white/5">
                <span className="text-[9px] font-bold text-brand-primary uppercase animate-pulse italic">Studying Case...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section Header */}
      {!patientContext?.name && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100 mb-8">
          <div>
            <h2 className="text-xl font-light text-slate-900 tracking-tight">
              Section <span className="font-semibold">{title}</span>
            </h2>
            <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">{subtitle}</p>
          </div>
          {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
        </div>
      )}

      {/* If context bar is present, show section title differently */}
      {patientContext?.name && (
        <div className="mb-8 flex items-end justify-between">
          <div>
             <h2 className="text-2xl font-light text-slate-900 tracking-tight">
              Section <span className="font-semibold">{title}</span>
            </h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{subtitle}</p>
          </div>
          {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
        </div>
      )}

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
