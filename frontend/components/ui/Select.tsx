import React, { forwardRef } from "react";
import { clsx } from "clsx";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, id, options, placeholder, className, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
          id={inputId}
          ref={ref}
          className={clsx(
            "w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 bg-white transition-colors appearance-none cursor-pointer",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            error
              ? "border-red-400 bg-red-50"
              : "border-gray-300 hover:border-gray-400",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";
