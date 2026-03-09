"use client";

import Link from "next/link";
import { Users, FileText, Activity, Clock, Plus, ChevronRight, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllConsultations } from "@/services/consultationService";
import { getAllPatients } from "@/services/patientService";

export default function DashboardPage() {
  const { data: consultationsRes, isLoading: isLoadingConsultations } = useQuery({
    queryKey: ["consultations"],
    queryFn: getAllConsultations,
  });

  const { data: patientsRes, isLoading: isLoadingPatients } = useQuery({
    queryKey: ["patients"],
    queryFn: getAllPatients,
  });

  const isLoading = isLoadingConsultations || isLoadingPatients;

  // Basic stats
  interface ConsultationItem {
    _id: string;
    consultationDate: string;
    symptoms: string;
    patientId?: {
      _id: string;
      name: string;
    };
  }

  const allConsultations = (consultationsRes?.data as ConsultationItem[]) || [];
  const totalConsultations = allConsultations.length;
  const totalPatients = patientsRes?.data?.length || 0;

  // Calculate today's appointments
  let appointmentsToday = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  allConsultations.forEach((apt: ConsultationItem) => {
    const aptDate = new Date(apt.consultationDate);
    if (aptDate >= today) {
      appointmentsToday++;
    }
  });

  // Recent 5 consultations for upcoming
  const recentConsultations = allConsultations.slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium italic">{"Here's your clinic overview for today."}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/onboarding"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-white border-2 border-slate-100 px-5 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            New Patient
          </Link>
          <Link
            href="/consultation"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            New Consultation
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Total Patients", value: totalPatients.toString(), icon: Users, color: "text-emerald-600", bg: "bg-emerald-100/40", border: "border-emerald-100" },
              { label: "Total Consultations", value: totalConsultations.toString(), icon: FileText, color: "text-purple-600", bg: "bg-purple-100/40", border: "border-purple-100" },
              { label: "Appointments Today", value: appointmentsToday.toString(), icon: Clock, color: "text-blue-600", bg: "bg-blue-100/40", border: "border-blue-100" },
              { label: "Follow-ups", value: Math.floor(totalConsultations * 0.3).toString(), icon: Activity, color: "text-amber-600", bg: "bg-amber-100/40", border: "border-amber-100" },
            ].map((stat, i) => (
              <div key={i} className={`bg-white rounded-2xl border ${stat.border} p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-slate-50 to-transparent rounded-bl-full z-0 opacity-50 group-hover:scale-110 transition-transform" />
                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</h3>
                </div>
                <p className="text-4xl font-black text-slate-900 relative z-10">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-200 flex justify-between items-center bg-linear-to-r from-slate-50 to-white">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                 <Clock className="w-5 h-5 text-blue-500" /> Recent Consultations
              </h2>
              <Link href="/appointments" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group">
                View All Records <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {recentConsultations.length === 0 ? (
                 <div className="p-12 text-center text-slate-400 font-medium">No recent consultations found.</div>
              ) : (
                recentConsultations.map((apt: ConsultationItem) => (
                  <div key={apt._id} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50/80 transition-all group">
                    <div className="flex items-center gap-8">
                      <div className="text-center min-w-[80px]">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">
                          {new Date(apt.consultationDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-[10px] font-bold text-slate-300">
                          {new Date(apt.consultationDate).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="h-10 w-px bg-slate-100" />
                      <div>
                        <p className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{apt.patientId?.name || "Unknown Patient"}</p>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1 max-w-md italic">&quot;{apt.symptoms}&quot;</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100`}>
                        Record
                      </span>
                      <Link
                        href={`/patients/${apt.patientId?._id}`}
                        className="text-sm font-bold text-slate-400 hover:text-blue-600 border border-slate-200 px-4 py-2 rounded-lg hover:border-blue-200 hover:bg-white transition-all shadow-sm"
                      >
                        Profile
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
