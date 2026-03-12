"use client";

import { Calendar, Search, Filter, Loader2, FileText, ChevronRight, Stethoscope, Printer, Clock } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getAllConsultations } from "@/services/consultationService";
import { useAuthStore } from "@/store/useAuthStore";
import { generatePrescriptionPDF } from "@/lib/pdfGenerator";
import { clsx } from "clsx";

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
    let aiNotes: Record<string, string> | null = null;

    try {
      if (typeof apt.aiGeneratedNotes === "string" && apt.aiGeneratedNotes) {
        aiNotes = JSON.parse(apt.aiGeneratedNotes) as Record<string, string>;
      } else if (typeof apt.aiGeneratedNotes === "object") {
        aiNotes = apt.aiGeneratedNotes as unknown as Record<string, string>;
      }
    } catch { /* ignore */ }

    try {
      if (typeof apt.doctorEditedNotes === "string" && apt.doctorEditedNotes) {
        if (apt.doctorEditedNotes.startsWith("{")) {
          const parsed = JSON.parse(apt.doctorEditedNotes) as Record<string, string>;
          adviceText = parsed.advice || "";
        } else {
          adviceText = apt.doctorEditedNotes;
        }
      } else if (typeof apt.doctorEditedNotes === "object" && apt.doctorEditedNotes !== null) {
        const edited = apt.doctorEditedNotes as unknown as Record<string, string>;
        adviceText = edited.advice || "";
      }
    } catch { /* ignore */ }

    if (!adviceText) adviceText = aiNotes?.advice || "";

    interface MedicineItem {
      medicine: string;
      potency: string;
      form: string;
      dosage: string;
      dose?: string;
    }

    let prescriptions: MedicineItem[] = [];
    const p = apt.prescription;
    if (p) {
      try {
        const rxArr = typeof p === "string" && p.startsWith("[") ? JSON.parse(p) as MedicineItem[] : (Array.isArray(p) ? p as MedicineItem[] : null);
        if (Array.isArray(rxArr)) {
          prescriptions = rxArr.map((m: MedicineItem) => ({
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
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      (apt.patientId?.name || "").toLowerCase().includes(query) ||
      (apt.symptoms || "").toLowerCase().includes(query) ||
      (apt.opNumber || "").toLowerCase().includes(query);

    if (!matchesSearch) return false;

    if (filter === "All") return true;
    const aptDate = new Date(apt.consultationDate);
    const now = new Date();
    
    if (filter === "Today") return aptDate.toDateString() === now.toDateString();
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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-1">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-[1px] w-8 bg-brand-primary/40" />
            <span className="eyebrow text-brand-primary/70">Clinical Archive</span>
          </div>
          <h1 className="text-3xl font-light text-slate-900 tracking-tight">
            Medical <span className="font-semibold text-brand-primary">Records</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          {["All", "Today", "Week"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                "px-5 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all",
                filter === f ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 text-slate-400">
          <Loader2 className="w-8 h-8 text-brand-primary animate-spin mb-4" />
          <p className="eyebrow animate-pulse">Syncing clinical records...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
            <div className="relative flex-1 w-full">
              <Input 
                placeholder="Search records by patient or symptom..." 
                leftIcon={<Search className="w-4 h-4" />}
                className="h-11 border-transparent bg-slate-50/50 focus:bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 whitespace-nowrap">
              {filteredConsultations.length} Matches Found
            </div>
          </div>

          {/* Clean Table Layout */}
          <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 eyebrow border-b border-slate-100">Patient & Date</th>
                  <th className="px-6 py-4 eyebrow border-b border-slate-100">Clinical Summary</th>
                  <th className="px-6 py-4 eyebrow border-b border-slate-100">Status</th>
                  <th className="px-6 py-4 eyebrow border-b border-slate-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredConsultations.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-24 text-center">
                      <FileText className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                      <p className="eyebrow text-slate-300">No records found matching criteria</p>
                    </td>
                  </tr>
                ) : (
                  filteredConsultations.map((apt) => (
                    <tr key={apt._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold shrink-0">
                            {apt.patientId?.name?.charAt(0) || "P"}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{apt.patientId?.name || "Unknown"}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {new Date(apt.consultationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-slate-200" />
                              <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {new Date(apt.consultationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 max-w-xs">
                        <p className="text-sm font-medium text-slate-600 line-clamp-1 italic">&quot;{apt.symptoms}&quot;</p>
                        {apt.diagnosis && <p className="text-[10px] font-bold text-brand-primary uppercase tracking-wide mt-1">{apt.diagnosis}</p>}
                      </td>
                      <td className="px-6 py-5">
                        <span className={clsx(
                          "px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border",
                          apt.status === 'Scheduled' ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                        )}>
                          {apt.status || "Completed"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {apt.status === 'Scheduled' && !isStaff ? (
                            <Button
                              onClick={() => router.push(`/consultation/acute?patientId=${apt.patientId?._id}&appointmentId=${apt._id}`)}
                              variant="primary"
                              size="sm"
                              className="h-9 px-4 rounded-xl text-[10px] font-bold"
                            >
                              Start
                            </Button>
                          ) : (
                            <button
                              onClick={() => handlePrint(apt)}
                              className="p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:bg-brand-primary hover:text-white transition-all border border-slate-200 shadow-sm"
                              title="Print Prescription"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                          )}
                          <Link 
                            href={`/patients/${apt.patientId?._id}`}
                            className="p-2.5 rounded-xl bg-white text-brand-primary hover:bg-brand-primary/5 transition-all border border-brand-primary/20"
                            title="View Profile"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Ensure Link is imported if not already (it wasn't in my previous write but likely needed)
import Link from "next/link";
