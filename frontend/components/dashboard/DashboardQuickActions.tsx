"use client";

import { useRouter } from "next/navigation";
import { 
  Users, 
  Settings, 
  BarChart3, 
  FileText, 
  BrainCircuit,
  Stethoscope
} from "lucide-react";

export function DashboardQuickActions() {
  const router = useRouter();

  const actions = [
    { 
      label: "Patient List", 
      icon: <Users className="w-5 h-5" />, 
      path: "/patients",
      color: "bg-blue-50 text-blue-600" 
    },
    { 
      label: "AI Analysis", 
      icon: <BrainCircuit className="w-5 h-5" />, 
      path: "/ai-tools",
      color: "bg-purple-50 text-purple-600" 
    },
    { 
      label: "Consultation", 
      icon: <Stethoscope className="w-5 h-5" />, 
      path: "/consultation/acute",
      color: "bg-emerald-50 text-emerald-600" 
    },
    { 
      label: "Records", 
      icon: <FileText className="w-5 h-5" />, 
      path: "/appointments",
      color: "bg-amber-50 text-amber-600" 
    },
    { 
      label: "Analytics", 
      icon: <BarChart3 className="w-5 h-5" />, 
      path: "/",
      color: "bg-slate-50 text-slate-600" 
    },
    { 
      label: "Settings", 
      icon: <Settings className="w-5 h-5" />, 
      path: "/settings",
      color: "bg-slate-50 text-slate-600" 
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-semibold text-slate-400">Quick Operations</h2>
      </div>
      <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-6 gap-4">
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={() => router.push(action.path)}
            className="group flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-brand-primary/20 transition-all active:scale-95"
          >
            <div className={`p-2.5 rounded-xl ${action.color} group-hover:scale-110 transition-transform`}>
              {action.icon}
            </div>
            <span className="text-[11px] font-semibold text-slate-600 group-hover:text-brand-primary transition-colors">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
