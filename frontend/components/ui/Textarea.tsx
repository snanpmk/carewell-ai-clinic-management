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
      <div className="flex flex-col gap-2 relative">
        <label htmlFor={inputId} className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
          {label}
          {props.required && <span className="text-red-500 ml-1 font-bold">*</span>}
        </label>
        <textarea
          id={inputId}
          ref={ref}
          rows={props.rows || 3}
          className={clsx(
            "w-full rounded-2xl border-2 px-4 py-3 text-sm font-bold text-slate-900 placeholder:text-slate-300 resize-y transition-all focus:outline-none focus:bg-white",
            error
              ? "border-red-400 bg-red-50 focus:border-red-500"
              : "border-slate-200 bg-white focus:border-blue-500 hover:border-slate-300",
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
