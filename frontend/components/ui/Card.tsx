import React from "react";
import { clsx } from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={clsx(
        "bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  );
}
