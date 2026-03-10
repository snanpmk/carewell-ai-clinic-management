"use client";

import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllConsultations } from "@/services/consultationService";
import { getAllPatients } from "@/services/patientService";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStatsGrid } from "@/components/dashboard/DashboardStatsGrid";
import { DashboardRecentActivity, DashboardConsultationItem } from "@/components/dashboard/DashboardRecentActivity";

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
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
      ) : (
        <>
          <DashboardStatsGrid 
            totalPatients={totalPatients}
            totalConsultations={totalConsultations}
            appointmentsToday={appointmentsToday}
          />
          <DashboardRecentActivity 
            recentConsultations={recentConsultations}
          />
        </>
      )}
    </div>
  );
}
