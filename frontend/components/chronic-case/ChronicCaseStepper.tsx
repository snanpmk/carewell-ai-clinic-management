import { Check } from "lucide-react";
import { clsx } from "clsx";

export interface Step {
  id: string;
  title: string;
}

interface ChronicCaseStepperProps {
  steps: Step[];
  currentStepIndex: number;
}

export default function ChronicCaseStepper({ steps, currentStepIndex }: ChronicCaseStepperProps) {
  return (
    <div className="w-full mb-10">
      {/* Multi-row Grid Container */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;

          return (
            <div 
              key={step.id} 
              className={clsx(
                "flex flex-col gap-2 p-3 rounded-2xl transition-all duration-500 relative border cursor-default h-full",
                isActive 
                  ? "bg-white border-brand-primary shadow-xl shadow-brand-primary/10 ring-4 ring-brand-primary/5 z-10" 
                  : isCompleted 
                  ? "bg-brand-primary/5 border-brand-primary/20 text-brand-primary" 
                  : "bg-slate-50 border-slate-100 text-slate-400 opacity-60"
              )}
            >
              <div className="flex items-center justify-between">
                {/* Number/Check Indicator */}
                <div className={clsx(
                  "w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-500 text-[10px] font-black",
                  isActive ? "bg-brand-primary text-white shadow-lg rotate-6" : 
                  isCompleted ? "bg-brand-primary text-white" : "bg-slate-200 text-slate-400"
                )}>
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 stroke-[4]" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                {isActive && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
                  </span>
                )}
              </div>

              <div className="mt-1">
                <p className={clsx(
                  "text-[10px] font-black uppercase tracking-wider leading-tight",
                  isActive ? "text-slate-900" : isCompleted ? "text-brand-primary" : "text-inherit"
                )}>
                  {step.title}
                </p>
                {isActive ? (
                  <p className="text-[8px] font-bold text-brand-primary uppercase mt-1">Current Stage</p>
                ) : isCompleted ? (
                  <p className="text-[8px] font-bold text-emerald-500 uppercase mt-1">Validated</p>
                ) : (
                  <p className="text-[8px] font-bold text-slate-300 uppercase mt-1">Waiting</p>
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
