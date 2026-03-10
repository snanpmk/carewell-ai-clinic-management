import { clsx } from "clsx";
import { Check } from "lucide-react";

const steps = [
  { id: 1, label: "Registration" },
  { id: 2, label: "Symptoms" },
  { id: 3, label: "Review Notes" },
];

interface StepperProps {
  currentStep: 1 | 2 | 3;
}

export function Stepper({ currentStep }: StepperProps) {
  return (
    <div className="w-full max-w-xl mx-auto px-4">
      <div className="relative flex items-center justify-between">
        {/* Background Track */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full pointer-events-none" />
        
        {/* Progress Track */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-linear-to-r from-brand-primary to-brand-accent -translate-y-1/2 rounded-full transition-all duration-700 ease-in-out pointer-events-none" 
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <div key={step.id} className="relative flex flex-col items-center group">
              {/* Step Marker */}
              <div
                className={clsx(
                  "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 relative z-10 border-2",
                  isActive 
                    ? "bg-white border-brand-primary text-brand-primary shadow-xl shadow-brand-primary/20 scale-110" 
                    : isCompleted 
                    ? "bg-brand-primary border-brand-primary text-white" 
                    : "bg-white border-slate-200 text-slate-300"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 stroke-[3]" />
                ) : (
                  <span className="text-sm font-black italic">{step.id}</span>
                )}

                {/* Pulsing Ring for active step */}
                {isActive && (
                  <div className="absolute inset-0 rounded-2xl bg-brand-primary/20 animate-ping pointer-events-none" />
                )}
              </div>

              {/* Label */}
              <div className="absolute top-full mt-4 flex flex-col items-center">
                <span
                  className={clsx(
                    "text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-colors duration-300",
                    isActive ? "text-brand-primary" : isCompleted ? "text-slate-600" : "text-slate-400"
                  )}
                >
                  {step.label}
                </span>
                {isActive && (
                  <div className="w-1 h-1 bg-brand-primary rounded-full mt-1.5 animate-bounce" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
