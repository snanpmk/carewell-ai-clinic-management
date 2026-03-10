"use client";

import { use } from "react";
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

  const acuteVisits = consultRes?.data || [];
  const chronicVisits = chronicRes || [];

  // Combine and sort visits logically by date
  const visits = [...acuteVisits, ...chronicVisits].sort((a, b) => {
    const dateA = new Date(a.consultationDate || a.createdAt || Date.now()).getTime();
    const dateB = new Date(b.consultationDate || b.createdAt || Date.now()).getTime();
    return dateB - dateA;
  });

  const { data: summaryRes, isLoading: summaryLoading } = useQuery({
    queryKey: ["patient-summary", patientId],
    queryFn: () => summarizeHistory(visits),
    enabled: visits.length > 0,
  });

  const isLoading = patientLoading || consultLoading || chronicLoading;
  const patient = patientRes?.data;
  const aiSummary = summaryRes?.data;

  const unifiedVisits: UnifiedVisitItem[] = visits.map((v: any) => {
    // If it has 'demographics', it's a chronic case
    if (v.demographics) {
      return {
        _id: v._id,
        isChronic: true,
        date: new Date(v.createdAt),
        chronicData: v as ChronicCase,
      };
    }
    return {
      _id: v._id,
      isChronic: false,
      date: new Date(v.consultationDate),
      symptoms: v.symptoms,
      diagnosis: v.diagnosis,
      doctorEditedNotes: v.doctorEditedNotes,
      aiGeneratedNotes: v.aiGeneratedNotes,
      additionalNotes: v.additionalNotes,
    };
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
      {/* Navigation & Header */}
      <PatientProfileHeader patientId={patientId} />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-24 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
          <p className="text-sm font-medium">Loading patient record...</p>
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
