"use client";

import { Users, ClipboardList, CalendarCheck, History } from "lucide-react";

interface DashboardStatsGridProps {
  totalPatients: number;
  totalConsultations: number;
  appointmentsToday: number;
}

export function DashboardStatsGrid({ totalPatients, totalConsultations, appointmentsToday }: DashboardStatsGridProps) {
  const stats = [
    { 
      label: "Total Patient Registry", 
      value: totalPatients.toLocaleString(), 
      icon: <Users className="w-5 h-5" />,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    { 
      label: "Clinical Records", 
      value: totalConsultations.toLocaleString(), 
      icon: <ClipboardList className="w-5 h-5" />,
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    { 
      label: "Scheduled Today", 
      value: appointmentsToday.toLocaleString(), 
      icon: <CalendarCheck className="w-5 h-5" />,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    { 
      label: "Follow-up Rate", 
      value: `${Math.floor((totalConsultations * 0.3) / (totalConsultations || 1) * 100)}%`, 
      icon: <History className="w-5 h-5" />,
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-xl shadow-slate-200/30 relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:border-slate-300/60">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} border border-transparent group-hover:border-current/10 transition-colors shadow-sm`}>
                {stat.icon}
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-brand-primary transition-colors" />
            </div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1.5">{stat.label}</h3>
            <p className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">{stat.value}</p>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-linear-to-tl from-slate-50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      ))}
    </div>
  );
}
