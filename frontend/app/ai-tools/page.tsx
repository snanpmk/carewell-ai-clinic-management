"use client";

import { FileSearch, Mic, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AIToolsPage() {
  const tools = [
    {
      title: "Consultation Notes Generator",
      description: "Convert raw patient symptoms and observations into cleanly structured clinical notes (Chief Complaint, Assessment, Advice).",
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      link: "/consultation/acute"
    },
    {
      title: "Patient History Summarizer",
      description: "Instantly summarize months or years of patient visits into a single, quickly readable paragraph to understand their clinical background.",
      icon: FileSearch,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      link: "/patients"
    },
    {
      title: "Voice-to-Text Scribe (Coming Soon)",
      description: "Record your patient consultations directly through your microphone and let AI handle transcription and note formatting automatically.",
      icon: Mic,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100",
      link: "#",
      disabled: true
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-4 mb-8">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-[1px] w-8 bg-brand-primary/40" />
            <span className="eyebrow text-brand-primary/70">Intelligence</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-light text-slate-900 tracking-tight">
            AI Tools <span className="font-semibold text-brand-primary">Center</span>
          </h1>
          <p className="text-sm text-slate-500 max-w-md leading-relaxed mt-1">Enhance your clinical workflow with artificial intelligence.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, i) => (
          <div key={i} className={`relative bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col transition-all duration-200 ${tool.disabled ? 'opacity-70 grayscale-[0.3]' : 'hover:shadow-md hover:border-blue-300'}`}>
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 border ${tool.bg} ${tool.color} ${tool.border}`}>
              <tool.icon className="w-6 h-6" />
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-3">{tool.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-8 flex-1">
              {tool.description}
            </p>

            {tool.disabled ? (
              <span className="inline-flex items-center justify-center w-full py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold tracking-wide text-slate-400 uppercase">
                In Development
              </span>
            ) : (
              <Link 
                href={tool.link}
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-sm font-semibold text-white transition-colors"
              >
                Access Tool
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
