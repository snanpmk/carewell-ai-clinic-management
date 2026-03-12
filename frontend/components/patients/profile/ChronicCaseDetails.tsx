"use client";

import { ChronicCase } from "@/types/chronicCase";
import { 
  User, Activity, ClipboardList, History, Brain, 
  Thermometer, ShieldCheck, Pill, Microscope, 
  MapPin, Baby, Heart, Zap, FileText, Stethoscope,
  ShieldAlert
} from "lucide-react";
import { clsx } from "clsx";

interface ChronicCaseDetailsProps {
  data: ChronicCase;
}

export function ChronicCaseDetails({ data }: ChronicCaseDetailsProps) {
  const sectionClass = "bg-white/5 rounded-[2rem] border border-white/10 p-8 space-y-6 relative overflow-hidden group transition-all hover:bg-white/[0.07]";
  const eyebrowClass = "eyebrow !text-brand-accent flex items-center gap-3";
  const labelClass = "text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1";
  const valueClass = "text-sm font-bold text-slate-200 leading-relaxed";

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* 1. Administrative Overview */}
      <div className={sectionClass}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-brand-primary/10 to-transparent rounded-bl-full" />
        <div className={eyebrowClass}><ClipboardList className="w-4 h-4" /> Administration & Registry</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div><p className={labelClass}>OP Number</p><p className={valueClass}>{data.header?.opNumber || "N/A"}</p></div>
          <div><p className={labelClass}>Unit</p><p className={valueClass}>{data.header?.unit || "Unit I"}</p></div>
          <div><p className={labelClass}>Case Taken By</p><p className={valueClass}>{data.header?.caseTakenBy || "N/A"}</p></div>
          <div><p className={labelClass}>Religion/Caste</p><p className={valueClass}>{data.demographics?.religion} / {data.demographics?.caste || "N/A"}</p></div>
        </div>
      </div>

      {/* 2 & 3. Clinical Presentation */}
      <div className={sectionClass}>
        <div className={eyebrowClass}><Activity className="w-4 h-4" /> Presentation & Complaints</div>
        <div className="space-y-8">
          <div>
            <p className={labelClass}>Patient Narration (Ipsisima Verba)</p>
            <div className="p-5 bg-white/[0.03] rounded-2xl border border-white/5 italic">
              <p className={valueClass}>{data.initialPresentation?.patientNarration}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className={labelClass}>Presenting Symptoms</p>
              {data.presentingComplaints?.map((complaint, i) => (
                <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-brand-primary text-[10px] font-black uppercase mb-2">{complaint.complaintType} Complaint</p>
                  <p className={valueClass}>
                    <span className="text-brand-accent">[{complaint.location?.organ || 'System'}]</span> {complaint.sensation}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-2 italic">Mod: {complaint.modalities?.aggravation} / {complaint.modalities?.amelioration}</p>
                </div>
              ))}
            </div>
            <div>
              <p className={labelClass}>Physician Interpretation</p>
              <p className={valueClass}>{data.initialPresentation?.physicianInterpretation || "No interpretation logged."}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Personal History & Milestones */}
      <div className={sectionClass}>
        <div className={eyebrowClass}><Baby className="w-4 h-4" /> Personal & Developmental Archive</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <p className={labelClass}>Life Situation</p>
            <div className="space-y-2">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-xs text-slate-500">Marital Status</span>
                <span className="text-xs font-bold text-slate-300">{data.demographics?.maritalStatus || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-xs text-slate-500">Occupation</span>
                <span className="text-xs font-bold text-slate-300">{data.demographics?.occupation || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className={labelClass}>Developmental Milestones</p>
            <div className="grid grid-cols-2 gap-4">
              <div><span className="text-[9px] text-slate-500 uppercase">Walking</span><p className="text-xs font-bold text-slate-300">{data.personalHistory?.developmentMilestones?.walking || '—'}</p></div>
              <div><span className="text-[9px] text-slate-500 uppercase">Talking</span><p className="text-xs font-bold text-slate-300">{data.personalHistory?.developmentMilestones?.talking || '—'}</p></div>
            </div>
          </div>

          <div className="space-y-4">
            <p className={labelClass}>Habits & Diet</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-brand-primary/10 text-brand-primary rounded text-[10px] font-black uppercase">{data.personalHistory?.habitsHobbies?.diet}</span>
              {data.personalHistory?.habitsHobbies?.addictions?.map(a => (
                <span key={a} className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-[10px] font-black uppercase">{a}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 8. Life Space Investigation (Mental Profile) */}
      <div className={sectionClass}>
        <div className={eyebrowClass}><Brain className="w-4 h-4" /> Mental Profile & Disposition</div>
        <div className="space-y-6">
          <div>
            <p className={labelClass}>Dominant Mental Traits</p>
            <div className="flex flex-wrap gap-2">
              {data.lifeSpaceInvestigation?.mentalFeatures?.map(trait => (
                <span key={trait} className="px-3 py-1.5 bg-brand-primary/20 text-brand-accent rounded-xl text-[10px] font-black uppercase border border-brand-primary/30 tracking-widest">
                  {trait}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div>
              <p className={labelClass}>Historical Emotional Upsets</p>
              {data.lifeSpaceInvestigation?.emotionalFactors?.map((ef, i) => (
                <div key={i} className="mb-3 p-3 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-xs font-black text-slate-300 uppercase">{ef.factor}</p>
                  <p className="text-[11px] text-slate-500 mt-1 italic">{ef.occasion} ({ef.duration})</p>
                </div>
              ))}
            </div>
            <div>
              <p className={labelClass}>Thinking & Perception</p>
              <p className={valueClass}>{data.lifeSpaceInvestigation?.otherFeatures?.thinking}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 9 & 11. Constitution & Physicals */}
      <div className={sectionClass}>
        <div className={eyebrowClass}><Thermometer className="w-4 h-4" /> Constitutional & Physical Features</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div><p className={labelClass}>Thermal State</p><p className="text-brand-primary font-black uppercase italic">{data.physicalFeatures?.constitution?.thermal || 'Ambient'}</p></div>
          <div><p className={labelClass}>Temperament</p><p className="text-brand-accent font-black uppercase italic">{data.physicalFeatures?.constitution?.temperament || 'Not Set'}</p></div>
          <div><p className={labelClass}>Build</p><p className={valueClass}>{data.physicalFeatures?.appearance?.build || 'Stocky'}</p></div>
          <div><p className={labelClass}>Thirst</p><p className={valueClass}>{data.physicalFeatures?.generals?.thirst || 'Normal'}</p></div>
        </div>
        <div className="pt-6 border-t border-white/5">
          <p className={labelClass}>Diathetic Tendencies</p>
          <div className="flex flex-wrap gap-2">
            {data.physicalFeatures?.constitution?.tendencies?.map(t => (
              <span key={t} className="px-2 py-1 bg-white/5 text-slate-400 rounded text-[10px] font-bold uppercase border border-white/10">{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* 10. Physical Examination (Systemic) */}
      <div className={sectionClass}>
        <div className={eyebrowClass}><Stethoscope className="w-4 h-4" /> Systemic Examination Findings</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <p className={labelClass}>Respiratory & CVS</p>
            <p className="text-xs text-slate-400 italic leading-relaxed">
              {data.physicalExamination?.systemic?.respiratory || "No findings."}<br/>
              {data.physicalExamination?.systemic?.cardiovascular}
            </p>
          </div>
          <div className="space-y-4">
            <p className={labelClass}>CNS & Special Senses</p>
            <p className="text-xs text-slate-400 italic leading-relaxed">
              {data.physicalExamination?.systemic?.cns || "No findings."}<br/>
              {data.physicalExamination?.systemic?.specialSenses}
            </p>
          </div>
          <div className="space-y-4">
            <p className={labelClass}>GIT & GUR</p>
            <p className="text-xs text-slate-400 italic leading-relaxed">
              {data.physicalExamination?.systemic?.gastrointestinal || "No findings."}
            </p>
          </div>
        </div>
      </div>

      {/* 15. Management & Treatment */}
      <div className={sectionClass}>
        <div className={eyebrowClass}><ShieldCheck className="w-4 h-4" /> Management & Treatment Strategy</div>
        <div className="space-y-8">
          <div>
            <p className={labelClass}>Clinical Management Plan</p>
            <p className={valueClass}>{data.management?.plan || "Standard homeopathic protocol."}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 border-t border-white/5">
            <div>
              <p className={labelClass}><ShieldAlert className="w-3 h-3 inline mr-1" /> Diet Restrictions</p>
              <p className="text-xs font-bold text-slate-300">{data.management?.restrictions?.diet || "No specific restrictions."}</p>
            </div>
            <div>
              <p className={labelClass}><ShieldAlert className="w-3 h-3 inline mr-1" /> Regimen</p>
              <p className="text-xs font-bold text-slate-300">{data.management?.restrictions?.regimen || "Standard activity."}</p>
            </div>
            <div>
              <p className={labelClass}><ShieldAlert className="w-3 h-3 inline mr-1" /> Medicinal</p>
              <p className="text-xs font-bold text-slate-300">{data.management?.restrictions?.medicinal || "Avoid antidotes."}</p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5">
            <p className={labelClass}>Prescriptions Given</p>
            <div className="space-y-4">
              {data.management?.firstPrescription?.medicines?.map((m, i) => (
                <div key={i} className="p-5 bg-brand-primary/10 rounded-[1.5rem] border border-brand-primary/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Pill className="w-6 h-6 text-brand-primary" />
                      <div>
                        <p className="text-lg font-black text-white uppercase italic leading-none">{m.medicine}</p>
                        <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest mt-1">{m.potency}</p>
                      </div>
                    </div>
                    {m.quantity && (
                      <div className="text-right">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Quantity</p>
                        <p className="text-xs font-bold text-brand-accent uppercase">{m.quantity}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-6 pt-3 border-t border-white/5">
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Dose / Schedule</p>
                      <p className="text-xs font-bold text-slate-200">{m.dose}</p>
                    </div>
                    {m.form && (
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Form</p>
                        <p className="text-xs font-bold text-slate-200">{m.form}</p>
                      </div>
                    )}
                  </div>

                  {m.indication && (
                    <div className="pt-3 border-t border-white/5 bg-white/[0.02] -mx-5 px-5 -mb-5 pb-5 rounded-b-[1.5rem]">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Indication (Why)</p>
                      <p className="text-xs text-slate-300 italic leading-relaxed">&quot;{m.indication}&quot;</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 13 & 14. Diagnosis & Analysis */}
      <div className="bg-linear-to-br from-brand-secondary to-slate-950 rounded-[2.5rem] border border-white/10 p-10 shadow-2xl space-y-10">
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <div className={eyebrowClass}><Microscope className="w-4 h-4" /> Clinical Synthesis</div>
          <span className="px-4 py-1.5 rounded-xl bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-primary/20">Final Eval</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <p className={labelClass}>Totality of Symptoms</p>
              <p className="text-lg font-medium text-slate-100 italic leading-relaxed">&quot;{data.analysisAndDiagnosis?.evaluation?.totalityOfSymptoms}&quot;</p>
            </div>
            <div>
              <p className={labelClass}>Miasmatic Expression</p>
              <div className="flex gap-2">
                {data.analysisAndDiagnosis?.evaluation?.miasmaticExpression?.map(m => (
                  <span key={m} className="px-3 py-1 bg-white/10 text-brand-accent rounded-lg text-[10px] font-black uppercase">{m}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
              <p className={labelClass}>Final Homeopathic Diagnosis</p>
              <p className="text-2xl font-black text-brand-accent uppercase tracking-tight italic">{data.analysisAndDiagnosis?.finalDiagnosis?.homeopathicDiagnosis || "Awaiting prescription"}</p>
              <p className="text-[11px] text-slate-500 font-bold mt-2 uppercase">Disease: {data.analysisAndDiagnosis?.finalDiagnosis?.disease || 'Not Specified'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
