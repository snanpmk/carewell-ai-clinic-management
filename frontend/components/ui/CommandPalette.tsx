"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Users, FilePlus, Stethoscope, Sparkles, X, ChevronRight, Loader2 } from "lucide-react";
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
    { name: "Acute Consultation", href: "/consultation/acute", icon: FilePlus, color: "text-orange-500", bg: "bg-orange-50" },
    { name: "Chronic Case Case", href: "/consultation/chronic", icon: Stethoscope, color: "text-rose-500", bg: "bg-rose-50" },
    { name: "AI Tools", href: "/ai-tools", icon: Sparkles, color: "text-indigo-500", bg: "bg-indigo-50" },
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
              className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 font-medium"
              placeholder="Search patients, actions, or tools..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-300 border border-slate-200 px-1.5 py-0.5 rounded-md">ESC</span>
              <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6 custom-scrollbar">
            {/* Quick Actions */}
            {quickActions.length > 0 && (
              <div>
                <h3 className="px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Quick Actions</h3>
                <div className="grid grid-cols-1 gap-1">
                  {quickActions.map((action) => (
                    <button
                      key={action.href}
                      onClick={() => handleNavigate(action.href)}
                      className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-all group"
                    >
                      <div className={clsx("p-2.5 rounded-xl transition-transform group-hover:scale-110", action.bg)}>
                        <action.icon className={clsx("w-5 h-5", action.color)} />
                      </div>
                      <span className="flex-1 text-sm font-bold text-slate-700 text-left">{action.name}</span>
                      <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Patients Search Results */}
            <div>
              <div className="flex items-center justify-between px-2 mb-3">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patients</h3>
                {isLoading && <Loader2 className="w-3 h-3 animate-spin text-blue-500" />}
              </div>
              
              <div className="space-y-1">
                {filteredPatients.length === 0 ? (
                  <div className="p-10 text-center">
                    <Users className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-400">No patients found</p>
                  </div>
                ) : (
                  filteredPatients.map((patient) => (
                    <button
                      key={patient._id}
                      onClick={() => handleNavigate(`/patients/${patient._id}`)}
                      className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {patient.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-bold text-slate-800 tracking-tight">{patient.name}</p>
                        <p className="text-[11px] font-medium text-slate-500">{patient.phone} • Age {patient.age}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="border border-slate-200 px-1 py-0.5 rounded shadow-xs bg-white text-slate-500">↑↓</span> Select
              </span>
              <span className="flex items-center gap-1.5">
                <span className="border border-slate-200 px-1 py-0.5 rounded shadow-xs bg-white text-slate-500">ENTER</span> Open
              </span>
            </div>
            <span>Carewell AI Command Center</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
