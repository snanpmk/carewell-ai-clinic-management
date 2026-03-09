import React, { forwardRef } from "react";
import { clsx } from "clsx";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, className, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <textarea
          id={inputId}
          ref={ref}
          rows={props.rows || 3}
          className={clsx(
            "w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 resize-y transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            error
              ? "border-red-400 bg-red-50"
              : "border-gray-300 bg-white hover:border-gray-400",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
