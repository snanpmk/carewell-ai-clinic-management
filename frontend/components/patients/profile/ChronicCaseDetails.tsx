"use client";

import { ChronicCase } from "@/types/chronicCase";
import { 
  Activity, ClipboardList, Brain, 
  Thermometer, Microscope, 
  Stethoscope,
  User,
  Layers,
  HeartPulse,
  Navigation,
  Pill
} from "lucide-react";
import { clsx } from "clsx";

interface ChronicCaseDetailsProps {
  data: ChronicCase;
}

function Section({ icon: Icon, title, children, className }: { icon: React.ElementType, title: string, children: React.ReactNode, className?: string }) {
  return (
    <div className={clsx("bg-white rounded-[2rem] border border-slate-200 p-8 shadow-xs space-y-6 relative overflow-hidden group transition-all hover:border-brand-primary/20", className)}>
      <div className="flex items-center justify-between">
        <div className="eyebrow flex items-center gap-3 text-slate-900">
          <Icon className="w-4 h-4 text-brand-primary" /> {title}
        </div>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function InfoLabel({ label, value, subValue }: { label: string, value?: string | number, subValue?: string }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      <p className="text-sm font-bold text-slate-800 leading-tight">{value || "—"}</p>
      {subValue && <p className="text-[10px] text-slate-500 mt-0.5 italic">{subValue}</p>}
    </div>
  );
}

export function ChronicCaseDetails({ data }: ChronicCaseDetailsProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* 1. Administrative & Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Section icon={ClipboardList} title="Clinical Identity" className="lg:col-span-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <InfoLabel label="OP Number" value={data.header?.opNumber} />
            <InfoLabel label="Case Taken By" value={data.header?.caseTakenBy} />
            <InfoLabel label="Unit" value={data.header?.unit} />
            <InfoLabel label="Registry Date" value={data.header?.date ? new Date(data.header.date).toLocaleDateString() : undefined} />
          </div>
        </Section>
        <Section icon={User} title="Patient Overview">
          <div className="grid grid-cols-2 gap-6">
            <InfoLabel label="Status" value={data.demographics?.maritalStatus} />
            <InfoLabel label="Religion" value={data.demographics?.religion} subValue={data.demographics?.caste} />
          </div>
        </Section>
      </div>

      {/* 2. Opening Narrative */}
      <Section icon={Navigation} title="Opening Narrative">
        <div className="space-y-6">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 italic relative">
            <div className="absolute -top-3 left-6 px-3 py-1 bg-white border border-slate-200 rounded-full text-[9px] font-black text-brand-primary uppercase tracking-widest shadow-sm">Ipsisima Verba</div>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">&quot;{data.initialPresentation?.patientNarration}&quot;</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InfoLabel label="Physician's Interpretation" value={data.initialPresentation?.physicianInterpretation} />
            <InfoLabel label="Objective Observations" value={data.initialPresentation?.physicianObservation} />
          </div>
        </div>
      </Section>

      {/* 3. Symptom Analysis (LSMA) */}
      <Section icon={Activity} title="Granular Symptom Totality">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.presentingComplaints?.map((comp, i) => (
            <div key={i} className="p-6 bg-slate-50/50 rounded-3xl border border-slate-200 space-y-4 hover:bg-white hover:shadow-lg transition-all border-l-4 border-l-brand-primary">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 bg-brand-primary/10 text-brand-primary rounded-lg text-[9px] font-black uppercase tracking-widest">{comp.complaintType} Complaint</span>
                <span className="text-[10px] font-bold text-slate-400">{comp.location?.duration}</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-brand-primary uppercase mb-1">Location & Sensation</p>
                <p className="text-sm font-bold text-slate-800">
                  <span className="text-slate-400">[{comp.location?.system || 'System'}]</span> {comp.sensation}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <p className="text-[9px] font-bold text-red-400 uppercase mb-1">Aggravation (&lt;)</p>
                  <p className="text-[11px] text-slate-600 font-medium">{comp.modalities?.aggravation || "—"}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-emerald-500 uppercase mb-1">Amelioration (&gt;)</p>
                  <p className="text-[11px] text-slate-600 font-medium">{comp.modalities?.amelioration || "—"}</p>
                </div>
              </div>
              {comp.accompaniments && (
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-1 text-center">Accompaniments</p>
                  <p className="text-xs text-slate-500 italic text-center leading-relaxed px-4">{comp.accompaniments}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* 4. Timeline & History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Section icon={Layers} title="Disease Evolution">
          <div className="space-y-4">
            <InfoLabel label="HPI Narrative" value={data.historyOfPresentIllness?.narrative} />
            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-100">
              <InfoLabel label="Onset" value={data.historyOfPresentIllness?.onset} />
              <InfoLabel label="Cause" value={data.historyOfPresentIllness?.cause} />
              <InfoLabel label="Treatments" value={data.historyOfPresentIllness?.previousTreatments} />
            </div>
          </div>
        </Section>
        <Section icon={HeartPulse} title="Family & Past Archive">
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Previous Major Illnesses</p>
              <div className="space-y-2">
                {data.previousIllnessHistory?.map((h, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="font-black text-brand-primary w-8">{h.age}y</span>
                    <span className="font-bold text-slate-700">{h.event}</span>
                    <span className="text-slate-400 ml-auto italic">{h.treatment}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* 5. Mental & Physical Context */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Section icon={Brain} title="Mental Disposition" className="lg:col-span-2">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {data.lifeSpaceInvestigation?.mentalFeatures?.map(f => (
                <span key={f} className="px-3 py-1 bg-brand-primary/5 text-brand-primary rounded-full text-[10px] font-bold uppercase border border-brand-primary/10">
                  {f}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Emotional Factors</p>
                {data.lifeSpaceInvestigation?.emotionalFactors?.map((e, i) => (
                  <div key={i} className="mb-2 text-xs">
                    <span className="font-bold text-slate-800">{e.factor}</span>
                    <span className="text-slate-500 italic ml-2">({e.occasion})</span>
                  </div>
                ))}
              </div>
              <InfoLabel label="Thinking Patterns" value={data.lifeSpaceInvestigation?.otherFeatures?.thinking} />
            </div>
          </div>
        </Section>
        <Section icon={Thermometer} title="Constitution">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <InfoLabel label="Thermal" value={data.physicalFeatures?.constitution?.thermal} />
              <InfoLabel label="Thirst" value={data.physicalFeatures?.generals?.thirst} />
            </div>
            <div className="pt-4 border-t border-slate-100">
              <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Tendencies</p>
              <div className="flex flex-wrap gap-1.5">
                {data.physicalFeatures?.constitution?.tendencies?.map(t => (
                  <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-bold uppercase border border-slate-200">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* 6. Physical Exam */}
      <Section icon={Stethoscope} title="Physical Examination">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <InfoLabel label="Weight" value={data.physicalExamination?.vitals?.weight} subValue={data.physicalExamination?.vitals?.bmi ? `BMI: ${data.physicalExamination.vitals.bmi}` : undefined} />
          <InfoLabel label="Blood Pressure" value={data.physicalExamination?.vitals?.bp} />
          <InfoLabel label="Pulse" value={data.physicalExamination?.vitals?.pulse} />
          <InfoLabel label="Respiration" value={data.physicalExamination?.vitals?.respiration} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-slate-100">
          <InfoLabel label="Respiratory / CVS" value={data.physicalExamination?.systemic?.respiratory} subValue={data.physicalExamination?.systemic?.cardiovascular} />
          <InfoLabel label="CNS / Special Senses" value={data.physicalExamination?.systemic?.cns} subValue={data.physicalExamination?.systemic?.specialSenses} />
          <InfoLabel label="Musculoskeletal" value={data.physicalExamination?.systemic?.musculoskeletal} />
        </div>
      </Section>

      {/* 7. Clinical Synthesis (Simplified UI) */}
      <Section icon={Microscope} title="Clinical Synthesis">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Totality & Disease Mapping */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase text-slate-400">Clinical Totality</p>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
                  &quot;{data.analysisAndDiagnosis?.evaluation?.totalityOfSymptoms || "Totality not yet established."}&quot;
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Dominant Miasm</p>
                <div className="flex flex-wrap gap-2">
                  {data.analysisAndDiagnosis?.evaluation?.miasmaticExpression?.length ? (
                    data.analysisAndDiagnosis.evaluation.miasmaticExpression.map(m => (
                      <span key={m} className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-lg text-[10px] font-black uppercase">
                        {m}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">Not determined</span>
                  )}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Disease Mapping</p>
                <p className="text-sm font-bold text-slate-800 capitalize">
                  {data.analysisAndDiagnosis?.finalDiagnosis?.disease || 'Functional / Not Specified'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Remedy & Prescription */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-brand-primary/5 rounded-2xl border border-brand-primary/20">
              <p className="text-[10px] font-black uppercase text-brand-primary/70 mb-2">Simillimum Suggestion</p>
              <p className="text-2xl font-black text-brand-primary uppercase italic leading-tight">
                {data.analysisAndDiagnosis?.finalDiagnosis?.homeopathicDiagnosis || "Pending"}
              </p>
            </div>
            
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Pill className="w-4 h-4 text-emerald-500" />
                <p className="text-[10px] font-black uppercase text-slate-500">First Prescription</p>
              </div>
              
              {data.management?.firstPrescription?.medicines?.length ? (
                <div className="space-y-3">
                  {data.management.firstPrescription.medicines.map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                      <div>
                        <p className="text-sm font-bold text-slate-800 uppercase">{m.medicine} <span className="text-emerald-600 ml-1">{m.potency}</span></p>
                        {(m.dose || m.quantity) && (
                          <p className="text-[10px] text-slate-500 mt-1 uppercase font-semibold">
                            {m.dose} {m.quantity && `• Qty: ${m.quantity}`}
                          </p>
                        )}
                      </div>
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <span className="text-[10px] font-black">{idx + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No prescription recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
