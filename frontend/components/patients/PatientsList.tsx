"use client";

import Link from "next/link";
import { Users, ChevronRight } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { clsx } from "clsx";

export interface PatientItem {
  _id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email?: string;
}

interface PatientsListProps {
  patients: PatientItem[];
}

export function PatientsList({ patients }: PatientsListProps) {
  const { privacyMode } = useUIStore();

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden text-sm">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto p-4">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 eyebrow">Name</th>
              <th className="px-6 py-4 eyebrow">Profile</th>
              <th className="px-6 py-4 eyebrow">Contact</th>
              <th className="px-6 py-4 eyebrow text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {patients.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-24 text-center text-slate-500">
                  <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="font-black text-slate-900 uppercase tracking-widest text-xs">No patients found</p>
                  <p className="text-xs text-slate-400 mt-2">Try adjusting your search criteria</p>
                </td>
              </tr>
            ) : (
              patients.map((patient) => (
                <tr key={patient._id} className="hover:bg-slate-50/50 transition-all duration-300 group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-brand-primary to-brand-accent text-white flex items-center justify-center font-black shadow-lg shadow-brand-primary/20 shrink-0 text-lg">
                        {patient.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div>
                        <Link href={`/patients/${patient._id}`} className={clsx(
                          "font-black text-slate-900 tracking-tight group-hover:text-brand-primary transition-all text-base uppercase",
                          privacyMode && "blur-sm select-none"
                        )}>
                          {patient.name}
                        </Link>
                        <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">ID: {patient._id?.substring(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                      {patient.age} YRS • {patient.gender}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <p className={clsx("text-slate-900 font-bold tracking-tight", privacyMode && "blur-sm select-none")}>{patient.phone}</p>
                    {patient.email && <p className={clsx("text-xs text-slate-400 mt-1 font-medium", privacyMode && "blur-sm select-none")}>{patient.email}</p>}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link 
                      href={`/patients/${patient._id}`}
                      className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-brand-primary hover:bg-brand-primary/5 transition-all border border-slate-200 hover:border-brand-primary/30"
                    >
                      View Profile
                      <ChevronRight className="w-4 h-4 ml-1.5 opacity-60 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile List View */}
      <div className="md:hidden divide-y divide-slate-100">
        {patients.length === 0 ? (
           <div className="py-24 text-center text-slate-500 px-6">
             <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
             <p className="text-xs font-black uppercase tracking-widest">No patients found</p>
           </div>
        ) : (
          patients.map((patient) => (
            <Link 
              key={patient._id}
              href={`/patients/${patient._id}`}
              className="flex flex-col p-6 hover:bg-slate-50 transition-all active:bg-slate-100 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-brand-primary to-brand-accent text-white flex items-center justify-center font-black shadow-xl shadow-brand-primary/20 shrink-0 text-xl">
                  {patient.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={clsx(
                    "text-lg font-black text-slate-900 truncate tracking-tight group-hover:text-brand-primary transition-all uppercase",
                    privacyMode && "blur-sm select-none"
                  )}>{patient.name}</h4>
                  <div className="flex items-center gap-2 mt-1 px-3 py-1 w-max rounded-lg bg-brand-primary/10 text-[10px] font-black uppercase tracking-widest text-brand-primary">
                    <span>{patient.age} YRS</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary/30" />
                    <span>{patient.gender}</span>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-300 group-hover:translate-x-1 transition-transform group-hover:text-brand-primary" />
              </div>
              <div className="mt-5 text-sm flex flex-col gap-1 border-t border-slate-100 pt-4">
                <span className={clsx("font-black text-slate-900 tracking-tight", privacyMode && "blur-sm select-none")}>{patient.phone}</span>
                {patient.email && <span className={clsx("text-xs text-slate-400 font-medium truncate", privacyMode && "blur-sm select-none")}>{patient.email}</span>}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
