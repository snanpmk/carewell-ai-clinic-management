"use client";

import { User, Phone, MapPin } from "lucide-react";
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
    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/50 text-center relative overflow-hidden group transition-all duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-brand-primary/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-700" />
      
      <div className="relative w-28 h-28 mx-auto mb-6 group-hover:scale-105 transition-transform duration-500">
        <div className="absolute -inset-1.5 bg-linear-to-tr from-brand-primary to-brand-accent rounded-[2rem] opacity-25 blur-sm group-hover:opacity-40 transition-opacity" />
        <div className="relative w-28 h-28 bg-linear-to-br from-brand-primary to-brand-accent rounded-[2rem] flex items-center justify-center border-4 border-white shadow-2xl shadow-brand-primary/20 rotate-3 group-hover:rotate-0 transition-all duration-500">
          <span className="text-4xl font-black text-white italic drop-shadow-sm">{patient.name.charAt(0).toUpperCase()}</span>
        </div>
      </div>

      <h2 className={clsx(
        "text-2xl font-black text-slate-900 tracking-tight transition-all uppercase",
        privacyMode && "blur-md select-none"
      )}>{patient.name}</h2>
      
      <div className="mt-8 space-y-5 text-left border-t border-slate-100 pt-8">
        <div className="flex items-center gap-4 text-sm group/item">
          <div className="p-3 bg-brand-primary/5 rounded-2xl text-brand-primary group-hover/item:bg-brand-primary/10 transition-colors">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="eyebrow leading-none mb-1.5">Demographics</p>
            <p className="font-black text-slate-800 tracking-tight text-base uppercase">{patient.age} YRS / {patient.gender}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm group/item">
          <div className="p-3 bg-slate-100 rounded-2xl text-slate-500 group-hover/item:bg-slate-200 transition-colors">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <p className="eyebrow leading-none mb-1.5">Contact</p>
            <p className={clsx("font-black text-slate-800 tracking-tight text-base transition-all uppercase", privacyMode && "blur-sm select-none")}>{patient.phone}</p>
          </div>
        </div>
        
        {patient.address && (
          <div className="flex items-center gap-4 text-sm group/item">
            <div className="p-3 bg-slate-100 rounded-2xl text-slate-500 group-hover/item:bg-slate-200 transition-colors">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="eyebrow leading-none mb-1.5">Residence</p>
              <p className={clsx("font-black text-slate-800 tracking-tight text-sm text-balance leading-tight transition-all uppercase", privacyMode && "blur-sm select-none")}>{patient.address}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
