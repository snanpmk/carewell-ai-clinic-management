"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Menu, Loader2, Search, User as UserIcon, Calendar as CalendarIcon } from "lucide-react";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const publicRoutes = ["/auth", "/privacy", "/protocol"];
    if (mounted) {
      if (!isAuthenticated && !publicRoutes.includes(pathname)) {
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

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  }, []);

  if (!mounted) {
    return (
      <div className="flex w-full h-screen items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  const publicRoutes = ["/auth", "/privacy", "/protocol"];
  if (!isAuthenticated || publicRoutes.includes(pathname)) {
     return <div className="flex-1 flex flex-col min-h-screen bg-white">{children}</div>;
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 shadow-sm flex items-center justify-center bg-white">
            <Image src="/logo.svg" alt="Logo" width={36} height={36} className="w-full h-full object-cover" />
          </div>
          <span className="font-semibold text-slate-900 tracking-tight">Carewell</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 active:scale-95 transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      <main className="flex-1 flex flex-col min-h-screen lg:pl-64">
        {/* Global Header */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="w-full  mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative shrink-0 hidden sm:block">
                  <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
                    {user?.profileImage ? (
                      <Image src={user.profileImage} alt={user.name} width={40} height={40} className="object-cover" />
                    ) : (
                      <UserIcon className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 leading-none">
                    {greeting}, Dr. {user?.name?.split(' ')[0] || "Practitioner"}
                  </h2>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                    <CalendarIcon className="w-3 h-3" />
                    {formattedDate}
                  </div>
                </div>
              </div>

              {/* Search Toggle - Wider */}
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-all group min-w-[180px] md:min-w-[240px]"
              >
                <Search className="w-4 h-4 text-slate-400 group-hover:text-brand-primary transition-colors" />
                <span className="text-[11px] font-semibold text-slate-500 flex-1 text-left">Search patients...</span>
                <span className="text-[9px] font-bold text-slate-300 border border-slate-200 px-1.5 py-0.5 rounded bg-white hidden lg:block shadow-xs">⌘K</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-slate-50">
          <div className="w-full  mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            {children}
          </div>
        </div>
        
        {/* Footer */}
        <footer className="py-6 px-8 text-[11px] text-slate-400 border-t border-slate-200 font-medium text-center lg:text-left bg-white">
          © {new Date().getFullYear()} Carewell Homeo Clinic. All rights reserved.
        </footer>
      </main>
    </div>
  );
}
