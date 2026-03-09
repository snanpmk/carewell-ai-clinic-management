"use client";

import { Users, Search, ChevronRight, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getAllPatients } from "@/services/patientService";

export default function PatientsPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: getAllPatients,
  });

  const patients = response?.data || [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="p-2 bg-blue-100 rounded-xl"><Users className="w-6 h-6 text-blue-600" /></div>
             Patients
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Manage and review your clinic's patient database.</p>
        </div>
        <Link
          href="/onboarding"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Register New Patient
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="bg-white p-4 lg:p-6 border-2 border-slate-100 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search by name, ID, or phone..." 
                className="w-full pl-11 pr-4 py-3 text-sm border-2 border-slate-50 rounded-xl focus:outline-none focus:border-blue-500 bg-slate-50/50 focus:bg-white transition-all font-bold text-slate-700"
              />
            </div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100 italic">
              {patients.length} Total Patients
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block bg-white border-2 border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                    <th className="px-8 py-5">Identity</th>
                    <th className="px-8 py-5">Clinical Info</th>
                    <th className="px-8 py-5">Contact Details</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {patients.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-24 text-center">
                        <div className="flex flex-col items-center gap-2 opacity-30">
                          <Users className="w-12 h-12" />
                          <p className="font-black uppercase tracking-[0.3em] text-xs">No Records Found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    patients.map((patient: any) => (
                      <tr key={patient._id} className="hover:bg-blue-50/30 transition-all group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shrink-0 border-2 border-slate-800 shadow-lg group-hover:scale-110 transition-transform">
                              <span className="text-lg font-black text-white italic">{patient.name?.charAt(0) || "?"}</span>
                            </div>
                            <div>
                              <Link href={`/patients/${patient._id}`} className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                {patient.name}
                              </Link>
                              <p className="text-[10px] font-bold text-slate-400 tracking-tighter mt-1 italic opacity-60">ID: {patient._id?.substring(0, 8)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col gap-1.5">
                            <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100 w-fit">
                              {patient.age}Y • {patient.gender}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-sm font-black text-slate-700 font-mono tracking-tighter">{patient.phone}</p>
                          <p className="text-[10px] font-bold text-slate-400 truncate max-w-[160px] opacity-60 mt-1">{patient.email || "NO EMAIL PROVIDED"}</p>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <Link 
                            href={`/patients/${patient._id}`}
                            className="inline-flex items-center justify-center bg-slate-900 px-5 py-2.5 rounded-xl text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 hover:shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                          >
                            Details <ChevronRight className="w-3.5 h-3.5 ml-1" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card List */}
          <div className="lg:hidden space-y-4">
            {patients.length === 0 ? (
               <div className="bg-white rounded-3xl p-16 text-center border-2 border-slate-100 font-black uppercase tracking-widest text-slate-300">
                Empty Database
               </div>
            ) : (
              patients.map((patient: any) => (
                <Link 
                  key={patient._id}
                  href={`/patients/${patient._id}`}
                  className="block bg-white border-2 border-slate-50 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-200">
                      <span className="text-lg font-black text-white italic">{patient.name?.charAt(0) || "?"}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-black text-slate-900 uppercase tracking-tight truncate">{patient.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{patient.gender}</span>
                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{patient.age}Y</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                    <span className="text-xs font-black text-slate-700 font-mono tracking-tight">{patient.phone}</span>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">View Profile</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
