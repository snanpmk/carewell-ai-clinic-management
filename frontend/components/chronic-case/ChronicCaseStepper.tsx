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
    <div className="w-full bg-slate-50 border border-slate-200 rounded-[2.5rem] p-2 mb-8 shadow-inner overflow-hidden">
      {/* Scrollable Container for small screens */}
      <div className="flex items-center gap-2 overflow-x-auto overflow-y-hidden no-scrollbar scroll-smooth">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;

          return (
            <div 
              key={step.id} 
              className={clsx(
                "flex-1 min-w-[180px] flex items-center justify-between gap-4 py-4 px-6 rounded-[2rem] transition-all duration-500 relative group cursor-default",
                isActive 
                  ? "bg-white text-slate-900 shadow-2xl shadow-slate-200/80 scale-[1.02] z-10 border border-slate-100" 
                  : "text-slate-400 hover:bg-white/50"
              )}
            >
              <div className="flex items-center gap-4">
                {/* Number/Check Indicator */}
                <div className={clsx(
                  "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500",
                  isActive ? "bg-slate-900 text-white shadow-xl rotate-6" : 
                  isCompleted ? "bg-brand-primary/10 text-brand-primary" : "bg-slate-200/50 text-slate-400"
                )}>
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[3]" />
                  ) : (
                    <span className="text-sm font-black italic">{index + 1}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <span className={clsx(
                    "text-[11px] font-black uppercase tracking-[0.15em] whitespace-nowrap transition-colors",
                    isActive ? "text-slate-900" : isCompleted ? "text-brand-primary" : "text-inherit"
                  )}>
                    {step.title}
                  </span>
               
                </div>
              </div>

              
            </div>
          );
        })}
      </div>
    </div>
  );
}
