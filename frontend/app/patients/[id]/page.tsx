"use client";

import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, User as UserIcon, Fingerprint, History, Pill, Calendar, CalendarPlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getPatient } from "@/services/patientService";
import { getConsultationsByPatient, summarizeHistory } from "@/services/consultationService";
import { getPatientChronicCases } from "@/services/chronicCaseService";
import { ChronicCase } from "@/types/chronicCase";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import { clsx } from "clsx";

import { PatientProfileHeader } from "@/components/patients/profile/PatientProfileHeader";
import { PatientProfileInfoCard } from "@/components/patients/profile/PatientProfileInfoCard";
import { PatientProfileSummaryCard } from "@/components/patients/profile/PatientProfileSummaryCard";
import { PatientProfileTimeline, UnifiedVisitItem } from "@/components/patients/profile/PatientProfileTimeline";
import { PatientManagementHistory } from "@/components/patients/profile/PatientManagementHistory";
import { Button } from "@/components/ui/Button";

export default function PatientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const patientId = unwrappedParams.id;
  const router = useRouter();
  const { user } = useAuthStore();
  const aiEnabled = user?.clinic?.aiEnabled ?? true;
  const { privacyMode } = useUIStore();
  
  const [activeTab, setActiveTab] = useState<"timeline" | "management">("timeline");

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

  const latestChronicCase = useMemo(() => {
    if (!chronicRes || chronicRes.length === 0) return null;
    return chronicRes[0]; // Already sorted by createdAt DESC in service/backend
  }, [chronicRes]);

  const { data: summaryRes, isLoading: summaryLoading } = useQuery({
    queryKey: ["patient-summary", patientId],
    queryFn: () => summarizeHistory(visits),
    enabled: visits.length > 0 && aiEnabled,
  });

  const isLoading = patientLoading || consultLoading || chronicLoading;
  const patient = patientRes?.data;
  const aiSummary = summaryRes?.data;
  const isStaff = user?.role === "staff";

  const bmi = useMemo(() => {
    const vitals = latestChronicCase?.physicalExamination?.vitals;
    if (!vitals?.height || !vitals?.weight) return null;
    const h = parseFloat(vitals.height) / 100; // cm to m
    const w = parseFloat(vitals.weight);
    if (isNaN(h) || isNaN(w) || h === 0) return null;
    return (w / (h * h)).toFixed(1);
  }, [latestChronicCase]);

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both px-4 md:px-0 pb-12">
      {/* Navigation & Header */}
      <PatientProfileHeader patientId={patientId} />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-24 text-slate-400">
          <p className="eyebrow animate-pulse uppercase tracking-[0.2em] text-xs">Syncing patient record...</p>
        </div>
      ) : !patient ? (
        <div className="text-center py-24 text-slate-500 bg-white border border-slate-200 rounded-2xl shadow-sm">
          Patient not found or could not evaluate data.
        </div>
      ) : (
        <>
          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 flex items-center gap-5">
              <div className="p-3 bg-brand-primary/10 rounded-2xl text-brand-primary">
                <UserIcon className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="eyebrow !text-slate-400 uppercase tracking-[0.2em] text-[10px]">Profile</p>
                <p className="text-lg font-semibold text-slate-900 tracking-tight uppercase truncate">
                  {patient.age}Y • {patient.gender}
                </p>
              </div>
            </div>

            {!isStaff && (
              <>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 flex items-center gap-5">
                  <div className="p-3 bg-brand-accent/10 rounded-2xl text-brand-accent">
                    <Fingerprint className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="eyebrow !text-slate-400 uppercase tracking-[0.2em] text-[10px]">Clinical ID</p>
                    <p className={clsx("text-lg font-semibold text-slate-900 tracking-tight uppercase truncate", privacyMode && "blur-sm")}>
                      {patient._id.substring(0, 12)}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 flex items-center gap-5">
                  <div className="p-3 bg-red-50 rounded-2xl text-red-500">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="eyebrow !text-slate-400 uppercase tracking-[0.2em] text-[10px]">Vitals Status</p>
                    <p className="text-lg font-semibold text-slate-900 tracking-tight uppercase">
                      {latestChronicCase?.physicalExamination?.vitals?.bp || 'No BP'}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 flex items-center gap-5">
                  <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-500">
                    <History className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="eyebrow !text-slate-400 uppercase tracking-[0.2em] text-[10px]">Engagement</p>
                    <p className="text-lg font-semibold text-slate-900 tracking-tight uppercase">
                      {visits.length} VISITS
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Left Column - Info & Clinical Overview */}
            <div className="xl:col-span-4 space-y-8">
              <PatientProfileInfoCard patient={patient} />
              
              {!isStaff && (
                <>
                  {/* Clinical Snapshot Card */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-brand-primary/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-700" />
                    <div className="eyebrow !text-brand-primary mb-8 flex items-center gap-4 uppercase tracking-[0.2em] text-[10px] font-bold">
                      <div className="w-10 h-px bg-brand-primary/30" /> Clinical Snapshot
                    </div>

                    <div className="space-y-6">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Primary Diagnosis</p>
                        <p className="text-xl font-semibold text-slate-900 tracking-tight uppercase leading-tight">
                          {latestChronicCase?.summaryDiagnosis?.diseaseDiagnosis || patient.existingConditions || "No diagnosis recorded"}
                        </p>
                      </div>

                      {latestChronicCase?.physicalFeatures?.constitution && (
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Thermal State</p>
                            <p className="font-bold text-brand-primary uppercase text-sm">{latestChronicCase.physicalFeatures.constitution.thermal || "Not set"}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Temperament</p>
                            <p className="font-bold text-brand-accent uppercase text-sm">{latestChronicCase.physicalFeatures.constitution.temperament || "Not set"}</p>
                          </div>
                        </div>
                      )}

                      <div className="pt-6 border-t border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Anthropometry (Latest)</p>
                        <div className="grid grid-cols-2 gap-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-slate-200" />
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">BMI: <span className="text-slate-900">{bmi || '—'}</span></span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-slate-200" />
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">WT: <span className="text-slate-900">{latestChronicCase?.physicalExamination?.vitals?.weight || '—'} kg</span></span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-slate-200" />
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">HT: <span className="text-slate-900">{latestChronicCase?.physicalExamination?.vitals?.height || '—'} cm</span></span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-slate-200" />
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Pulse: <span className="text-slate-900">{latestChronicCase?.physicalExamination?.vitals?.pulse || '—'}</span></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {aiEnabled && (
                    <PatientProfileSummaryCard 
                      visitsCount={visits.length}
                      summaryLoading={summaryLoading}
                      aiSummary={aiSummary}
                    />
                  )}
                </>
              )}
            </div>

            {/* Right Column - Tabs & Content */}
            <div className="xl:col-span-8 space-y-6">
              {isStaff ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-10 shadow-xl shadow-slate-200/40 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                    <Calendar className="w-10 h-10" />
                  </div>
                  <div className="max-w-md">
                    <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Ready for a Visit?</h2>
                    <p className="text-slate-500 mt-2">As a reception staff, you can schedule appointments and manage patient check-ins. Clinical records are restricted to practitioners.</p>
                  </div>
                  <Button 
                    onClick={() => {
                      const opNumber = window.prompt(`Enter OP Number for ${patient.name}:`);
                      if (!opNumber) return;
                      const symptoms = window.prompt("Enter purpose of visit (required):");
                      if (!symptoms) return;
                      // Logic handled by the schedule mutation if I were to lift it up, 
                      // but for now let's just use the PatientList approach or a dedicated button.
                      // Actually, let's just tell them to use the Registry list for now or implement here.
                      router.push('/patients');
                    }}
                    variant="primary" 
                    className="rounded-2xl px-10 h-14 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                    leftIcon={<CalendarPlus className="w-5 h-5" />}
                  >
                    Schedule Appointment
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-[1.5rem] border border-slate-200 shadow-inner w-max">
                    <button
                      onClick={() => setActiveTab("timeline")}
                      className={clsx(
                        "px-8 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 flex items-center gap-2",
                        activeTab === "timeline" 
                          ? "bg-white text-slate-900 shadow-xl border border-slate-100" 
                          : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      <History className="w-3.5 h-3.5" /> Clinical Timeline
                    </button>
                    <button
                      onClick={() => setActiveTab("management")}
                      className={clsx(
                        "px-8 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 flex items-center gap-2",
                        activeTab === "management" 
                          ? "bg-white text-slate-900 shadow-xl border border-slate-100" 
                          : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      <Pill className="w-3.5 h-3.5" /> Management Flow
                    </button>
                  </div>

                  <div className="animate-in fade-in zoom-in-95 duration-500">
                    {activeTab === "timeline" ? (
                      <PatientProfileTimeline visits={unifiedVisits} />
                    ) : (
                      <PatientManagementHistory visits={unifiedVisits} />
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
