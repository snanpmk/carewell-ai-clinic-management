"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";

interface PatientsToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredCount: number;
}

export function PatientsToolbar({ searchQuery, setSearchQuery, filteredCount }: PatientsToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white px-5 py-4 rounded-2xl border border-slate-200/60 shadow-sm">
      <div className="relative w-full sm:max-w-md">
        <Input 
          type="text" 
          placeholder="Search patients..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          className="py-3"
        />
      </div>
      <div className="text-[10px] font-bold text-slate-400 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 flex items-center gap-2 uppercase tracking-widest shrink-0">
        <span className="text-brand-primary">{filteredCount}</span> Patients Found
      </div>
    </div>
  );
}
