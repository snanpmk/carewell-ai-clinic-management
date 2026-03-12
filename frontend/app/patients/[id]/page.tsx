"use client";

import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { History, Pill, Calendar, CalendarPlus, ClipboardList, Edit3, PlusCircle, CheckCircle2, Activity, FileArchive, Clock } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getPatient } from "@/services/patientService";
import { getConsultationsByPatient, summarizeHistory } from "@/services/consultationService";
import { getPatientChronicCases, addFollowUp, FollowUpEntry } from "@/services/chronicCaseService";
import { ChronicCase } from "@/types/chronicCase";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import { clsx } from "clsx";
import { toast } from "sonner";

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
  
  const [activeTab, setActiveTab] = useState<"timeline" | "management" | "chronicCases">("timeline");
  const [followUpModalCaseId, setFollowUpModalCaseId] = useState<string | null>(null);

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

  const chronicCases: ChronicCase[] = chronicRes || [];

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

  const queryClient = useQueryClient();

  // Follow-up form
  const followUpForm = useForm<FollowUpEntry>({
    defaultValues: { symptomChanges: "", interference: "", prescription: "", date: "" }
  });
  const followUpMutation = useMutation({
    mutationFn: (data: FollowUpEntry) => addFollowUp(followUpModalCaseId!, data),
    onSuccess: () => {
      toast.success("Follow-up entry saved!");
      queryClient.invalidateQueries({ queryKey: ["chronicCases", patientId] });
      setFollowUpModalCaseId(null);
      followUpForm.reset();
    },
    onError: () => toast.error("Failed to save follow-up."),
  });

  // Status badge helper
  const statusBadge = (status: ChronicCase["status"]) => {
    const map = {
      Draft: { label: "Draft", icon: <FileArchive className="w-3 h-3" />, cls: "bg-slate-100 text-slate-500" },
      Active: { label: "Active", icon: <Activity className="w-3 h-3" />, cls: "bg-emerald-50 text-emerald-600" },
      Completed: { label: "Completed", icon: <CheckCircle2 className="w-3 h-3" />, cls: "bg-blue-50 text-blue-600" },
      Closed: { label: "Closed", icon: <Clock className="w-3 h-3" />, cls: "bg-red-50 text-red-400" },
    };
    const s = map[status] ?? map["Draft"];
    return (
      <span className={clsx("inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full", s.cls)}>
        {s.icon}{s.label}
      </span>
    );
  };

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
        doctor: v.doctor as UnifiedVisitItem["doctor"],
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
      doctorId: v.doctorId as UnifiedVisitItem["doctorId"],
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
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Left Column - Info & Clinical Overview */}
            <div className="xl:col-span-4 space-y-8">
              <PatientProfileInfoCard
                patient={patient}
                patientId={patientId}
                visitsCount={visits.length}
                chronicCount={chronicCases.length}
                bp={latestChronicCase?.physicalExamination?.vitals?.bp}
              />
              
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
                    <button
                      onClick={() => setActiveTab("chronicCases")}
                      className={clsx(
                        "px-8 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 flex items-center gap-2",
                        activeTab === "chronicCases" 
                          ? "bg-white text-slate-900 shadow-xl border border-slate-100" 
                          : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      <ClipboardList className="w-3.5 h-3.5" /> Chronic Cases
                      {chronicCases.length > 0 && (
                        <span className="bg-brand-primary text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                          {chronicCases.length}
                        </span>
                      )}
                    </button>
                  </div>

                  <div className="animate-in fade-in zoom-in-95 duration-500">
                    {activeTab === "timeline" ? (
                      <PatientProfileTimeline visits={unifiedVisits} />
                    ) : activeTab === "management" ? (
                      <PatientManagementHistory visits={unifiedVisits} />
                    ) : (
                      /* Chronic Cases Tab */
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Chronic Case Records</h3>
                          <button
                            onClick={() => router.push(`/consultation/chronic?patientId=${patientId}`)}
                            className="inline-flex items-center gap-1.5 text-[10px] font-bold text-brand-primary hover:text-brand-primary/80 uppercase tracking-wider transition-colors"
                          >
                            <PlusCircle className="w-3.5 h-3.5" /> New Case
                          </button>
                        </div>

                        {chronicCases.length === 0 ? (
                          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
                            <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                            <p className="text-sm font-medium text-slate-400">No chronic case records yet.</p>
                            <button
                              onClick={() => router.push(`/consultation/chronic?patientId=${patientId}`)}
                              className="mt-4 text-xs text-brand-primary font-semibold hover:underline"
                            >
                              Start First Chronic Case →
                            </button>
                          </div>
                        ) : (
                          chronicCases.map((c) => (
                            <div key={c._id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-3 mb-2">
                                    {statusBadge(c.status)}
                                    <span className="text-[10px] text-slate-400 font-medium">
                                      {new Date(c.createdAt!).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                    </span>
                                  </div>
                                  <p className="text-base font-semibold text-slate-900 truncate">
                                    {c.summaryDiagnosis?.diseaseDiagnosis || c.analysisAndDiagnosis?.finalDiagnosis?.disease || "Diagnosis not recorded"}
                                  </p>
                                  {c.header?.opNumber && (
                                    <p className="text-xs text-slate-400 mt-1">OP: {c.header.opNumber}</p>
                                  )}
                                  {c.followUps && c.followUps.length > 0 && (
                                    <p className="text-xs text-slate-400 mt-1">{c.followUps.length} follow-up{c.followUps.length > 1 ? "s" : ""} recorded</p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    onClick={() => setFollowUpModalCaseId(c._id!)}
                                    className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-all"
                                  >
                                    <PlusCircle className="w-3 h-3" /> Follow-Up
                                  </button>
                                  <button
                                    onClick={() => router.push(`/consultation/chronic?patientId=${patientId}&caseId=${c._id}`)}
                                    className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-brand-primary hover:text-brand-primary/80 bg-brand-primary/5 hover:bg-brand-primary/10 px-3 py-1.5 rounded-xl transition-all"
                                  >
                                    <Edit3 className="w-3 h-3" /> Edit
                                  </button>
                                </div>
                              </div>

                              {/* Follow-Ups inline */}
                              {c.followUps && c.followUps.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 gap-2">
                                  {c.followUps.slice(-3).map((fu, i) => (
                                    <div key={i} className="text-xs text-slate-500 flex items-start gap-3">
                                      <span className="text-slate-300 font-mono shrink-0">{fu.date ? new Date(fu.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}</span>
                                      <span className="flex-1">{fu.symptomChanges}</span>
                                      {fu.prescription && <span className="text-brand-primary font-semibold shrink-0">{fu.prescription}</span>}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* Follow-Up Modal */}
      {followUpModalCaseId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4 animate-in zoom-in-95 duration-300">
            <h2 className="text-xl font-semibold text-slate-900 mb-1">Add Follow-Up</h2>
            <p className="text-xs text-slate-400 font-medium mb-6">Record a progress visit for this chronic case.</p>
            <form
              onSubmit={followUpForm.handleSubmit((data) => followUpMutation.mutate(data))}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Date</label>
                <input
                  type="date"
                  {...followUpForm.register("date")}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Symptom Changes <span className="text-red-400">*</span></label>
                <textarea
                  {...followUpForm.register("symptomChanges", { required: true })}
                  rows={3}
                  placeholder="Describe changes since last visit…"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-primary resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Interference</label>
                <input
                  {...followUpForm.register("interference")}
                  placeholder="Any intercurrent illness, drug changes…"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">New Prescription</label>
                <input
                  {...followUpForm.register("prescription")}
                  placeholder="e.g. Sulphur 200c / continue"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-primary"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setFollowUpModalCaseId(null); followUpForm.reset(); }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={followUpMutation.isPending}
                  className="flex-1 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {followUpMutation.isPending ? "Saving…" : "Save Follow-Up"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
