"use client";

import { Calendar, Search, Filter, Loader2, FileText, ChevronRight, Stethoscope, Printer } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getAllConsultations } from "@/services/consultationService";
import { useAuthStore } from "@/store/useAuthStore";
import { generatePrescriptionPDF } from "@/lib/pdfGenerator";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function AppointmentsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuthStore();
  const isStaff = user?.role === "staff";

  const { data: response, isLoading } = useQuery({
    queryKey: ["consultations"],
    queryFn: getAllConsultations,
  });

  interface ConsultationRecord {
    _id: string;
    consultationDate: string;
    severity?: string;
    symptoms: string;
    modalities?: string;
    generals?: string;
    mentals?: string;
    diagnosis?: string;
    prescription?: string;
    status?: "Scheduled" | "In-Progress" | "Completed";
    opNumber?: string;
    aiGeneratedNotes?: string | Record<string, any>;
    doctorEditedNotes?: string | Record<string, any>;
    patientId?: {
      _id: string;
      name: string;
      age?: number;
      gender?: string;
      phone?: string;
    };
    doctorId?: {
      _id: string;
      name: string;
      licenseNumber?: string;
    };
  }

  const handlePrint = (apt: ConsultationRecord) => {
    if (!apt.patientId) return;

    let adviceText = "";
    let aiNotes: Record<string, any> | null = null;

    try {
      if (typeof apt.aiGeneratedNotes === "string" && apt.aiGeneratedNotes) aiNotes = JSON.parse(apt.aiGeneratedNotes);
      else if (typeof apt.aiGeneratedNotes === "object") aiNotes = apt.aiGeneratedNotes;
    } catch {}

    try {
      if (typeof apt.doctorEditedNotes === "string" && apt.doctorEditedNotes) {
        if (apt.doctorEditedNotes.startsWith("{")) {
          const parsed = JSON.parse(apt.doctorEditedNotes);
          adviceText = parsed.advice || "";
        } else {
          adviceText = apt.doctorEditedNotes;
        }
      } else if (typeof apt.doctorEditedNotes === "object" && apt.doctorEditedNotes !== null) {
        adviceText = apt.doctorEditedNotes.advice || "";
      }
    } catch {}

    if (!adviceText) adviceText = aiNotes?.advice || "";

    // Parse medicines
    let prescriptions: any[] = [];
    const p = apt.prescription;
    if (p) {
      try {
        const rxArr = typeof p === "string" && p.startsWith("[") ? JSON.parse(p) : (Array.isArray(p) ? p : null);
        if (Array.isArray(rxArr)) {
          prescriptions = rxArr.map((m: any) => ({
            medicine: m.medicine || "",
            potency: m.potency || "",
            form: m.form || "Pills",
            dosage: m.dosage || m.dose || ""
          }));
        } else {
           const items = (p as string).split(", ").map(item => {
             const parts = item.match(/(.+)\s+(\w+)\s+\((\w+)\)\s+-\s+(.+)/);
             if (parts) return { medicine: parts[1], potency: parts[2], form: parts[3], dosage: parts[4] };
             return { medicine: item, potency: "", form: "", dosage: "" };
           });
           prescriptions = items;
        }
      } catch (e) {
        prescriptions = [{ medicine: p, potency: "", form: "", dosage: "" }];
      }
    }

    generatePrescriptionPDF({
      clinicName: user?.clinic?.name || "Carewell Clinic",
      clinicAddress: user?.clinic?.address,
      doctorName: apt.doctorId?.name || user?.name || "Doctor",
      doctorLicense: apt.doctorId?.licenseNumber || user?.licenseNumber,
      patientName: apt.patientId.name,
      patientAge: apt.patientId.age,
      patientGender: apt.patientId.gender,
      date: new Date(apt.consultationDate).toLocaleDateString('en-IN'),
      opNumber: apt.opNumber,
      diagnosis: apt.diagnosis,
      symptoms: apt.symptoms,
      modalities: apt.modalities,
      generals: apt.generals,
      mentals: apt.mentals,
      prescriptions: prescriptions,
      advice: adviceText
    });
  };

  const allConsultations = response?.data || [];

  const filteredConsultations = allConsultations.filter((apt: ConsultationRecord) => {
    // 1. Search Logic (Flexible & Case-Insensitive)
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      (apt.patientId?.name || "").toLowerCase().includes(query) ||
      (apt.symptoms || "").toLowerCase().includes(query) ||
      (apt.opNumber || "").toLowerCase().includes(query) ||
      (apt._id || "").toLowerCase().includes(query);

    if (!matchesSearch) return false;

    // 2. Filter Logic (Date-based)
    if (filter === "All") return true;

    const aptDate = new Date(apt.consultationDate);
    const now = new Date();
    
    if (filter === "Today") {
      return aptDate.toDateString() === now.toDateString();
    }

    if (filter === "Week") {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return aptDate >= weekAgo && aptDate <= now;
    }

    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 fill-mode-both px-4 md:px-0 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-[1px] w-8 bg-brand-primary/40" />
            <span className="eyebrow text-brand-primary/70">Clinical Archive</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-light text-slate-900 tracking-tight">
            Medical <span className="font-semibold text-brand-primary">Records</span>
          </h1>
          <p className="text-sm text-slate-500 max-w-md leading-relaxed mt-1">Chronological archive of all clinical consultations.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
          {["All", "Today", "Week"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 ${
                filter === f
                  ? "bg-white text-slate-900 shadow-xl border border-slate-100"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <Loader2 className="w-8 h-8 text-brand-primary animate-spin mb-4" />
          <p className="eyebrow animate-pulse uppercase tracking-[0.2em] text-[10px] font-bold">Syncing clinical archive...</p>
        </div>
      ) : (
        /* Appointment List view */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-200/40 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="relative flex-1 max-w-md w-full">
              <Input 
                placeholder="Search by patient, symptom or ID..." 
                leftIcon={<Search className="w-4 h-4" />}
                className="h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
               <p className="eyebrow !text-brand-primary mr-2 uppercase tracking-[0.2em] text-[10px] font-bold">{filteredConsultations.length} RECORDS FOUND</p>
               <Button variant="outline" className="h-12 w-12 p-0 flex items-center justify-center rounded-2xl">
                 <Filter className="w-4 h-4" />
               </Button>
            </div>
          </div>

          <div className="divide-y divide-slate-50">
            {filteredConsultations.length === 0 ? (
              <div className="py-32 text-center">
                <FileText className="w-16 h-16 text-slate-100 mx-auto mb-6" />
                <p className="eyebrow text-slate-300 tracking-widest uppercase text-[10px] font-bold">No clinical history found.</p>
              </div>
            ) : (
              filteredConsultations.map((apt: ConsultationRecord) => {
                const dateObj = new Date(apt.consultationDate);
                const dayStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                const timeStr = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

                return (
                  <div key={apt._id} className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-slate-50/50 transition-all group gap-8">
                    <div className="flex items-center gap-10 flex-1 min-w-0">
                      <div className="flex flex-col items-center justify-center min-w-[90px] text-center bg-slate-50 border border-slate-100 p-4 rounded-2xl group-hover:bg-white group-hover:border-brand-primary/20 group-hover:shadow-lg transition-all duration-500">
                        <span className="text-xl font-semibold text-slate-900 leading-none italic">{timeStr.split(" ")[0]}</span>
                        <span className="text-[10px] font-semibold text-brand-primary uppercase tracking-[0.2em] mt-1">{timeStr.split(" ")[1]}</span>
                      </div>
                      
                      <div className="h-14 w-px bg-slate-100 hidden sm:block" />

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <h3 className="text-xl font-semibold text-slate-900 group-hover:text-brand-primary transition-colors uppercase italic tracking-tight truncate max-w-md">
                            {apt.patientId?.name || "Anonymous Case"}
                          </h3>
                          {apt.opNumber && (
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold border border-slate-200 uppercase tracking-wider">
                              OP: {apt.opNumber}
                            </span>
                          )}
                          <span className={`px-3 py-1 rounded-xl text-[10px] font-semibold uppercase tracking-[0.2em] border shadow-xs ${
                            apt.status === 'Scheduled' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                            apt.severity === 'severe' ? 'bg-red-50 text-red-600 border-red-100' : 
                            apt.severity === 'moderate' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
                          }`}>
                            {apt.status === 'Scheduled' ? 'Appointment' : (apt.severity || "Record")}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-5 text-xs">
                          <span className="flex items-center gap-2 eyebrow !text-slate-400 uppercase tracking-widest text-[10px] font-bold">
                            <Calendar className="w-3.5 h-3.5 text-brand-accent" />
                            {dayStr}, {dateObj.getFullYear()}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                          {apt.doctorId && (
                            <>
                              <span className="flex items-center gap-2 eyebrow !text-brand-primary uppercase tracking-widest text-[10px] font-bold">
                                <Stethoscope className="w-3.5 h-3.5" />
                                Dr. {apt.doctorId.name}
                              </span>
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                            </>
                          )}
                          <span className="font-bold text-slate-500 italic truncate max-w-sm group-hover:text-slate-700 transition-colors">&quot;{apt.symptoms}&quot;</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
                      {apt.status === 'Scheduled' && !isStaff ? (
                        <>
                          <Button
                            onClick={() => router.push(`/consultation/acute?patientId=${apt.patientId?._id}&appointmentId=${apt._id}`)}
                            variant="primary"
                            className="h-12 px-6 rounded-2xl group/btn bg-brand-primary shadow-lg shadow-brand-primary/20 w-full sm:w-auto"
                            rightIcon={<ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />}
                          >
                            Acute
                          </Button>
                          <Button
                            onClick={() => router.push(`/consultation/chronic?patientId=${apt.patientId?._id}`)}
                            variant="outline"
                            className="h-12 px-6 rounded-2xl group/btn w-full sm:w-auto"
                            rightIcon={<ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />}
                          >
                            Chronic Case
                          </Button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handlePrint(apt)}
                            variant="outline"
                            className="h-14 w-14 p-0 flex items-center justify-center rounded-2xl border-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-white transition-all shadow-sm"
                            title="Print Prescription"
                          >
                            <Printer className="w-5 h-5" />
                          </Button>
                          <Button
                            onClick={() => router.push(`/patients/${apt.patientId?._id}`)}
                            variant="outline"
                            className="h-14 px-8 rounded-2xl group/btn"
                            rightIcon={<ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />}
                          >
                            {isStaff ? "Patient Profile" : "Clinical Profile"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
