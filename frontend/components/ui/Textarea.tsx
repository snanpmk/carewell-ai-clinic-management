import React, { forwardRef } from "react";
import { clsx } from "clsx";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  privacyBlur?: boolean;
  labelClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, className, privacyBlur, labelClassName, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-2 relative">
        <label htmlFor={inputId} className={clsx("eyebrow ml-1", labelClassName)}>
          {label}
          {props.required && <span className="text-red-500 ml-1 font-bold">*</span>}
        </label>
        <div className={clsx("relative transition-all", privacyBlur && "blur-sm select-none")}>
          <textarea
            id={inputId}
            ref={ref}
            rows={props.rows || 3}
            className={clsx(
              "w-full rounded-2xl border-2 px-4 py-3 text-sm font-bold text-slate-900 placeholder:text-slate-300 resize-y transition-all focus:outline-none focus:bg-white",
              error
                ? "border-red-400 bg-red-50 focus:border-red-500"
                : "border-slate-200 bg-white focus:border-brand-primary hover:border-slate-300",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
