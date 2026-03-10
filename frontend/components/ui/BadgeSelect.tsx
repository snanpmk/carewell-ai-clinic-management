"use client";

import { clsx } from "clsx";
import { Plus, X } from "lucide-react";

interface BadgeSelectProps {
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  label?: string;
  maxSelected?: number;
}

export function BadgeSelect({ options, selectedValues, onChange, label, maxSelected }: BadgeSelectProps) {
  const toggleOption = (option: string) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter((v) => v !== option));
    } else {
      if (maxSelected && selectedValues.length >= maxSelected) return;
      onChange([...selectedValues, option]);
    }
  };

  return (
    <div className="space-y-3">
      {label && <label className="eyebrow ml-1">{label}</label>}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleOption(option)}
              className={clsx(
                "px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border",
                isSelected
                  ? "bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/20 scale-105"
                  : "bg-white border-slate-200 text-slate-500 hover:border-brand-primary/30 hover:bg-slate-50"
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
