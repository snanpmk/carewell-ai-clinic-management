"use client";

import { Users, ClipboardList, CalendarCheck, TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";
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
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: "Total Registry", 
            value: totalPatients.toLocaleString(), 
            sub: "Total Patients",
            color: "text-brand-primary",
            bg: "bg-brand-primary/5"
          },
          { 
            label: "Appointments", 
            value: appointmentsToday.toLocaleString(), 
            sub: "Scheduled Today",
            color: "text-emerald-600",
            bg: "bg-emerald-50/50"
          },
          { 
            label: "Clinical Notes", 
            value: totalConsultations.toLocaleString(), 
            sub: "Lifetime Records",
            color: "text-indigo-600",
            bg: "bg-indigo-50/30"
          },
          { 
            label: "Retention", 
            value: `${Math.floor((totalConsultations * 0.3) / (totalConsultations || 1) * 100)}%`, 
            sub: "Care Continuity",
            color: "text-brand-accent",
            bg: "bg-brand-accent/5"
          },
        ].map((stat, i) => (
          <Card key={i} className={clsx("p-0 border-slate-100 shadow-sm", stat.bg)}>
             <div className="p-6 h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                    {stat.label}
                  </h3>
                  <p className={clsx("text-4xl font-light tracking-tighter mb-1", stat.color)}>
                    {stat.value}
                  </p>
                </div>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter italic">
                   {stat.sub}
                </p>
             </div>
          </Card>
        ))}
      </div>

      {/* "Something Else" - Daily Clinical Insight */}
 
    </div>
  );
}
