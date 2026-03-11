import React, { forwardRef } from "react";
import { clsx } from "clsx";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  privacyBlur?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, id, options, placeholder, className, privacyBlur, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-2 relative">
        <label htmlFor={inputId} className="eyebrow ml-1">
          {label}
          {props.required && <span className="text-red-500 ml-1 font-bold">*</span>}
        </label>
        <div className={clsx("relative group transition-all", privacyBlur && "blur-sm select-none")}>
          <select
            id={inputId}
            ref={ref}
            className={clsx(
              "w-full rounded-2xl border-2 px-4 py-4 text-sm font-semibold text-slate-900 bg-white transition-all appearance-none cursor-pointer focus:outline-none focus:bg-white",
              error
                ? "border-red-400 bg-red-50 focus:border-red-500"
                : "border-slate-200 bg-white focus:border-brand-primary hover:border-slate-300",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option className="opacity-50" value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-brand-primary transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && <p className="text-[11px] font-semibold text-red-500 mt-1 uppercase tracking-wider">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";
