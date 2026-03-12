"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Users, FilePlus, Stethoscope, X, ChevronRight, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllPatients } from "@/services/patientService";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";

interface Patient {
  _id: string;
  name: string;
  phone: string;
  age: number;
}

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const { data: response, isLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: getAllPatients,
    enabled: isOpen,
  });

  const patients: Patient[] = useMemo(() => response?.data || [], [response?.data]);

  const filteredPatients = useMemo(() => {
    if (!query) return patients.slice(0, 5);
    const q = query.toLowerCase();
    return patients.filter((p) => 
      p.name.toLowerCase().includes(q) || 
      p.phone.includes(q)
    ).slice(0, 8);
  }, [patients, query]);

  const quickActions = useMemo(() => [
    { name: "Acute Consultation", href: "/consultation/acute", icon: FilePlus, color: "text-brand-primary", bg: "bg-brand-primary/10" },
    { name: "Chronic Case Builder", href: "/consultation/chronic", icon: Stethoscope, color: "text-brand-accent", bg: "bg-brand-accent/10" },
  ].filter(action => !query || action.name.toLowerCase().includes(query.toLowerCase())), [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const handleNavigate = (path: string) => {
    router.push(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-100 flex items-start justify-center pt-[15vh] px-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center px-6 py-4 border-b border-slate-100">
            <Search className="w-5 h-5 text-slate-400 mr-4" />
            <input 
              autoFocus
              className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 font-medium h-12"
              placeholder="Search patients, actions, or tools..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-300 border border-slate-200 px-2 py-1 rounded-lg">ESC</span>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-8 custom-scrollbar">
            {/* Quick Actions */}
            {quickActions.length > 0 && (
              <div>
                <h3 className="px-3 eyebrow !text-slate-400 mb-4">Command Actions</h3>
                <div className="grid grid-cols-1 gap-1">
                  {quickActions.map((action) => (
                    <button
                      key={action.href}
                      onClick={() => handleNavigate(action.href)}
                      className="flex items-center gap-4 p-4 rounded-[2rem] hover:bg-slate-50 transition-all group active:scale-[0.98] w-full"
                    >
                      <div className={clsx("p-3 rounded-2xl transition-transform group-hover:scale-110", action.bg)}>
                        <action.icon className={clsx("w-5 h-5", action.color)} />
                      </div>
                      <span className="flex-1 text-base font-black text-slate-900 tracking-tight text-left uppercase italic">{action.name}</span>
                      <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Patients Search Results */}
            <div>
              <div className="flex items-center justify-between px-3 mb-4">
                <h3 className="eyebrow !text-slate-400">Patient Registry</h3>
                {isLoading && <Loader2 className="w-4 h-4 animate-spin text-brand-primary" />}
              </div>
              
              <div className="space-y-1">
                {filteredPatients.length === 0 ? (
                  <div className="py-16 text-center">
                    <Users className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                    <p className="eyebrow text-slate-300">No matches found</p>
                  </div>
                ) : (
                  filteredPatients.map((patient) => (
                    <button
                      key={patient._id}
                      onClick={() => handleNavigate(`/patients/${patient._id}`)}
                      className="w-full flex items-center gap-4 p-4 rounded-[2rem] hover:bg-slate-50 transition-all group border border-transparent active:scale-[0.98]"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-brand-primary to-brand-accent text-white flex items-center justify-center font-black text-lg shadow-lg shadow-brand-primary/20 transition-transform group-hover:rotate-3">
                        {patient.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-base font-black text-slate-900 tracking-tight uppercase truncate">{patient.name}</p>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{patient.phone} • AGE {patient.age}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-brand-primary transition-all" />
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2">
                <span className="border border-slate-200 px-2 py-1 rounded-lg bg-white text-slate-900 shadow-xs">↑↓</span> NAVIGATION
              </span>
              <span className="flex items-center gap-2">
                <span className="border border-slate-200 px-2 py-1 rounded-lg bg-white text-slate-900 shadow-xs">ENTER</span> SELECT
              </span>
            </div>
            <span className="italic opacity-60">CAREWELL COMMAND CENTER</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
