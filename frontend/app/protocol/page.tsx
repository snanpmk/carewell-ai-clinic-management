"use client";

import Link from "next/link";
import { ClipboardCheck, Zap, UserCheck, Scale, ArrowLeft, BookOpen, GraduationCap, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function ProtocolPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Simple Header */}
      <header className="border-b border-slate-100 py-6 px-8 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200">
            <Image src="/logo.svg" alt="Logo" width={32} height={32} className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-lg tracking-tight">Carewell AI</span>
        </div>
        <Link href="/auth" className="flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline underline-offset-4">
          <ArrowLeft className="w-4 h-4" /> Back to Sign-in
        </Link>
      </header>

      <main className="max-w-3xl mx-auto py-20 px-6">
        <div className="space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/5 text-[10px] font-bold text-brand-primary uppercase tracking-widest">
            Clinical Standards & Framework
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Advanced AI Clinical Protocols</h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            Carewell AI is engineered to bridge the gap between rigorous traditional documentation and modern clinical efficiency.
          </p>
        </div>

        <div className="space-y-12">
          {/* Section 1: The Reference */}
          <section className="space-y-4 bg-slate-50/50 p-8 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-sm">
                <GraduationCap className="w-5 h-5 text-brand-primary" />
              </div>
              <h2 className="text-xl font-bold">Standardized Framework</h2>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">
              The data architecture of our Chronic Evaluation module is strictly modeled after the <span className="text-slate-900 font-bold">Standard Homeopathic Case Study Record for House Surgeons (Govt. of Kerala)</span>. By following this government-recognized format, we ensure that practitioners maintain clinical depth while utilizing AI to handle the heavy lifting of synthesis.
            </p>
          </section>

          {/* Section 2: Relevance */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <Zap className="w-5 h-5 text-brand-primary" />
              </div>
              <h2 className="text-xl font-bold">Workload Reduction</h2>
            </div>
            <p className="text-slate-600 leading-relaxed pl-12 font-medium">
              The primary relevance of this application is the massive reduction in manual documentation time. By automating clinical drafting and repertorial mapping, doctors can shift their focus from clerical tasks back to patient care and observation.
            </p>
          </section>

          {/* Section 3: Practitioner Identity */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <ShieldCheck className="w-5 h-5 text-brand-primary" />
              </div>
              <h2 className="text-xl font-bold">Licensed Access Only</h2>
            </div>
            <p className="text-slate-600 leading-relaxed pl-12 font-medium">
              Carewell AI is exclusively a <span className="text-slate-900 font-bold text-sm">Professional Decision Support Tool</span>. It is restricted to practitioners with a valid medical practicing license. The system captures medical license numbers during registration to ensure that only qualified professionals can utilize the clinical analysis tools.
            </p>
          </section>

          {/* Section 4: Operational Protocol */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <Scale className="w-5 h-5 text-brand-primary" />
              </div>
              <h2 className="text-xl font-bold">The "House Surgeon" Model</h2>
            </div>
            <p className="text-slate-600 leading-relaxed pl-12 font-medium">
              Operationally, the AI functions similarly to a high-performing House Surgeon: it collects, organizes, and drafts clinical findings. However, the attending doctor (The User) holds absolute sovereignty. Every AI suggestion must be reviewed and digitally signed off by the practitioner before being committed to the permanent record.
            </p>
          </section>
        </div>

        <footer className="mt-24 pt-12 border-t border-slate-100 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100">
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SOP Reference: GK-HCSR-2026</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
