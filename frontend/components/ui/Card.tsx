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
        "bg-white rounded-2xl border border-gray-200 shadow-sm p-6",
        className
      )}
    >
      {children}
    </div>
  );
}
