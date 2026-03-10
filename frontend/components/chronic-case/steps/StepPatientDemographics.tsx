"use client";

import { StepProps } from "../ChronicCaseWizard";
import { ClipboardList, ChevronRight, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";
import { getAllPatients } from "@/services/patientService";
import { useQuery } from "@tanstack/react-query";

interface Patient {
  _id: string;
  name: string;
  age: number;
  phone: string;
  sex?: string;
}

export default function StepPatientDemographics({ caseData, updateCaseData, nextStep }: StepProps) {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(caseData.patient || "");

  const { data: allPatientsRes, isLoading: allPatientsLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: getAllPatients,
  });

  const allPatients = allPatientsRes?.data || [];

  useEffect(() => {
    if (selectedPatientId) {
      const patient = allPatients.find((p: Patient) => p._id === selectedPatientId);
      if (patient) {
        updateCaseData({
          patient: patient._id,
          demographics: {
            ...caseData.demographics,
            name: patient.name,
            age: patient.age,
            sex: patient.sex || "",
          }
        });
      }
    }
  }, [selectedPatientId, allPatients]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseData.patient && !selectedPatientId) {
        alert("Please select a patient to continue.");
        return;
    }
    nextStep();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Section Header */}
      <div className="flex items-center gap-4 pb-6 border-b border-slate-100/80">
        <div className="w-12 h-12 bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-100/50 rounded-2xl flex items-center justify-center text-blue-600 shadow-xs shadow-blue-100">
          <ClipboardList className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Administrative Data</h2>
          <p className="text-sm font-medium text-slate-500 mt-0.5">Patient Demographics & Identification</p>
        </div>
      </div>

      <form onSubmit={handleNext} className="space-y-6">
        {/* Patient Selection */}
        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
               <User className="w-4 h-4 text-blue-500" /> Choose Registered Patient
            </h3>
            <div className="space-y-2 max-w-md">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 block">
                  Select Patient <span className="text-red-500">*</span>
                </label>
                {allPatientsLoading ? (
                  <p className="text-sm text-slate-500 font-medium">Loading patients...</p>
                ) : (
                  <select
                    value={selectedPatientId}
                    onChange={(e) => {
                        setSelectedPatientId(e.target.value);
                        updateCaseData({ patient: e.target.value });
                    }}
                    required
                    className="w-full bg-white border border-slate-200/80 text-slate-900 rounded-xl px-4 py-2.5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] appearance-none"
                  >
                    <option value="">-- Select Patient --</option>
                    {allPatients.map((p: Patient) => (
                      <option key={p._id} value={p._id}>{p.name} ({p.phone || "No Phone"})</option>
                    ))}
                  </select>
                )}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
          {/* Full Name */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500">
              Full Patient Name
            </label>
            <input
              type="text"
              required
              className="w-full bg-slate-50/50 border border-slate-200/80 text-slate-900 rounded-xl px-4 py-2.5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]"
              placeholder="John Doe"
              value={caseData.demographics?.name || ""}
              onChange={(e) => updateCaseData({ demographics: { ...caseData.demographics, name: e.target.value } })}
            />
          </div>

          {/* Age */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500">
              Age
            </label>
            <input
              type="number"
              className="w-full bg-slate-50/50 border border-slate-200/80 text-slate-900 rounded-xl px-4 py-2.5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]"
              value={caseData.demographics?.age || ""}
              onChange={(e) => updateCaseData({ demographics: { ...caseData.demographics, age: parseInt(e.target.value) } })}
            />
          </div>

          {/* Sex */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 block">Sex</label>
            <select
              className="w-full bg-slate-50/50 border border-slate-200/80 text-slate-900 rounded-xl px-4 py-2.5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]"
              value={caseData.demographics?.sex || ""}
              onChange={(e) => updateCaseData({ demographics: { ...caseData.demographics, sex: e.target.value } })}
            >
              <option value="">Select Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Occupation */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500">
              Occupation
            </label>
            <input
              type="text"
              className="w-full bg-slate-50/50 border border-slate-200/80 text-slate-900 rounded-xl px-4 py-2.5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]"
              value={caseData.demographics?.occupation || ""}
              onChange={(e) => updateCaseData({ demographics: { ...caseData.demographics, occupation: e.target.value } })}
            />
          </div>

          {/* Religion */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 block">Religion</label>
            <input
              type="text"
              className="w-full bg-slate-50/50 border border-slate-200/80 text-slate-900 rounded-xl px-4 py-2.5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]"
              value={caseData.demographics?.religion || ""}
              onChange={(e) => updateCaseData({ demographics: { ...caseData.demographics, religion: e.target.value } })}
            />
          </div>

          {/* Address */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500">
              Address
            </label>
            <input
              type="text"
              className="w-full bg-slate-50/50 border border-slate-200/80 text-slate-900 rounded-xl px-4 py-2.5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]"
              value={caseData.demographics?.address || ""}
              onChange={(e) => updateCaseData({ demographics: { ...caseData.demographics, address: e.target.value } })}
            />
          </div>
        </div>

        <div className="flex justify-end pt-8 border-t border-slate-100/80">
          <Button
            type="submit"
            variant="primary"
            className="w-full sm:w-auto"
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
