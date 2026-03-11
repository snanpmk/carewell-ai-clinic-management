import React from "react";
import { clsx } from "clsx";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, leftIcon, rightIcon, children, disabled, fullWidth = false, ...props }, ref) => {
    
    const variants = {
      primary: "bg-linear-to-r from-brand-primary to-brand-accent hover:from-brand-primary/90 hover:to-brand-accent/90 text-white shadow-lg shadow-brand-primary/30",
      secondary: "bg-linear-to-r from-brand-secondary to-slate-800 hover:from-brand-secondary/90 hover:to-slate-700 text-white shadow-lg shadow-brand-secondary/20",
      outline: "border-2 border-slate-300 bg-white hover:border-brand-primary hover:bg-slate-50 text-slate-700 hover:text-brand-primary",
      ghost: "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-transparent",
    };

    const sizes = {
      sm: "h-9 px-4 text-[11px] rounded-lg",
      md: "h-11 px-6 text-sm rounded-xl",
      lg: "h-14 px-8 text-base rounded-2xl",
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={clsx(
          "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 active:scale-[0.98]",
          fullWidth ? "w-full" : "w-auto min-w-[120px]",
          "disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 focus:outline-none focus:ring-4 focus:ring-brand-primary/20",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
