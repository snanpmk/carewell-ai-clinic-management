"use client";

import { StepProps } from "../ChronicCaseWizard";
import { ClipboardList, ChevronRight, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useEffect } from "react";
import { getAllPatients } from "@/services/patientService";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { demographicsSchema, DemographicsFormData } from "@/lib/validations/chronicCase";

interface Patient {
  _id: string;
  name: string;
  age: number;
  phone: string;
  sex?: string;
}

export default function StepPatientDemographics({ caseData, updateCaseData, nextStep }: StepProps) {
  const { data: allPatientsRes, isLoading: allPatientsLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: getAllPatients,
  });

  const allPatients = allPatientsRes?.data || [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(demographicsSchema),
    defaultValues: {
      patient: caseData.patient || "",
      demographics: {
        name: caseData.demographics?.name || "",
        age: caseData.demographics?.age || 0,
        sex: caseData.demographics?.sex || "",
        religion: caseData.demographics?.religion || "",
        occupation: caseData.demographics?.occupation || "",
        address: caseData.demographics?.address || "",
      },
    },
  });

  const selectedPatientId = watch("patient");

  // Update form fields when a patient is selected
  useEffect(() => {
    if (selectedPatientId) {
      const patient = allPatients.find((p: Patient) => p._id === selectedPatientId);
      if (patient) {
        setValue("demographics.name", patient.name);
        setValue("demographics.age", patient.age);
        setValue("demographics.sex", patient.sex || "");
      }
    }
  }, [selectedPatientId, allPatients, setValue]);

  const onSubmit = (data: any) => {
    updateCaseData(data);
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              <div className="h-11 w-full bg-slate-100 animate-pulse rounded-xl" />
            ) : (
              <div className="space-y-1">
                <select
                  {...register("patient")}
                  className={`w-full bg-white border ${
                    errors.patient ? "border-red-500" : "border-slate-200/80"
                  } text-slate-900 rounded-xl px-4 py-2.5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] appearance-none`}
                >
                  <option value="">-- Select Patient --</option>
                  {allPatients.map((p: Patient) => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.phone || "No Phone"})
                    </option>
                  ))}
                </select>
                {errors.patient && (
                  <p className="text-[11px] font-bold text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> {errors.patient.message}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
          {/* Full Name */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500">
              Full Patient Name
            </label>
            <div className="space-y-1">
              <input
                type="text"
                {...register("demographics.name")}
                className={`w-full bg-slate-50/50 border ${
                  errors.demographics?.name ? "border-red-500" : "border-slate-200/80"
                } text-slate-900 rounded-xl px-4 py-2.5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]`}
                placeholder="John Doe"
              />
              {errors.demographics?.name && (
                <p className="text-[11px] font-bold text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.demographics.name.message}
                </p>
              )}
            </div>
          </div>

          {/* Age */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500">
              Age
            </label>
            <div className="space-y-1">
              <input
                type="number"
                {...register("demographics.age")}
                className={`w-full bg-slate-50/50 border ${
                  errors.demographics?.age ? "border-red-500" : "border-slate-200/80"
                } text-slate-900 rounded-xl px-4 py-2.5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]`}
              />
              {errors.demographics?.age && (
                <p className="text-[11px] font-bold text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.demographics.age.message}
                </p>
              )}
            </div>
          </div>

          {/* Sex */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 block">Sex</label>
            <div className="space-y-1">
              <select
                {...register("demographics.sex")}
                className={`w-full bg-slate-50/50 border ${
                  errors.demographics?.sex ? "border-red-500" : "border-slate-200/80"
                } text-slate-900 rounded-xl px-4 py-2.5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]`}
              >
                <option value="">Select Sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.demographics?.sex && (
                <p className="text-[11px] font-bold text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.demographics.sex.message}
                </p>
              )}
            </div>
          </div>

          {/* Occupation */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500">
              Occupation
            </label>
            <input
              type="text"
              {...register("demographics.occupation")}
              className="w-full bg-slate-50/50 border border-slate-200/80 text-slate-900 rounded-xl px-4 py-2.5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]"
            />
          </div>

          {/* Religion */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 block">Religion</label>
            <input
              type="text"
              {...register("demographics.religion")}
              className="w-full bg-slate-50/50 border border-slate-200/80 text-slate-900 rounded-xl px-4 py-2.5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]"
            />
          </div>

          {/* Address */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500">
              Address
            </label>
            <input
              type="text"
              {...register("demographics.address")}
              className="w-full bg-slate-50/50 border border-slate-200/80 text-slate-900 rounded-xl px-4 py-2.5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-8 border-t border-slate-100/80">
          <Button
            type="submit"
            variant="primary"
            className="w-full sm:w-auto"
            rightIcon={<ChevronRight className="w-4 h-4" />}
            isLoading={isSubmitting}
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
