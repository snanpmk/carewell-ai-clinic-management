"use client";

import { use } from "react";
import Link from "next/link";
import { ChevronLeft, User, Phone, Clock, FileText, Activity, Sparkles, Plus, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getPatient } from "@/services/patientService";
import { getConsultationsByPatient, summarizeHistory } from "@/services/consultationService";

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

  const visits = consultRes?.data || [];

  const { data: summaryRes, isLoading: summaryLoading } = useQuery({
    queryKey: ["patient-summary", patientId],
    queryFn: () => summarizeHistory(visits),
    enabled: visits.length > 0,
  });

  const isLoading = patientLoading || consultLoading;
  const patient = patientRes?.data;
  const aiSummary = summaryRes?.data;

  interface VisitItem {
    _id: string;
    consultationDate: string;
    symptoms: string;
    diagnosis?: string;
    doctorEditedNotes?: string | Record<string, unknown>;
    aiGeneratedNotes?: string;
    additionalNotes?: string;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link 
            href="/patients"
            className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Profile</h1>
            <p className="text-sm text-slate-500 mt-1">Detailed history and information</p>
          </div>
        </div>
        
        <Link
          href={`/consultation?patientId=${patientId}`}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-all focus:ring-2 focus:ring-blue-600 focus:outline-none"
        >
          <Plus className="w-4 h-4" />
          New Consultation
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : !patient ? (
        <div className="text-center py-12 text-slate-500">
          Patient not found.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Info & AI Summary */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Patient Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-50 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
              <div className="w-24 h-24 mx-auto bg-blue-600 rounded-3xl flex items-center justify-center mb-6 border-4 border-white shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
                <span className="text-4xl font-black text-white">{patient.name.charAt(0)}</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{patient.name}</h2>
              <div className="mt-8 space-y-4 text-left border-t border-slate-100 pt-6">
                <div className="flex items-center gap-4 text-sm">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Demographics</p>
                    <p className="font-bold text-slate-700">{patient.age} years / {patient.gender}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Contact</p>
                    <p className="font-bold text-slate-700 font-mono">{patient.phone}</p>
                  </div>
                </div>
                {patient.address && (
                  <div className="flex items-center gap-4 text-sm">
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Residence</p>
                      <p className="font-bold text-slate-700">{patient.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Summary Card */}
            <div className="bg-linear-to-br from-emerald-600 to-emerald-700 rounded-2xl p-8 shadow-lg relative overflow-hidden text-white group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-bl-full pointer-events-none blur-2xl group-hover:scale-110 transition-transform" />
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                  <Sparkles className="w-5 h-5 text-emerald-100" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest">Medical Insight</h3>
              </div>
              <div className="text-sm text-emerald-50 leading-relaxed font-medium relative z-10 italic">
                {visits.length === 0 ? (
                  "No visits recorded yet. Summary will generate after the first consultation."
                ) : summaryLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Distilling history...
                  </span>
                ) : (
                  `&quot;${aiSummary}&quot;` || "Unable to generate summary."
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Visit History */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tight">
                <div className="p-2 bg-slate-100 rounded-xl">
                  <Clock className="w-5 h-5 text-slate-500" />
                </div>
                Timeline
              </h2>
            </div>

            <div className="space-y-6">
              {visits.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-16 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                  Empty Record
                </div>
              ) : (
                visits.map((visit: VisitItem, idx: number) => {
                  let aiNotes = null;
                  let parsedDoctorNotes = visit.doctorEditedNotes;
                  
                  try { if (visit.aiGeneratedNotes) aiNotes = JSON.parse(visit.aiGeneratedNotes); } catch { }
                  try { 
                    if (visit.doctorEditedNotes && typeof visit.doctorEditedNotes === 'string' && visit.doctorEditedNotes.startsWith('{')) {
                      const parsed = JSON.parse(visit.doctorEditedNotes);
                      parsedDoctorNotes = parsed.advice || parsed.doctorEditedNotes || visit.doctorEditedNotes;
                    }
                  } catch { }

                  return (
                    <div key={visit._id} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pb-6 border-b border-slate-50">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 font-black text-lg">
                            {visits.length - idx}
                          </div>
                          <div>
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Examination</h3>
                            <p className="text-xs font-bold text-slate-400">
                               {new Date(visit.consultationDate).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-100">
                            {new Date(visit.consultationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                               <Activity className="w-3 h-3 text-amber-500" /> Patient Report
                            </p>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                              <p className="text-sm font-bold text-slate-700 leading-relaxed italic">&quot;{visit.symptoms}&quot;</p>
                              {visit.diagnosis && (
                                <p className="mt-2 text-xs font-black text-slate-400">Assessed: <span className="text-slate-900 uppercase">{visit.diagnosis}</span></p>
                              )}
                            </div>
                          </div>

                          {aiNotes?.assessment && (
                             <div>
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                   <Sparkles className="w-3 h-3" /> Clinical Logic
                                </p>
                                <p className="text-sm font-medium text-slate-600 leading-relaxed pl-4 border-l-2 border-indigo-100">
                                  {aiNotes.assessment}
                                </p>
                             </div>
                          )}
                        </div>
                        
                        <div className="space-y-6">
                          <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 relative shadow-xs">
                             <div className="absolute top-4 right-4 text-emerald-200">
                               <FileText className="w-8 h-8 opacity-20" />
                             </div>
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4">Final Prescription</p>
                            <p className="text-lg font-black text-emerald-900 leading-tight mb-2 uppercase tracking-tight">
                              {parsedDoctorNotes || (aiNotes?.advice || "No advice recorded.")}
                            </p>
                            {visit.additionalNotes && (
                              <p className="text-xs text-emerald-600 font-medium italic mt-4 pt-4 border-t border-emerald-100/50">
                                Note: {visit.additionalNotes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
