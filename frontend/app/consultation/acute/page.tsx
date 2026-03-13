"use client";

import { toast } from "sonner";
import { Suspense, useEffect } from "react";
import { Sparkles, Save, FileText, Loader2, Activity, Pill, Trash2, Plus, Printer } from "lucide-react";
import { useForm, useWatch, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams, useRouter } from "next/navigation";
import { generateNotes, saveConsultation, updateConsultation, getNextOPNumber } from "@/services/consultationService";
import apiClient from "@/services/apiClient";
import { getPatient, getAllPatients } from "@/services/patientService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUIStore } from "@/store/useUIStore";
import { useAuthStore } from "@/store/useAuthStore";
import { clsx } from "clsx";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ConsultationNotes, SaveConsultationPayload } from "@/services/consultationService";
import { generatePrescriptionPDF } from "@/lib/pdfGenerator";

const aiGenerationSchema = z.object({
  patientId: z.string().min(1, "Please select a patient"),
  symptoms: z.string().min(5, "Symptoms are required"),
});

const formSchema = z.object({
  id: z.string().optional(),
  patientId: z.string().min(1, "Please select a patient"),
  opNumber: z.string().min(1, "OP Number is required"),
  symptoms: z.string().min(5, "Symptoms are required"),
  modalities: z.string().optional(),
  generals: z.string().optional(),
  mentals: z.string().optional(),
  diagnosis: z.string().optional(),
  prescriptions: z.array(z.object({
    medicine: z.string().min(1, "Medicine name is required"),
    potency: z.string().min(1, "Potency is required"),
    form: z.string().min(1, "Form is required"),
    dosage: z.string().min(1, "Dosage is required"),
    quantity: z.string().optional(),
    indication: z.string().optional(),
  })).min(1, "At least one prescription is required"),
  additionalNotes: z.string().optional(),
  advice: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface Patient {
  _id: string;
  name: string;
  age: number;
  phone: string;
  gender: "Male" | "Female" | "Other";
}

interface ApiError {
  message: string;
}

const emptyNotes: ConsultationNotes = {
  chiefComplaint: "",
  assessment: "",
  advice: "",
};

function ConsultationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlPatientId = searchParams.get("patientId");
  const urlAppointmentId = searchParams.get("appointmentId");
  const { privacyMode } = useUIStore();
  const { user } = useAuthStore();
  const aiEnabled = user?.clinic?.aiEnabled ?? true;

  const {
    register,
    handleSubmit,
    setValue,
    control,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      patientId: urlPatientId || "",
      opNumber: "",
      prescriptions: [{ medicine: "", potency: "", form: "Pills", dosage: "" }],
      advice: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "prescriptions",
  });

  const selectedPatientId = useWatch({
    control,
    name: "patientId",
  });

  const { data: patientRes, isLoading: patientLoading } = useQuery({
    queryKey: ["patient", selectedPatientId],
    queryFn: () => getPatient(selectedPatientId as string),
    enabled: !!selectedPatientId,
  });

  const { data: allPatientsRes, isLoading: allPatientsLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: getAllPatients,
  });

  // Fetch appointment details if editing/completing a scheduled one
  const { data: appointmentRes } = useQuery({
    queryKey: ["consultation", urlAppointmentId],
    queryFn: () => apiClient.get(`/api/consultations/single/${urlAppointmentId}`).then(res => res.data),
    enabled: !!urlAppointmentId,
  });

  useEffect(() => {
    if (appointmentRes?.success && appointmentRes?.data) {
      const apt = appointmentRes.data;
      setValue("id", apt._id);
      setValue("patientId", apt.patientId?._id || apt.patientId);
      setValue("opNumber", apt.opNumber || "");
      setValue("symptoms", apt.symptoms || "");
      setValue("modalities", apt.modalities || "");
      setValue("generals", apt.generals || "");
      setValue("mentals", apt.mentals || "");
      setValue("diagnosis", apt.diagnosis || "");
      // advice is handled within doctorEditedNotes usually, but if advice field exists
      setValue("advice", apt.advice || "");
    } else if (!urlAppointmentId) {
      // Auto-prefill next OP Number for new consultations
      getNextOPNumber().then(res => {
        if (res.success) {
          setValue("opNumber", res.data.opNumber);
        }
      });
    }
  }, [appointmentRes, setValue, urlAppointmentId]);

  const allPatients = allPatientsRes?.data || [];
  const patient = patientRes?.data;

  const queryClient = useQueryClient();

  const generateMutation = useMutation({
    mutationFn: generateNotes,
    onSuccess: (result) => {
      if (result.success) {
        setValue("advice", result.data.advice);
        toast.success("AI clinical draft generated.");
      }
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "AI Analysis failed.");
      generateMutation.reset();
    }
  });

  const aiNotes = generateMutation.data?.success ? generateMutation.data.data : null;

  interface SavePayload extends SaveConsultationPayload {
    id?: string;
  }

  const saveMutation = useMutation({
    mutationFn: (payload: SavePayload) => {
      if (payload.id) {
        const { id, ...data } = payload;
        return updateConsultation(id, { ...data, status: "Completed" });
      }
      return saveConsultation({ ...payload, status: "Completed" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultations"] });
      queryClient.invalidateQueries({ queryKey: ["patient"] });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success("Consultation saved successfully!");
      if (selectedPatientId) {
        router.push(`/patients/${selectedPatientId}`);
      } else {
        router.push("/appointments");
      }
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to save consultation.");
      saveMutation.reset();
    }
  });

  const onGenerate = (data: FormData) => {
    if (aiEnabled) {
      generateMutation.mutate(data);
    } else {
      handleSave();
    }
  };

  const triggerAnalysis = () => {
    const values = getValues();
    
    // Validate only patient and symptoms for AI
    const result = aiGenerationSchema.safeParse({
      patientId: values.patientId,
      symptoms: values.symptoms
    });

    if (!result.success) {
      const error = result.error.issues[0].message;
      toast.error(error);
      return;
    }

    onGenerate(values);
  };

  const handlePrint = () => {
    const values = getValues();
    if (!patient) {
      toast.error("Please select a patient first.");
      return;
    }

    if (!values.prescriptions || values.prescriptions.length === 0 || !values.prescriptions[0].medicine) {
      toast.error("Please add at least one prescription before printing.");
      return;
    }

    generatePrescriptionPDF({
      clinicName: user?.clinic?.name || "Carewell Clinic",
      clinicAddress: user?.clinic?.address,
      doctorName: user?.name || "Doctor",
      doctorLicense: user?.licenseNumber,
      patientName: patient.name,
      patientAge: patient.age,
      patientGender: patient.gender,
      date: new Date().toLocaleDateString('en-IN'),
      opNumber: values.opNumber,
      diagnosis: values.diagnosis,
      symptoms: values.symptoms,
      modalities: values.modalities,
      generals: values.generals,
      mentals: values.mentals,
      prescriptions: values.prescriptions.map(p => ({
        medicine: p.medicine,
        potency: p.potency,
        form: p.form,
        dosage: p.dosage,
        quantity: p.quantity,
        indication: p.indication
      })),
      advice: values.advice
    });
  };

  const handleSave = () => {
    const values = getValues();

    if (!values.patientId) {
      toast.error("Please select a patient before saving.");
      return;
    }

    if (!values.opNumber) {
      toast.error("OP Number is required.");
      return;
    }
    
    if (aiEnabled && !aiNotes) {
      toast.warning("Please trigger AI analysis to generate medical drafts first.");
      return;
    }

    const prescriptionString = values.prescriptions
      .map(p => `${p.medicine} ${p.potency} (${p.form}) - ${p.dosage}`)
      .join(", ");

    if (!prescriptionString || prescriptionString.length < 5) {
      toast.error("A valid prescription is required to save the case.");
      return;
    }

    saveMutation.mutate({
      id: values.id,
      patientId: values.patientId,
      opNumber: values.opNumber,
      symptoms: values.symptoms,
      modalities: values.modalities,
      generals: values.generals,
      mentals: values.mentals,
      diagnosis: values.diagnosis,
      prescription: prescriptionString,
      additionalNotes: values.additionalNotes,
      aiGeneratedNotes: aiNotes || emptyNotes,
      doctorEditedNotes: { 
        chiefComplaint: aiNotes?.chiefComplaint || values.symptoms,
        assessment: aiNotes?.assessment || values.diagnosis || "",
        advice: values.advice || aiNotes?.advice || ""
      }
    });
  };

  const patientOptions = allPatients.map((p: Patient) => ({
      value: p._id,
      label: `${p.name} (${p.phone})`,
    }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500 fill-mode-both w-full pb-12 px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-[1px] w-8 bg-brand-primary/40" />
            <span className="eyebrow text-brand-primary/70">Clinical Session</span>
          </div>
          <h1 className="text-3xl font-light text-slate-900 tracking-tight">
            Acute <span className="font-semibold text-brand-primary">Consultation</span>
          </h1>
          <div className="mt-2 flex items-center gap-3">
            {patientLoading || allPatientsLoading ? (
              <p className="text-xs font-medium text-slate-400">Syncing patient data...</p>
            ) : patient ? (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Active Patient:</span>
                <span className={clsx("text-sm font-semibold text-slate-900", privacyMode && "blur-sm select-none")}>
                  {patient?.name} {patient?.age ? `(${patient.age}Y)` : ""}
                </span>
              </div>
            ) : (
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Awaiting patient selection</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handlePrint}
            variant="outline"
            className="h-11 rounded-xl px-6 border-slate-200 text-slate-600 hover:bg-slate-50"
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Print Prescription
          </Button>
          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending || (aiEnabled && !aiNotes)}
            variant="primary"
            className="h-11 rounded-xl px-8 shadow-md"
            leftIcon={saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          >
            Save Clinical Record
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Side: Input Form */}
        <div className="xl:col-span-5 space-y-8 bg-white p-6 sm:p-10 rounded-2xl border border-slate-200/60 shadow-sm">
          <div className="border-b border-slate-100 pb-6">
            <h2 className="text-xl font-light text-slate-800 tracking-tight">Clinical <span className="font-semibold">Input</span></h2>
          </div>

          <form onSubmit={handleSubmit(onGenerate)} className="space-y-6">
            {!urlPatientId && (
              <Select
                label="Target Patient"
                options={patientOptions}
                placeholder="Search patient registry..."
                {...register("patientId")}
                error={errors.patientId?.message}
              />
            )}

            <Input
              label="OP Number"
              {...register("opNumber")}
              placeholder="e.g. OP-2024-001"
              error={errors.opNumber?.message}
              required
            />

            <Textarea
              label="Chief Complaint"
              {...register("symptoms")}
              rows={4}
              placeholder="Primary symptoms reported by patient..."
              error={errors.symptoms?.message}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Textarea
                label="Modalities"
                {...register("modalities")}
                rows={2}
                placeholder="Better / Worse from..."
              />

              <Textarea
                label="Mentals"
                {...register("mentals")}
                rows={2}
                placeholder="Disposition, mood..."
              />
            </div>

            <Textarea
              label="Physical Generals"
              {...register("generals")}
              rows={2}
              placeholder="Thirst, appetite, sleep, thermal..."
            />

            <Input
              label="Assessment / Diagnosis"
              {...register("diagnosis")}
              placeholder="E.g. Common Cold"
              leftIcon={<Activity className="w-5 h-5" />}
            />

            <Textarea
              label="Additional Context"
              {...register("additionalNotes")}
              rows={2}
              placeholder="Any other observations..."
            />

            <Button
              type="button"
              onClick={aiEnabled ? triggerAnalysis : handleSave}
              isLoading={generateMutation.isPending || saveMutation.isPending}
              variant={aiEnabled ? "secondary" : "primary"}
              fullWidth
              leftIcon={aiEnabled ? <Sparkles className="w-5 h-5" /> : <Save className="w-5 h-5" />}
              className="mt-4 h-12 rounded-xl"
            >
              {aiEnabled ? "Analyze & Draft Notes" : "Save Clinical Record"}
            </Button>
          </form>
        </div>

        {/* Right Side: AI Generated Notes */}
        {aiEnabled ? (
          <div className="xl:col-span-7">
            <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200/60 shadow-sm h-full flex flex-col relative overflow-hidden group">
              <div className="mb-8 border-b border-slate-100 pb-6 relative z-10">
                <h2 className="text-xl font-light text-slate-800 tracking-tight">AI Clinical <span className="font-semibold">Assistant</span></h2>
              </div>


              {aiNotes ? (
                <div className="space-y-8 flex-1 relative z-10 animate-in fade-in slide-in-from-bottom-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-inner">
                      <p className="eyebrow text-brand-primary mb-3">Drafted Complaint</p>
                      <p className="text-sm font-medium text-slate-700 leading-relaxed">&quot;{aiNotes.chiefComplaint}&quot;</p>
                    </div>

                    <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-inner">
                      <p className="eyebrow text-brand-accent mb-3">Clinical Logic</p>
                      <p className="text-sm font-medium text-slate-700 leading-relaxed border-l-4 border-brand-accent/20 pl-4">{aiNotes.assessment}</p>
                    </div>
                  </div>

                  {aiNotes.aiSuggestions && (
                    <div className="bg-brand-primary/5 p-6 rounded-2xl border border-brand-primary/10 shadow-inner">
                      <label className="eyebrow text-brand-primary mb-3 flex items-center gap-2">
                         <Sparkles className="w-3.5 h-3.5" /> Analytical Suggestions
                       </label>
                      <p className="text-sm font-medium text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {aiNotes.aiSuggestions}
                      </p>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 shadow-inner">
                      <div className="flex items-center justify-between mb-6">
                        <div className="eyebrow flex items-center gap-2">
                          <Pill className="w-3.5 h-3.5 text-brand-primary" /> Clinical Prescriptions
                        </div>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => append({ medicine: "", potency: "", form: "Pills", dosage: "", quantity: "", indication: "" })}
                          className="h-8 rounded-full text-[10px] px-4"
                        >
                          Add Medicine
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {fields.map((field, index) => (
                          <div key={field.id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-2">
                            {/* Rx header */}
                            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-50 bg-slate-50/50">
                              <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Rx {index + 1}</span>
                              {fields.length > 1 && (
                                <button type="button" onClick={() => remove(index)} className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                            <div className="p-4 space-y-3">
                              {/* Row 1: Medicine · Potency · Form */}
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                                <div className="md:col-span-5">
                                  <Input label="Medicine / Remedy" {...register(`prescriptions.${index}.medicine`)} placeholder="e.g. Arsenicum Alb" error={errors.prescriptions?.[index]?.medicine?.message} />
                                </div>
                                <div className="md:col-span-3">
                                  <Input label="Potency" {...register(`prescriptions.${index}.potency`)} placeholder="200c" error={errors.prescriptions?.[index]?.potency?.message} />
                                </div>
                                <div className="md:col-span-4">
                                  <Select label="Physician Form" options={[
                                    { label: "Pills / Globules", value: "Pills" },
                                    { label: "Liquid / Droplets", value: "Liquid" },
                                    { label: "Powder / Trituration", value: "Powder" },
                                    { label: "Tablets", value: "Tablets" },
                                    { label: "Mother Tincture (Q)", value: "Q" },
                                    { label: "External / Ointment", value: "External" },
                                    { label: "Injection", value: "Injection" },
                                  ]} {...register(`prescriptions.${index}.form`)} error={errors.prescriptions?.[index]?.form?.message} />
                                </div>
                              </div>
                              {/* Row 2: Dosage · Quantity */}
                              <div className="grid grid-cols-2 gap-3">
                                <Input label="Dose / Schedule" {...register(`prescriptions.${index}.dosage`)} placeholder="4 pills OD" error={errors.prescriptions?.[index]?.dosage?.message} />
                                <Input label="Quantity / Supply" {...register(`prescriptions.${index}.quantity`)} placeholder="1 dram, 10 ml…" />
                              </div>
                              {/* Row 3: Indication */}
                              <Input label="Indication (Why)" {...register(`prescriptions.${index}.indication`)} placeholder="Clinical reason for this medicine" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Textarea
                      label="Final Plan & Patient Advice"
                      {...register("advice")}
                      rows={6}
                      placeholder="Enter management plan and instructions..."
                      className="bg-white border-slate-200 text-slate-900 focus:border-brand-primary h-auto"
                      labelClassName="text-slate-700"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-8 relative z-10 text-slate-400">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100 shadow-inner">
                    <FileText className="w-8 h-8 opacity-30" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Awaiting Diagnosis</p>
                  <p className="text-sm font-medium text-slate-400 max-w-xs leading-relaxed">
                    Fill out the clinical symptoms on the left and trigger the AI analysis to generate medical drafts.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="xl:col-span-7 space-y-8">
             <div className="bg-white p-6 sm:p-10 rounded-xl border border-slate-200 shadow-sm h-full">
                <div className="border-b border-slate-100 pb-6 mb-8">
                  <h2 className="text-lg font-bold text-slate-800">Manual Documentation</h2>
                </div>
                
                <div className="space-y-8">
                  <Textarea
                    label="Management Plan & Advice"
                    {...register("advice")}
                    rows={8}
                    placeholder="Enter patient instructions and follow-up plan..."
                  />

                  <div className="p-8 rounded-xl border border-slate-100 bg-slate-50 shadow-inner space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="eyebrow flex items-center gap-2 text-brand-primary">
                        <Pill className="w-4 h-4" /> Clinical Prescriptions
                      </div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => append({ medicine: "", potency: "", form: "Pills", dosage: "", quantity: "", indication: "" })}
                        className="h-8 rounded-full text-[10px] px-4"
                        leftIcon={<Plus className="w-3.5 h-3.5" />}
                      >
                        Add Medicine
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative group animate-in fade-in slide-in-from-top-2">
                          <div className="md:col-span-4">
                            <Input 
                              label="Medicine" 
                              {...register(`prescriptions.${index}.medicine`)} 
                              placeholder="e.g. Arsenicum Alb"
                              error={errors.prescriptions?.[index]?.medicine?.message}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Input 
                              label="Potency" 
                              {...register(`prescriptions.${index}.potency`)} 
                              placeholder="200c"
                              error={errors.prescriptions?.[index]?.potency?.message}
                            />
                          </div>
                          <div className="md:col-span-3">
                            <Select 
                              label="Form" 
                              options={[
                                { label: "Pills / Globules", value: "Pills" },
                                { label: "Liquid / Droplets", value: "Liquid" },
                                { label: "Powder / Trituration", value: "Powder" },
                                { label: "Tablets", value: "Tablets" },
                                { label: "Mother Tincture", value: "Q" },
                                { label: "External / Ointment", value: "External" }
                              ]}
                              {...register(`prescriptions.${index}.form`)} 
                              error={errors.prescriptions?.[index]?.form?.message}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Input 
                              label="Dosage" 
                              {...register(`prescriptions.${index}.dosage`)} 
                              placeholder="4 pills TDS"
                              error={errors.prescriptions?.[index]?.dosage?.message}
                            />
                          </div>
                          <div className="md:col-span-1 flex items-end justify-center pb-2">
                            {fields.length > 1 && (
                              <button 
                                type="button" 
                                onClick={() => remove(index)}
                                className="p-2 text-slate-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <div className="md:col-span-6">
                            <Input 
                              label="Quantity / Supply" 
                              {...register(`prescriptions.${index}.quantity`)} 
                              placeholder="1 dram, 10 ml…"
                            />
                          </div>
                          <div className="md:col-span-6">
                            <Input 
                              label="Indication (Why)" 
                              {...register(`prescriptions.${index}.indication`)} 
                              placeholder="Clinical reason for this medicine"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="flex justify-center h-64 items-center"><Loader2 className="w-10 h-10 animate-spin text-brand-primary" /></div>}>
      <ConsultationForm />
    </Suspense>
  );
}
