"use client";

import Link from "next/link";
import { ShieldCheck, Lock, EyeOff, Server, ArrowLeft, Globe } from "lucide-react";
import Image from "next/image";

export default function PrivacyPage() {
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
            Privacy Framework
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Patient Data Protection & Privacy Policy</h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            At Carewell, we believe medical privacy is a fundamental human right. Our systems are engineered to protect the sanctity of the doctor-patient relationship.
          </p>
        </div>

        <div className="space-y-12">
          {/* Section 1 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <Lock className="w-5 h-5 text-brand-primary" />
              </div>
              <h2 className="text-xl font-bold">End-to-End Encryption</h2>
            </div>
            <p className="text-slate-600 leading-relaxed pl-12 font-medium">
              Every clinical note, symptom analysis, and patient profile is encrypted both in transit and at rest. We utilize industry-standard AES-256 encryption to ensure that your clinic's data remains exclusively yours.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <EyeOff className="w-5 h-5 text-brand-primary" />
              </div>
              <h2 className="text-xl font-bold">AI Anonymization</h2>
            </div>
            <p className="text-slate-600 leading-relaxed pl-12 font-medium">
              Our AI Clinical Assistant processes data using advanced anonymization protocols. Personally Identifiable Information (PII) is decoupled from clinical symptoms during the synthesis process to ensure maximum confidentiality.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <ShieldCheck className="w-5 h-5 text-brand-primary" />
              </div>
              <h2 className="text-xl font-bold">Practitioner Sovereignty</h2>
            </div>
            <p className="text-slate-600 leading-relaxed pl-12 font-medium">
              You retain 100% ownership of your clinical records. Carewell AI does not sell, trade, or share patient data with third-party pharmaceutical or insurance entities. Your data serves one purpose: helping you provide better care.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <Server className="w-5 h-5 text-brand-primary" />
              </div>
              <h2 className="text-xl font-bold">Cloud Infrastructure</h2>
            </div>
            <p className="text-slate-600 leading-relaxed pl-12 font-medium">
              Our infrastructure is hosted on world-class, HIPAA-compliant servers with multi-regional redundancy. This ensures that your records are not only private but also permanently accessible when you need them most.
            </p>
          </section>
        </div>

        <footer className="mt-24 pt-12 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">
            Last Updated: March 2026 • Carewell Systems Global Privacy Office
          </p>
        </footer>
      </main>
    </div>
  );
}
