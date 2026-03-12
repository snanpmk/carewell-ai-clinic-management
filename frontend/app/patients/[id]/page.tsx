"use client";

import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  History, Pill, Edit3, 
  Activity, Clock, 
  Loader2, Stethoscope, Heart, Scale, Sparkles,
  Phone, MapPin
} from "lucide-react";
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
  const latestChronicCase = chronicCases[0] || null;

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
    enabled: visits.length > 0 && aiEnabled,
  });

  const isLoading = patientLoading || consultLoading || chronicLoading;
  const patient = patientRes?.data;
  const aiSummary = summaryRes?.data;
  const isStaff = user?.role === "staff";

  const queryClient = useQueryClient();

  const followUpForm = useForm<FollowUpEntry>({
    defaultValues: { symptomChanges: "", interference: "", prescription: "", date: "" }
  });

  const followUpMutation = useMutation({
    mutationFn: (data: FollowUpEntry) => addFollowUp(followUpModalCaseId!, data),
    onSuccess: () => {
      toast.success("Progress Logged Successfully");
      queryClient.invalidateQueries({ queryKey: ["chronicCases", patientId] });
      setFollowUpModalCaseId(null);
      followUpForm.reset();
    },
  });

  const bmi = useMemo(() => {
    const v = latestChronicCase?.physicalExamination?.vitals;
    if (!v?.height || !v?.weight) return null;
    const h = parseFloat(v.height) / 100;
    const w = parseFloat(v.weight);
    if (isNaN(h) || isNaN(w) || h === 0) return null;
    return (w / (h * h)).toFixed(1);
  }, [latestChronicCase]);

  const unifiedVisits: UnifiedVisitItem[] = visits.map((v: Record<string, unknown>) => {
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
      modalities: v.modalities as string,
      generals: v.generals as string,
      mentals: v.mentals as string,
      doctorEditedNotes: v.doctorEditedNotes as Record<string, unknown>,
      aiGeneratedNotes: v.aiGeneratedNotes as Record<string, unknown>,
      additionalNotes: v.additionalNotes as string,
      doctorId: v.doctorId as UnifiedVisitItem["doctorId"],
      opNumber: v.opNumber as string,
    };
  });

  // Status badge helper
  const statusBadge = (status: ChronicCase["status"]) => {
    const map = {
      Draft: { label: "Draft", cls: "bg-slate-100 text-slate-500" },
      Active: { label: "Active Case", cls: "bg-brand-primary/10 text-brand-primary" },
      Completed: { label: "Completed", cls: "bg-blue-50 text-blue-600" },
      Closed: { label: "Closed", cls: "bg-red-50 text-red-400" },
    };
    const s = map[status] ?? map["Draft"];
    return (
      <span className={clsx("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", s.cls)}>
        {s.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="bg-white ">
        <div className="mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <PatientProfileHeader patientId={patientId} />
              <div className="hidden lg:flex items-center gap-6 pl-6 border-l border-slate-200">
                <div>
                  <p className="eyebrow mb-1">Master OP</p>
                  <p className="text-sm font-semibold text-slate-900">{latestChronicCase?.header?.opNumber || "—"}</p>
                </div>
                <div>
                  <p className="eyebrow mb-1">Status</p>
                  {statusBadge(latestChronicCase?.status || "Draft")}
                </div>
              </div>
            </div>

            {!isStaff && (
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => router.push(`/consultation/acute?patientId=${patientId}`)}
                  variant="outline"
                  className="rounded-xl border-slate-200"
                  leftIcon={<Activity className="w-4 h-4" />}
                >
                  Acute Session
                </Button>
                <Button
                  onClick={() => setFollowUpModalCaseId(latestChronicCase?._id || null)}
                  disabled={!latestChronicCase}
                  variant="primary"
                  className="rounded-xl bg-brand-primary shadow-lg shadow-brand-primary/20"
                  leftIcon={<History className="w-4 h-4" />}
                >
                  Log Progress
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-40">
          <Loader2 className="w-10 h-10 animate-spin text-brand-primary mb-4" />
          <p className="eyebrow animate-pulse">Establishing Clinical Context...</p>
        </div>
      ) : (
        <div className="mx-auto mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* MAIN CONTENT Area (Left) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* MASTER CASE OVERVIEW */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                      <Stethoscope className="w-5 h-5 text-brand-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">Clinical Master File</h2>
                      <p className="text-xs text-slate-500 font-medium">Primary Chronic Record & Strategy</p>
                    </div>
                  </div>
                  {latestChronicCase && (
                    <button 
                      onClick={() => router.push(`/consultation/chronic?patientId=${patientId}&caseId=${latestChronicCase._id}`)}
                      className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-brand-primary transition-all"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {!latestChronicCase ? (
                  <div className="p-16 text-center">
                    <p className="text-sm font-medium text-slate-400 mb-6">No active treatment plan found for this patient.</p>
                    <Button 
                      onClick={() => router.push(`/consultation/chronic?patientId=${patientId}`)}
                      variant="primary" 
                      className="rounded-xl px-8 h-12 bg-slate-900"
                    >
                      Initialize Master Evaluation
                    </Button>
                  </div>
                ) : (
                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                      <div>
                        <p className="eyebrow mb-3">Primary Diagnosis</p>
                        <p className="text-2xl font-bold text-slate-900 tracking-tight">
                          {latestChronicCase.summaryDiagnosis?.diseaseDiagnosis || "Evaluating Condition"}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <p className="eyebrow mb-1">Miasm</p>
                          <p className="text-sm font-bold text-slate-700 uppercase tracking-tight">{latestChronicCase.analysisAndDiagnosis?.finalDiagnosis?.miasmDominance || "—"}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <p className="eyebrow mb-1">Thermal</p>
                          <p className="text-sm font-bold text-slate-700 uppercase tracking-tight">{latestChronicCase.physicalFeatures?.constitution?.thermal || "—"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Pill className="w-4 h-4 text-brand-primary" />
                        <span className="eyebrow !text-slate-900">Current Prescription</span>
                      </div>
                      <div className="space-y-3">
                        {latestChronicCase.management?.firstPrescription?.medicines?.map((m, i) => (
                          <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-900 uppercase">{m.medicine} {m.potency}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.dose}</span>
                          </div>
                        )) || <p className="text-xs italic text-slate-400">No active medication logged</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* TABS & TIMELINE AREA */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm w-max">
                  {[
                    { id: "timeline", label: "Timeline", icon: History },
                    { id: "management", label: "Medications", icon: Pill },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as "timeline" | "management")}
                        className={clsx(
                          "px-6 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center gap-2.5 transition-all",
                          isActive ? "bg-slate-900 text-white shadow-md shadow-slate-200" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        <Icon className="w-3.5 h-3.5" /> {tab.label}
                      </button>
                    );
                  })}
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {activeTab === "timeline" ? (
                    <PatientProfileTimeline visits={unifiedVisits} patient={patient} />
                  ) : (
                    <PatientManagementHistory visits={unifiedVisits} />
                  )}
                </div>
              </div>
            </div>

            {/* SIDEBAR Area (Right) */}
            <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-8">
              
              <PatientProfileInfoCard
                patient={patient}
                patientId={patientId}
                visitsCount={visits.length}
                chronicCount={chronicCases.length}
                bp={latestChronicCase?.physicalExamination?.vitals?.bp}
              />

              {/* BIOMETRICS PANEL */}
              {!isStaff && (
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1 h-4 bg-brand-primary rounded-full" />
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Biometrics</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-10 gap-x-6">
                    {[
                      { label: "Blood Pressure", val: latestChronicCase?.physicalExamination?.vitals?.bp || "—", unit: "mmHg", icon: Heart, color: "text-red-500" },
                      { label: "Body Weight", val: latestChronicCase?.physicalExamination?.vitals?.weight || "—", unit: "kg", icon: Scale, color: "text-slate-900" },
                      { label: "BMI", val: bmi || "—", unit: "Score", icon: Activity, color: "text-brand-primary" },
                      { label: "Pulse", val: latestChronicCase?.physicalExamination?.vitals?.pulse || "—", unit: "bpm", icon: Clock, color: "text-slate-500" },
                    ].map((v, i) => (
                      <div key={i} className="space-y-1">
                        <p className="eyebrow tracking-wider">{v.label}</p>
                        <p className={clsx("text-xl font-bold tracking-tight", v.color)}>{v.val}</p>
                        <p className="text-[9px] font-bold text-slate-300 uppercase">{v.unit}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI INTELLIGENCE SUMMARY */}
              {aiEnabled && !isStaff && (
                <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="w-4 h-4 text-brand-primary" />
                    <span className="eyebrow !text-brand-primary">AI History Summary</span>
                  </div>
                  {summaryLoading ? (
                    <div className="space-y-3">
                      <div className="h-3 w-full bg-brand-primary/5 animate-pulse rounded-full" />
                      <div className="h-3 w-4/5 bg-brand-primary/5 animate-pulse rounded-full" />
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600 leading-relaxed italic">
                      {aiSummary || "Insufficient data for clinical synthesis."}
                    </p>
                  )}
                </div>
              )}

              {/* CONTACT QUICK VIEW */}
              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div>
                      <p className="eyebrow mb-0.5">Contact</p>
                      <p className={clsx("text-sm font-semibold text-slate-900", privacyMode && "blur-sm")}>{patient.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div>
                      <p className="eyebrow mb-0.5">Address</p>
                      <p className={clsx("text-sm font-semibold text-slate-700 leading-relaxed", privacyMode && "blur-sm")}>
                        {patient.address || "No address recorded"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* FOLLOW-UP MODAL */}
      {followUpModalCaseId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg animate-in zoom-in-95 duration-300">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Activity className="w-5 h-5 text-emerald-500" /> Log Progress Visit
            </h2>
            <form onSubmit={followUpForm.handleSubmit((data) => followUpMutation.mutate(data))} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="eyebrow block mb-2">Visit Date</label>
                  <input type="date" {...followUpForm.register("date")} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary" />
                </div>
                <div>
                  <label className="eyebrow block mb-2">Prescription</label>
                  <input {...followUpForm.register("prescription")} placeholder="Remedy & Potency" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary" />
                </div>
              </div>
              <div>
                <label className="eyebrow block mb-2">Symptom Changes</label>
                <textarea {...followUpForm.register("symptomChanges", { required: true })} rows={4} placeholder="Observations since last visit..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary resize-none" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setFollowUpModalCaseId(null)} className="flex-1 py-3.5 rounded-xl border border-slate-200 text-xs font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
                <button type="submit" disabled={followUpMutation.isPending} className="flex-1 py-3.5 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-primary transition-all shadow-xl">
                  {followUpMutation.isPending ? "Syncing..." : "Record Visit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
