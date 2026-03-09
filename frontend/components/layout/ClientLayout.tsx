"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { HeartPulse, Menu } from "lucide-react";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <HeartPulse className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-slate-900 tracking-tight">Carewell</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 active:scale-95 transition-all"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col min-h-screen lg:pl-72">
        {/* Main Area */}
        <div className="flex-1 bg-slate-50">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
            {children}
          </div>
        </div>
        
        {/* Footer */}
        <footer className="py-6 px-8 text-xs text-slate-400 border-t border-slate-200 font-medium text-center lg:text-left">
          © {new Date().getFullYear()} Carewell Homeo Clinic. All rights reserved.
        </footer>
      </main>
    </div>
  );
}
