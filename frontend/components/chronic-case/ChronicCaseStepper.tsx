"use client";

import { Check } from "lucide-react";
import { clsx } from "clsx";

export interface Step {
  id: string;
  title: string;
}

interface ChronicCaseStepperProps {
  steps: Step[];
  currentStepIndex: number;
  onStepClick?: (index: number) => void;
  isUpdateMode?: boolean;
}

export default function ChronicCaseStepper({ 
  steps, 
  currentStepIndex, 
  onStepClick,
  isUpdateMode 
}: ChronicCaseStepperProps) {
  return (
    <div className="w-full mb-10">
      {/* Multi-row Grid Container */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          
          // Clickable if: it's an update mode (all clickable) OR if it's already completed or active
          const isClickable = isUpdateMode || isCompleted || isActive;

          return (
            <div 
              key={step.id} 
              onClick={() => isClickable && onStepClick?.(index)}
              className={clsx(
                "flex flex-col gap-2 p-3 rounded-2xl transition-all duration-300 relative border h-full group",
                isClickable ? "cursor-pointer" : "cursor-not-allowed",
                isActive 
                  ? "bg-white border-brand-primary/50 shadow-md shadow-brand-primary/10 z-10" 
                  : isCompleted 
                  ? "bg-brand-primary/5 border-brand-primary/10 text-brand-primary hover:bg-brand-primary/10" 
                  : "bg-slate-50/50 border-slate-100 text-slate-400 opacity-60"
              )}
            >
              <div className="flex items-center justify-between">
                {/* Number/Check Indicator */}
                <div className={clsx(
                  "w-5 h-5 rounded-lg flex items-center justify-center transition-all duration-300 text-[10px] font-bold",
                  isActive ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20" : 
                  isCompleted ? "bg-brand-primary text-white" : "bg-slate-200 text-slate-400"
                )}>
                  {isCompleted ? (
                    <Check className="w-3 h-3 stroke-[3]" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                {isActive && (
                  <span className="flex h-1.5 w-1.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-primary"></span>
                  </span>
                )}
              </div>

              <div className="mt-1">
                <p className={clsx(
                  "text-[10px] font-bold uppercase tracking-wider leading-tight",
                  isActive ? "text-slate-900" : isCompleted ? "text-brand-primary" : "text-inherit"
                )}>
                  {step.title}
                </p>
                {isActive ? (
                  <p className="text-[8px] font-semibold text-brand-primary uppercase mt-1">Current</p>
                ) : isCompleted ? (
                  <p className="text-[8px] font-semibold text-emerald-500 uppercase mt-1">Done</p>
                ) : (
                  <p className="text-[8px] font-semibold text-slate-300 uppercase mt-1 tracking-tight">
                    {isUpdateMode ? "Edit" : "Queue"}
                  </p>
                )}
              </div>

              {/* Progress bar at the bottom of each card */}
              <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl overflow-hidden px-3">
                 <div className={clsx(
                   "h-full rounded-full transition-all duration-1000",
                   isActive ? "bg-brand-primary w-full animate-shimmer" : isCompleted ? "bg-brand-primary w-full" : "bg-transparent w-0"
                 )} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
