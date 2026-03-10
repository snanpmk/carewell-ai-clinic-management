"use client";

import { User, Phone, Activity } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { clsx } from "clsx";

interface PatientContent {
  name: string;
  age: number;
  gender: string;
  phone: string;
  address?: string;
}

interface PatientProfileInfoCardProps {
  patient: PatientContent;
}

export function PatientProfileInfoCard({ patient }: PatientProfileInfoCardProps) {
  const { privacyMode } = useUIStore();

  return (
    <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-3xl p-8 shadow-xl shadow-slate-200/50 text-center relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500" />
      <div className="w-24 h-24 mx-auto bg-linear-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mb-6 border-[3px] border-white shadow-xl shadow-blue-500/30 rotate-3 group-hover:rotate-0 transition-all duration-300">
        <span className="text-4xl font-black text-white">{patient.name.charAt(0).toUpperCase()}</span>
      </div>
      <h2 className={clsx(
        "text-2xl font-black text-slate-900 tracking-tight transition-all",
        privacyMode && "blur-md select-none"
      )}>{patient.name}</h2>
      
      <div className="mt-8 space-y-4 text-left border-t border-slate-100 pt-6">
        <div className="flex items-center gap-4 text-sm group/item">
          <div className="p-2.5 bg-blue-50 rounded-xl text-blue-500 group-hover/item:bg-blue-100 group-hover/item:text-blue-600 transition-colors">
            <User className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Demographics</p>
            <p className="font-bold text-slate-800 tracking-tight">{patient.age} years / {patient.gender}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm group/item">
          <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-500 group-hover/item:bg-emerald-100 group-hover/item:text-emerald-600 transition-colors">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Contact</p>
            <p className={clsx("font-bold text-slate-800 tracking-tight transition-all", privacyMode && "blur-sm select-none")}>{patient.phone}</p>
          </div>
        </div>
        
        {patient.address && (
          <div className="flex items-center gap-4 text-sm group/item">
            <div className="p-2.5 bg-amber-50 rounded-xl text-amber-500 group-hover/item:bg-amber-100 group-hover/item:text-amber-600 transition-colors">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Residence</p>
              <p className={clsx("font-bold text-slate-800 tracking-tight text-balance leading-tight transition-all", privacyMode && "blur-sm select-none")}>{patient.address}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
