import React from "react";
import { clsx } from "clsx";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    
    const variants = {
      primary: "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30",
      secondary: "bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20",
      outline: "border-2 border-slate-300 bg-white hover:border-blue-500 hover:bg-slate-50 text-slate-700 hover:text-blue-600",
      ghost: "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-transparent",
    };

    const sizes = {
      sm: "h-9 px-4 text-xs rounded-xl",
      md: "h-11 px-6 text-sm rounded-xl",
      lg: "h-14 px-8 text-base rounded-2xl",
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={clsx(
          "inline-flex w-full items-center justify-center gap-2 font-black uppercase tracking-widest transition-all duration-300 active:scale-[0.98]",
          "disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 focus:outline-none focus:ring-4 focus:ring-blue-500/20",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
