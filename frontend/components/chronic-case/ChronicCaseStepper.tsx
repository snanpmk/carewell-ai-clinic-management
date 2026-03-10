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
    <div className="w-full relative py-2">
      {/* Scrollable Container for small screens */}
      <div className="flex items-center overflow-x-auto no-scrollbar pb-1">
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
                    "flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg transition-all duration-300",
                    isActive ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20" : 
                    isCompleted ? "bg-white border border-slate-200 text-slate-700 shadow-xs hover:bg-slate-50" : 
                    "bg-transparent text-slate-400"
                  )}
                >
                  {/* Icon/Number indicator */}
                  <div className={clsx(
                    "flex items-center justify-center w-5 h-5 rounded-md shrink-0 text-[10px] font-black transition-colors duration-300",
                    isActive ? "bg-white/20 text-white shadow-xs" : 
                    isCompleted ? "bg-blue-50 text-blue-600 border border-blue-100" : 
                    "border border-slate-200 text-slate-300"
                  )}>
                    {isCompleted ? <Check className="w-2.5 h-2.5" /> : index + 1}
                  </div>
                  
                  {/* Label */}
                  <span className="text-[13px] font-bold whitespace-nowrap">
                    {step.title}
                  </span>
                </div>

                {/* Connector Line */}
                {!isLast && (
                  <div className="w-4 sm:w-6 md:w-8 h-0.5 mx-1 shrink-0 transition-colors duration-300 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={clsx(
                        "h-full transition-all duration-500 rounded-full",
                        isCompleted ? "bg-linear-to-r from-blue-500 to-indigo-500 w-full" : "bg-transparent w-0"
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
