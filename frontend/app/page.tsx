"use client";

import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllConsultations } from "@/services/consultationService";
import { getAllPatients } from "@/services/patientService";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStatsGrid } from "@/components/dashboard/DashboardStatsGrid";
import { DashboardCalendar } from "@/components/dashboard/DashboardCalendar";
import { DashboardRecentActivity, DashboardConsultationItem } from "@/components/dashboard/DashboardRecentActivity";
import { useAuthStore } from "@/store/useAuthStore";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const isStaff = user?.role === "staff";
  const { data: consultationsRes, isLoading: isLoadingConsultations } = useQuery({
    queryKey: ["consultations"],
    queryFn: getAllConsultations,
  });

  const { data: patientsRes, isLoading: isLoadingPatients } = useQuery({
    queryKey: ["patients"],
    queryFn: getAllPatients,
  });

  const isLoading = isLoadingConsultations || isLoadingPatients;

  const allConsultations = (consultationsRes?.data as DashboardConsultationItem[]) || [];
  const totalConsultations = allConsultations.length;
  const totalPatients = patientsRes?.data?.length || 0;

  // Calculate today's appointments
  let appointmentsToday = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  allConsultations.forEach((apt) => {
    const aptDate = new Date(apt.consultationDate);
    if (aptDate >= today) {
      appointmentsToday++;
    }
  });

  // Recent 5 consultations
  const recentConsultations = allConsultations.slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
      <DashboardHeader />

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
        </div>
      ) : (
        <>
          <DashboardStatsGrid 
            totalPatients={totalPatients}
            totalConsultations={totalConsultations}
            appointmentsToday={appointmentsToday}
          />
          {isStaff ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 shadow-sm text-center space-y-6">
               <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mx-auto">
                  <Loader2 className="w-8 h-8 animate-spin" />
               </div>
               <div className="max-w-md mx-auto">
                  <h2 className="text-2xl font-light text-slate-900 tracking-tight">Reception <span className="font-semibold text-brand-primary">Terminal</span></h2>
                  <p className="text-slate-500 mt-2">Clinical feeds and insights are restricted to practitioners. Please use the Patient Registry to manage appointments and check-ins.</p>
               </div>
            </div>
          ) : (
            <>
              <DashboardCalendar consultations={allConsultations} />
              <DashboardRecentActivity 
                recentConsultations={recentConsultations}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
