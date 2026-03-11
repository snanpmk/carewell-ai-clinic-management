"use client";

import React, { forwardRef, useEffect, useRef, useImperativeHandle, useId } from "react";
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
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const generatedId = useId();
    
    // Merge local ref with forwarded ref
    useImperativeHandle(ref, () => textareaRef.current!);

    const adjustHeight = () => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    };

    useEffect(() => {
      adjustHeight();
    }, [props.value, props.defaultValue]);

    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : generatedId);
    
    return (
      <div className="flex flex-col gap-2 relative">
        {label && (
          <label htmlFor={inputId} className={clsx("eyebrow ml-1", labelClassName)}>
            {label}
            {props.required && <span className="text-red-500 ml-1 font-bold">*</span>}
          </label>
        )}
        <div className={clsx("relative transition-all", privacyBlur && "blur-sm select-none")}>
          <textarea
            id={inputId}
            ref={textareaRef}
            rows={props.rows || 1}
            onInput={(e) => {
              adjustHeight();
              props.onInput?.(e);
            }}
            className={clsx(
              "w-full rounded-2xl border-2 px-4 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-300 transition-all focus:outline-none focus:bg-white overflow-hidden resize-none",
              error
                ? "border-red-400 bg-red-50 focus:border-red-500"
                : "border-slate-200 bg-white focus:border-brand-primary hover:border-slate-300",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-[11px] font-semibold text-red-500 mt-1 uppercase tracking-wider">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
