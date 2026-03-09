import { clsx } from "clsx";

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
    <div className="flex items-center justify-center gap-0 w-full max-w-sm mx-auto">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          {/* Step circle */}
          <div className="flex flex-col items-center">
            <div
              className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300",
                currentStep > step.id
                  ? "bg-blue-600 text-white"
                  : currentStep === step.id
                  ? "bg-blue-600 text-white ring-4 ring-blue-100"
                  : "bg-gray-100 text-gray-400"
              )}
            >
              {currentStep > step.id ? (
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414L8.414 15 3.293 9.879a1 1 0 111.414-1.414L8.414 12.172l6.879-6.879a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                step.id
              )}
            </div>
            <span
              className={clsx(
                "text-xs mt-1 font-medium whitespace-nowrap",
                currentStep >= step.id ? "text-blue-600" : "text-gray-400"
              )}
            >
              {step.label}
            </span>
          </div>
          {/* Connector line */}
          {index < steps.length - 1 && (
            <div
              className={clsx(
                "h-0.5 w-12 mx-1 mb-4 transition-colors duration-300",
                currentStep > step.id ? "bg-blue-600" : "bg-gray-200"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
