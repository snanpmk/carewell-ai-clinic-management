import React, { forwardRef } from "react";
import { clsx } from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  leftIcon?: React.ReactNode;
  privacyBlur?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, id, className, privacyBlur, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-2 relative">
        <label htmlFor={inputId} className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
          {label}
        </label>
        <div className={clsx("relative group transition-all", privacyBlur && "blur-sm select-none")}>
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={clsx(
              "w-full rounded-2xl border-2 py-4 pr-4 text-sm font-bold text-slate-900 transition-all focus:outline-none focus:bg-white placeholder:text-slate-300",
              leftIcon ? "pl-12" : "pl-4",
              error
                ? "border-red-400 bg-red-50 focus:border-red-500"
                : "border-slate-200 bg-white focus:border-brand-primary hover:border-slate-300",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs font-bold text-red-500 ml-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
