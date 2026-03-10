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
    <div className="w-full relative py-4">
      {/* Scrollable Container for small screens */}
      <div className="flex items-center overflow-x-auto no-scrollbar pb-2">
        <div className="flex items-center w-full min-w-max">
          {steps.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;
            const isLast = index === steps.length - 1;

            return (
              <div key={step.id} className="flex items-center group">
                {/* Step Item */}
                <div 
                  className={clsx(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-300",
                    isActive ? "bg-slate-900 text-white shadow-sm" : 
                    isCompleted ? "bg-transparent text-slate-700 hover:bg-slate-50" : 
                    "bg-transparent text-slate-400"
                  )}
                >
                  {/* Icon/Number indicator */}
                  <div className={clsx(
                    "flex items-center justify-center w-5 h-5 rounded shrink-0 text-[11px] font-medium transition-colors duration-300",
                    isActive ? "bg-white/20 text-white" : 
                    isCompleted ? "bg-slate-100 text-slate-700" : 
                    "border border-slate-200 text-slate-400"
                  )}>
                    {isCompleted ? <Check className="w-3 h-3" /> : index + 1}
                  </div>
                  
                  {/* Label */}
                  <span className="text-sm font-medium whitespace-nowrap">
                    {step.title}
                  </span>
                </div>

                {/* Connector Line */}
                {!isLast && (
                  <div className="w-6 sm:w-8 md:w-12 h-px mx-1 sm:mx-2 shrink-0 transition-colors duration-300 bg-slate-200">
                    <div 
                      className={clsx(
                        "h-full transition-all duration-500",
                        isCompleted ? "bg-slate-900 w-full" : "bg-transparent w-0"
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
