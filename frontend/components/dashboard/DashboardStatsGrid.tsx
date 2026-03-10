"use client";

import { Users, FileText, Clock, Activity } from "lucide-react";

interface DashboardStatsGridProps {
  totalPatients: number;
  totalConsultations: number;
  appointmentsToday: number;
}

export function DashboardStatsGrid({ totalPatients, totalConsultations, appointmentsToday }: DashboardStatsGridProps) {
  const stats = [
    { label: "Total Patients", value: totalPatients.toString(), icon: Users, color: "text-emerald-600", bg: "bg-emerald-100/40", border: "border-emerald-100" },
    { label: "Total Consultations", value: totalConsultations.toString(), icon: FileText, color: "text-purple-600", bg: "bg-purple-100/40", border: "border-purple-100" },
    { label: "Appointments Today", value: appointmentsToday.toString(), icon: Clock, color: "text-blue-600", bg: "bg-blue-100/40", border: "border-blue-100" },
    { label: "Follow-ups", value: Math.floor(totalConsultations * 0.3).toString(), icon: Activity, color: "text-amber-600", bg: "bg-amber-100/40", border: "border-amber-100" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
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
  );
}
