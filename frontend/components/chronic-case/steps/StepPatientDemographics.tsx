"use client";

import { StepProps } from "../ChronicCaseWizard";
import { User, Hash, Calendar, MapPin, Briefcase, ChevronRight, ClipboardList, UserCircle } from "lucide-react";

export default function StepPatientDemographics({ caseData, updateCaseData, nextStep }: StepProps) {
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Section Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 shadow-sm">
          <ClipboardList className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-medium text-slate-900">Administrative Data</h2>
          <p className="text-sm text-slate-500 mt-0.5">Patient Demographics & Identification</p>
        </div>
      </div>

      <form onSubmit={handleNext} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
          {/* OP Number */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 font-medium text-slate-700">
              OP Number
            </label>
            <input
              type="text"
              className="w-full bg-white border border-slate-200 text-slate-900 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
              placeholder="OP-2024-001"
              value={caseData.header?.opNumber || ""}
              onChange={(e) => updateCaseData({ header: { ...caseData.header, opNumber: e.target.value } })}
            />
          </div>

          {/* Full Name */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="flex items-center gap-2 font-medium text-slate-700">
              Full Patient Name
            </label>
            <input
              type="text"
              required
              className="w-full bg-white border border-slate-200 text-slate-900 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
              placeholder="John Doe"
              value={caseData.demographics?.name || ""}
              onChange={(e) => updateCaseData({ demographics: { ...caseData.demographics, name: e.target.value } })}
            />
          </div>

          {/* Age */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 font-medium text-slate-700">
              Age
            </label>
            <input
              type="number"
              className="w-full bg-white border border-slate-200 text-slate-900 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={caseData.demographics?.age || ""}
              onChange={(e) => updateCaseData({ demographics: { ...caseData.demographics, age: parseInt(e.target.value) } })}
            />
          </div>

          {/* Sex */}
          <div className="space-y-1.5">
            <label className="font-medium text-slate-700 block">Sex</label>
            <select
              className="w-full bg-white border border-slate-200 text-slate-900 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
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
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 font-medium text-slate-700">
              Occupation
            </label>
            <input
              type="text"
              className="w-full bg-white border border-slate-200 text-slate-900 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={caseData.demographics?.occupation || ""}
              onChange={(e) => updateCaseData({ demographics: { ...caseData.demographics, occupation: e.target.value } })}
            />
          </div>

          {/* Religion */}
          <div className="space-y-1.5">
            <label className="font-medium text-slate-700 block">Religion</label>
            <input
              type="text"
              className="w-full bg-white border border-slate-200 text-slate-900 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={caseData.demographics?.religion || ""}
              onChange={(e) => updateCaseData({ demographics: { ...caseData.demographics, religion: e.target.value } })}
            />
          </div>

          {/* Address */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="flex items-center gap-2 font-medium text-slate-700">
              Address
            </label>
            <input
              type="text"
              className="w-full bg-white border border-slate-200 text-slate-900 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={caseData.demographics?.address || ""}
              onChange={(e) => updateCaseData({ demographics: { ...caseData.demographics, address: e.target.value } })}
            />
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-slate-100">
          <button
            type="submit"
            className="group flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-md text-sm font-medium transition-colors active:scale-[0.98]"
          >
            Continue
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
          </button>
        </div>
      </form>
    </div>
  );
}
