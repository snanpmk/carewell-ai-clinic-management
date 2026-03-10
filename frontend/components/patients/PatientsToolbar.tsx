"use client";

import { Search } from "lucide-react";

interface PatientsToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredCount: number;
}

export function PatientsToolbar({ searchQuery, setSearchQuery, filteredCount }: PatientsToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/60 backdrop-blur-xl px-4 py-3 rounded-2xl border border-slate-200/80 shadow-sm shadow-slate-200/40">
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        <input 
          type="text" 
          placeholder="Search patients by name, phone, or ID..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-white transition-all shadow-xs placeholder:text-slate-400"
        />
      </div>
      <div className="text-sm font-medium text-slate-500 bg-slate-100/50 px-3 py-1.5 rounded-lg border border-slate-200/50">
        <span className="font-bold text-slate-900">{filteredCount}</span> patient{filteredCount !== 1 && 's'}
      </div>
    </div>
  );
}
