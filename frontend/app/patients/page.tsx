"use client";

import { useState } from "react";
import { Users, Search, ChevronRight, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getAllPatients } from "@/services/patientService";

interface PatientItem {
  _id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email?: string;
}

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: response, isLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: getAllPatients,
  });

  const patients = response?.data || [];

  const filteredPatients = patients.filter((patient: PatientItem) => {
    const query = searchQuery.toLowerCase();
    return (
      (patient?.name || "").toLowerCase().includes(query) ||
      (patient?.phone || "").includes(query) ||
      (patient?._id || "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Patients</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your clinic's patient records and contact details.
          </p>
        </div>
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500/20 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Add Patient
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mb-4" />
          <p className="text-sm font-medium">Loading patients...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search patients..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 bg-white transition-all shadow-sm"
              />
            </div>
            <div className="text-sm text-slate-500">
              <span className="font-medium text-slate-900">{filteredPatients.length}</span> patient{filteredPatients.length !== 1 && 's'}
            </div>
          </div>

          {/* Data List Container */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50/50 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5 font-medium text-slate-500">Name</th>
                    <th className="px-5 py-3.5 font-medium text-slate-500">Profile</th>
                    <th className="px-5 py-3.5 font-medium text-slate-500">Contact</th>
                    <th className="px-5 py-3.5 font-medium text-slate-500 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPatients.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-20 text-center text-slate-500">
                        <Users className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                        <p className="font-medium">No patients found</p>
                        <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria</p>
                      </td>
                    </tr>
                  ) : (
                    filteredPatients.map((patient: PatientItem) => (
                      <tr key={patient._id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-medium shadow-sm border border-blue-100 shrink-0">
                              {patient.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <div>
                              <Link href={`/patients/${patient._id}`} className="font-medium text-slate-900 group-hover:text-blue-600 focus:text-blue-600 transition-colors">
                                {patient.name}
                              </Link>
                              <p className="text-[11px] text-slate-400 mt-0.5">ID: {patient._id?.substring(0, 8)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600">
                            {patient.age} yrs • {patient.gender}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-slate-700">{patient.phone}</p>
                          {patient.email && <p className="text-xs text-slate-400 mt-0.5">{patient.email}</p>}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Link 
                            href={`/patients/${patient._id}`}
                            className="inline-flex items-center justify-center px-3 py-1.5 rounded-md text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          >
                            View
                            <ChevronRight className="w-4 h-4 ml-1 opacity-60" />
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
              {filteredPatients.length === 0 ? (
                 <div className="py-20 text-center text-slate-500">
                   <Users className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                   <p className="text-sm font-medium">No patients found</p>
                 </div>
              ) : (
                filteredPatients.map((patient: PatientItem) => (
                  <Link 
                    key={patient._id}
                    href={`/patients/${patient._id}`}
                    className="flex flex-col p-4 hover:bg-slate-50 transition-colors active:bg-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-medium shrink-0">
                        {patient.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-slate-900 truncate">{patient.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                          <span>{patient.age} yrs</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span>{patient.gender}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                    </div>
                    <div className="mt-3 ml-12 text-sm text-slate-600 flex flex-col gap-1">
                      <span>{patient.phone}</span>
                      {patient.email && <span className="text-xs text-slate-400 truncate">{patient.email}</span>}
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
