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
    <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden text-sm">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto p-2">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-5 py-3.5 font-semibold text-slate-600 tracking-wide text-xs uppercase">Name</th>
              <th className="px-5 py-3.5 font-semibold text-slate-600 tracking-wide text-xs uppercase">Profile</th>
              <th className="px-5 py-3.5 font-semibold text-slate-600 tracking-wide text-xs uppercase">Contact</th>
              <th className="px-5 py-3.5 font-semibold text-slate-600 tracking-wide text-xs uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {patients.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-20 text-center text-slate-500">
                  <Users className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                  <p className="font-medium">No patients found</p>
                  <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria</p>
                </td>
              </tr>
            ) : (
              patients.map((patient) => (
                <tr key={patient._id} className="hover:bg-slate-50/80 transition-all duration-300 group rounded-2xl">
                  <td className="px-5 py-5 rounded-l-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-500/30 shrink-0">
                        {patient.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div>
                        <Link href={`/patients/${patient._id}`} className={clsx(
                          "font-bold text-slate-800 tracking-tight group-hover:text-blue-600 focus:text-blue-600 transition-all text-base",
                          privacyMode && "blur-sm select-none"
                        )}>
                          {patient.name}
                        </Link>
                        <p className="text-[11px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">ID: {patient._id?.substring(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500">
                      {patient.age} yrs • {patient.gender}
                    </span>
                  </td>
                  <td className="px-5 py-5">
                    <p className={clsx("text-slate-700 font-bold", privacyMode && "blur-sm select-none")}>{patient.phone}</p>
                    {patient.email && <p className={clsx("text-xs text-slate-400 mt-0.5", privacyMode && "blur-sm select-none")}>{patient.email}</p>}
                  </td>
                  <td className="px-5 py-5 text-right rounded-r-2xl">
                    <Link 
                      href={`/patients/${patient._id}`}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all group-hover:shadow-xs group-hover:bg-white border border-transparent group-hover:border-slate-200"
                    >
                      View Profile
                      <ChevronRight className="w-4 h-4 ml-1 opacity-60 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
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
           <div className="py-20 text-center text-slate-500">
             <Users className="w-8 h-8 text-slate-300 mx-auto mb-3" />
             <p className="text-sm font-medium">No patients found</p>
           </div>
        ) : (
          patients.map((patient) => (
            <Link 
              key={patient._id}
              href={`/patients/${patient._id}`}
              className="flex flex-col p-5 hover:bg-slate-50 transition-all active:bg-slate-100 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-500/30 shrink-0 text-lg">
                  {patient.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={clsx(
                    "text-base font-bold text-slate-900 truncate tracking-tight group-hover:text-blue-600 transition-all",
                    privacyMode && "blur-sm select-none"
                  )}>{patient.name}</h4>
                  <div className="flex items-center gap-2 mt-1 px-2 py-0.5 w-max rounded-md bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <span>{patient.age} yrs</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span>{patient.gender}</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform group-hover:text-blue-600" />
              </div>
              <div className="mt-4 md:ml-16 sm:ml-16 xs:ml-0 text-sm flex flex-col gap-1 border-t border-slate-100 pt-3">
                <span className={clsx("font-bold text-slate-700", privacyMode && "blur-sm select-none")}>{patient.phone}</span>
                {patient.email && <span className={clsx("text-xs text-slate-400 truncate", privacyMode && "blur-sm select-none")}>{patient.email}</span>}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
