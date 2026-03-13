"use client";

import Link from "next/link";
import { Scale, ArrowLeft, ShieldCheck, FileText, Gavel, UserCheck, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Simple Header */}
      <header className="border-b border-slate-100 py-6 px-8 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 shadow-sm flex items-center justify-center bg-white">
            <Image src="/logo.svg" alt="Logo" width={32} height={32} className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-lg tracking-tight">Carewell AI</span>
        </div>
        <Link href="/auth" className="flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline underline-offset-4 transition-all">
          <ArrowLeft className="w-4 h-4" /> Back to Sign-in
        </Link>
      </header>

      <main className="max-w-4xl mx-auto py-20 px-6">
        <div className="space-y-4 mb-16 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            Legal Framework & Compliance
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">Application <span className="text-brand-primary">Terms of Service</span></h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
            Please review these terms carefully. By accessing Carewell AI, you agree to comply with the professional and legal standards outlined below.
          </p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-4">Last Updated: March 13, 2026</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Sidebar Nav (Desktop) */}
          <aside className="hidden md:block md:col-span-3 space-y-4 sticky top-32 h-fit">
             <div className="p-1 rounded-2xl bg-slate-50 border border-slate-100">
                <nav className="flex flex-col">
                   <a href="#acceptance" className="px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-brand-primary uppercase tracking-widest transition-colors">1. Acceptance</a>
                   <a href="#professional" className="px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-brand-primary uppercase tracking-widest transition-colors">2. Professional Use</a>
                   <a href="#ai-disclaimer" className="px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-brand-primary uppercase tracking-widest transition-colors">3. AI Disclaimer</a>
                   <a href="#data-privacy" className="px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-brand-primary uppercase tracking-widest transition-colors">4. Data & Privacy</a>
                   <a href="#liability" className="px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-brand-primary uppercase tracking-widest transition-colors">5. Liability</a>
                </nav>
             </div>
          </aside>

          {/* Main Content */}
          <div className="md:col-span-9 space-y-20">
            
            {/* Section 1 */}
            <section id="acceptance" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-4 text-slate-900">
                <div className="p-3 rounded-2xl bg-brand-primary/5 text-brand-primary border border-brand-primary/10 shadow-sm">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">1. Acceptance of Terms</h2>
              </div>
              <div className="space-y-4 text-slate-600 leading-relaxed font-medium">
                <p>
                  By registering for or using the Carewell AI platform, you confirm that you have read, understood, and agreed to be bound by these Terms of Service. If you are entering into these terms on behalf of a clinic or medical institution, you represent that you have the authority to bind such entity.
                </p>
                <p className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm italic">
                  &quot;User&quot; refers to any licensed medical practitioner, associate doctor, or authorized staff member accessing the platform.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="professional" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-4 text-slate-900">
                <div className="p-3 rounded-2xl bg-brand-accent/5 text-brand-accent border border-brand-accent/10 shadow-sm">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">2. Professional Medical Use</h2>
              </div>
              <div className="space-y-4 text-slate-600 leading-relaxed font-medium">
                <p>
                  Carewell AI is a **Professional Decision Support Tool** exclusively for licensed medical practitioners. It is not intended for use by patients or non-licensed individuals.
                </p>
                <ul className="list-disc pl-6 space-y-3 marker:text-brand-primary">
                  <li>Users must provide a valid medical license number during registration.</li>
                  <li>Users are responsible for the accuracy of all clinical data entered.</li>
                  <li>The platform must not be used as the sole basis for critical medical decisions without practitioner verification.</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section id="#ai-disclaimer" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-4 text-slate-900">
                <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 shadow-sm">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">3. AI Insights & Disclaimer</h2>
              </div>
              <div className="space-y-4 text-slate-600 leading-relaxed font-medium">
                <p>
                  The AI-generated notes, assessments, and repertorial insights are intended as drafts and recommendations to assist the practitioner. 
                </p>
                <div className="p-6 bg-amber-50/50 rounded-[2rem] border border-amber-100">
                   <p className="text-amber-900 font-bold mb-2 uppercase tracking-widest text-[10px]">Mandatory Clinical Verification</p>
                   <p className="text-sm text-amber-800 leading-relaxed">
                     The practitioner (The User) holds absolute sovereignty. Every AI suggestion must be reviewed, edited if necessary, and digitally signed off by the licensed practitioner before being committed to the official patient record.
                   </p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section id="data-privacy" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-4 text-slate-900">
                <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
                  <FileText className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">4. Data Governance & Privacy</h2>
              </div>
              <div className="space-y-4 text-slate-600 leading-relaxed font-medium">
                <p>
                  We prioritize data security. All patient records are encrypted and siloed at the clinic level. Users are responsible for maintaining the confidentiality of their credentials and ensuring that their use of the platform complies with local data protection laws (e.g., GDPR, HIPAA).
                </p>
                <p>
                  Refer to our <Link href="/privacy" className="text-brand-primary font-bold hover:underline">Privacy Policy</Link> for detailed information on how we handle clinical data.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section id="liability" className="scroll-mt-32 space-y-6 pb-20">
              <div className="flex items-center gap-4 text-slate-900">
                <div className="p-3 rounded-2xl bg-red-50 text-red-600 border border-red-100 shadow-sm">
                  <Gavel className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">5. Limitation of Liability</h2>
              </div>
              <div className="space-y-4 text-slate-600 leading-relaxed font-medium">
                <p>
                  Carewell Systems shall not be liable for any medical malpractice, clinical errors, or patient outcomes resulting from the use of the platform. The platform is provided &quot;as-is,&quot; and the practitioner assumes all professional risk associated with medical decision-making.
                </p>
              </div>
            </section>

          </div>
        </div>

        <footer className="mt-24 pt-12 border-t border-slate-100 text-center">
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100">
            <Scale className="w-4 h-4 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Legal Code: CW-TOS-2026-V1</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">© 2026 Carewell Systems. All professional rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
