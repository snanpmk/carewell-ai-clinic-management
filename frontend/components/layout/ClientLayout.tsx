"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { HeartPulse, Menu, Loader2, Search } from "lucide-react";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { useAuthStore } from "@/store/useAuthStore";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!isAuthenticated && pathname !== "/auth") {
        router.push("/auth");
      } else if (isAuthenticated && pathname === "/auth") {
        router.push("/");
      }
    }
  }, [isAuthenticated, pathname, router, mounted]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!mounted) {
    return (
      <div className="flex w-full h-screen items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // If unauthenticated or accessing auth page, just render children (the auth page)
  if (!isAuthenticated || pathname === "/auth") {
     return <div className="flex-1 flex flex-col min-h-screen">{children}</div>;
  }

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

      {/* Desktop Search Toggle (Floating Bottom Right or Top) */}
      <button 
        onClick={() => setIsSearchOpen(true)}
        className="hidden lg:flex fixed bottom-8 left-80 z-40 items-center gap-3 px-5 py-3 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 hover:-translate-y-1 transition-all group"
      >
        <div className="p-1.5 bg-blue-500 rounded-lg group-hover:rotate-12 transition-transform">
          <Search className="w-4 h-4 text-white" />
        </div>
        <div className="flex flex-col items-start leading-none">
          <span className="text-xs font-black text-slate-900 tracking-tight">Global Search</span>
          <span className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">Ctrl + K</span>
        </div>
      </button>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      <main className="flex-1 flex flex-col min-h-screen lg:pl-72">
        {/* Main Area */}
        <div className="flex-1 bg-slate-50">
          <div className="w-full  mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
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
