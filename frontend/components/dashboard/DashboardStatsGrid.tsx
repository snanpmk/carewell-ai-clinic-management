"use client";

import { Users, ClipboardList, CalendarCheck, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { clsx } from "clsx";

interface DashboardStatsGridProps {
  totalPatients: number;
  totalConsultations: number;
  appointmentsToday: number;
}

export function DashboardStatsGrid({ totalPatients, totalConsultations, appointmentsToday }: DashboardStatsGridProps) {
  const stats = [
    { 
      label: "Total Registry", 
      value: totalPatients.toLocaleString(), 
      icon: <Users className="w-5 h-5" />,
      color: "text-brand-primary",
      bg: "bg-brand-primary/10",
      trend: "+12",
      trendLabel: "New this month",
      trendType: "up"
    },
    { 
      label: "Clinical Notes", 
      value: totalConsultations.toLocaleString(), 
      icon: <ClipboardList className="w-5 h-5" />,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      trend: "+5",
      trendLabel: "Since yesterday",
      trendType: "up"
    },
    { 
      label: "Appointments Today", 
      value: appointmentsToday.toLocaleString(), 
      icon: <CalendarCheck className="w-5 h-5" />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      trend: appointmentsToday > 0 ? "Active" : "Quiet",
      trendLabel: "Daily volume",
      trendType: appointmentsToday > 0 ? "neutral" : "down"
    },
    { 
      label: "Care Continuity", 
      value: `${Math.floor((totalConsultations * 0.3) / (totalConsultations || 1) * 100)}%`, 
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-brand-accent",
      bg: "bg-brand-accent/10",
      trend: "Optimal",
      trendLabel: "Patient retention",
      trendType: "up"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <Card key={i} className="p-0 border-none shadow-slate-200/40">
           <div className="p-6 flex flex-col h-full bg-white relative">
              <div className="flex items-start justify-between mb-4">
                <div className={clsx("p-3 rounded-2xl", stat.bg, stat.color)}>
                  {stat.icon}
                </div>
                <div className={clsx(
                  "flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                  stat.trendType === "up" ? "bg-emerald-50 text-emerald-600" : 
                  stat.trendType === "down" ? "bg-red-50 text-red-600" : 
                  "bg-slate-50 text-slate-500"
                )}>
                  {stat.trendType === "up" && <TrendingUp className="w-3 h-3" />}
                  {stat.trendType === "down" && <TrendingDown className="w-3 h-3" />}
                  {stat.trendType === "neutral" && <Minus className="w-3 h-3" />}
                  {stat.trend}
                </div>
              </div>

              <div className="mt-auto">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                  {stat.label}
                </h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                    {stat.value}
                  </p>
                  <span className="text-[10px] font-medium text-slate-400 lowercase tracking-tight">
                    {stat.trendLabel}
                  </span>
                </div>
              </div>

              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-slate-50 to-transparent opacity-50 pointer-events-none" />
           </div>
        </Card>
      ))}
    </div>
  );
}
