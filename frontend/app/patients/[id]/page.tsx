"use client";

import { use, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getPatient } from "@/services/patientService";
import { getConsultationsByPatient, summarizeHistory } from "@/services/consultationService";
import { getPatientChronicCases } from "@/services/chronicCaseService";
import { ChronicCase } from "@/types/chronicCase";

import { PatientProfileHeader } from "@/components/patients/profile/PatientProfileHeader";
import { PatientProfileInfoCard } from "@/components/patients/profile/PatientProfileInfoCard";
import { PatientProfileSummaryCard } from "@/components/patients/profile/PatientProfileSummaryCard";
import { PatientProfileTimeline, UnifiedVisitItem } from "@/components/patients/profile/PatientProfileTimeline";

export default function PatientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const patientId = unwrappedParams.id;
  
  const { data: patientRes, isLoading: patientLoading } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => getPatient(patientId),
  });

  const { data: consultRes, isLoading: consultLoading } = useQuery({
    queryKey: ["consultations", patientId],
    queryFn: () => getConsultationsByPatient(patientId),
  });

  const { data: chronicRes, isLoading: chronicLoading } = useQuery({
    queryKey: ["chronicCases", patientId],
    queryFn: () => getPatientChronicCases(patientId),
  });

  const visits = useMemo(() => {
    const acute = consultRes?.data || [];
    const chronic = chronicRes || [];
    return [...acute, ...chronic].sort((a, b) => {
      const dateA = new Date(a.consultationDate || a.createdAt || 0).getTime();
      const dateB = new Date(b.consultationDate || b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  }, [consultRes?.data, chronicRes]);

  const { data: summaryRes, isLoading: summaryLoading } = useQuery({
    queryKey: ["patient-summary", patientId],
    queryFn: () => summarizeHistory(visits),
    enabled: visits.length > 0,
  });

  const isLoading = patientLoading || consultLoading || chronicLoading;
  const patient = patientRes?.data;
  const aiSummary = summaryRes?.data;

  const unifiedVisits: UnifiedVisitItem[] = visits.map((v: Record<string, unknown>) => {
    // If it has 'demographics', it's a chronic case
    if (v.demographics) {
      return {
        _id: v._id as string,
        isChronic: true,
        date: new Date(v.createdAt as string),
        chronicData: v as unknown as ChronicCase,
      };
    }
    return {
      _id: v._id as string,
      isChronic: false,
      date: new Date(v.consultationDate as string),
      symptoms: v.symptoms as string,
      diagnosis: v.diagnosis as string,
      prescription: v.prescription as string,
      doctorEditedNotes: v.doctorEditedNotes as Record<string, unknown>,
      aiGeneratedNotes: v.aiGeneratedNotes as Record<string, unknown>,
      additionalNotes: v.additionalNotes as string,
    };
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both px-4 md:px-0">
      {/* Navigation & Header */}
      <PatientProfileHeader patientId={patientId} />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-24 text-slate-400">
          <p className="eyebrow animate-pulse">Syncing patient record...</p>
        </div>
      ) : !patient ? (
        <div className="text-center py-24 text-slate-500 bg-white border border-slate-200 rounded-3xl shadow-sm">
          Patient not found or could not evaluate data.
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Left Column - Info & AI Summary */}
          <div className="xl:col-span-4 space-y-6">
            <PatientProfileInfoCard patient={patient} />
            <PatientProfileSummaryCard 
              visitsCount={visits.length}
              summaryLoading={summaryLoading}
              aiSummary={aiSummary}
            />
          </div>

          {/* Right Column - Visit History */}
          <div className="xl:col-span-8">
            <PatientProfileTimeline visits={unifiedVisits} />
          </div>
        </div>
      )}
    </div>
  );
}
