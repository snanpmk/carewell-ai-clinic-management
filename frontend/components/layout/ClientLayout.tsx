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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isPublicRoute = useMemo(() => {
    const publicRoutes = ["/auth", "/privacy", "/terms"];
    return publicRoutes.includes(pathname);
  }, [pathname]);

  useEffect(() => {
    if (mounted) {
      if (!isAuthenticated && !isPublicRoute) {
        router.push("/auth");
      } else if (isAuthenticated && pathname === "/auth") {
        router.push("/");
      } else if (isAuthenticated && user?.role === "staff") {
        // Staff restricted routes
        const clinicalPrefixes = ["/consultation", "/notes", "/ai-tools", "/symptoms", "/terms"];
        const isClinicalRoute = clinicalPrefixes.some(prefix => pathname?.startsWith(prefix));
        if (pathname === "/" || isClinicalRoute) {
          router.push("/patients");
        }
      }
    }
  }, [isAuthenticated, pathname, router, mounted, isPublicRoute, user?.role]);

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

  const publicRoutes = ["/auth", "/privacy", "/terms"];
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
        <div className="sticky top-0 z-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 transition-all duration-300">
          <div className="w-full mx-auto px-4 sm:px-8 py-3.5">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-4 group">
                {/* Refined Avatar with Active Ring */}
                <div className="relative shrink-0 hidden sm:block">
                  <div className="absolute -inset-1 bg-linear-to-tr from-brand-primary/20 to-brand-accent/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative w-11 h-11 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center overflow-hidden shadow-sm transition-transform duration-300 group-hover:scale-[1.02]">
                    {user?.profileImage ? (
                      <Image src={user.profileImage} alt={user.name} width={44} height={44} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300">
                        <UserIcon className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-xs" />
                </div>
                
                <div className="flex flex-col">
                  <h3 className="text-[15px] font-extrabold text-slate-900 leading-tight tracking-tight">
                    {greeting}, {user?.role === 'staff' ? '' : 'Dr. '}{user?.name?.split(' ')[0] || "Practitioner"}
                  </h3>
                  <div className="flex items-center gap-2.5 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <CalendarIcon className="w-3 h-3 text-brand-primary/60" />
                    <span className="opacity-80">{formattedDate}</span>
                  </div>
                </div>
              </div>

              {/* Advanced Search Command Bar */}
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-4 px-5 py-2.5 bg-slate-100/50 border border-slate-200/80 rounded-2xl hover:bg-white hover:border-brand-primary/30 hover:shadow-xl hover:shadow-brand-primary/5 transition-all duration-300 group min-w-[200px] md:min-w-[320px] backdrop-blur-sm"
              >
                <div className="p-1.5 bg-white rounded-lg shadow-xs border border-slate-100 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                  <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                </div>
                <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600 flex-1 text-left transition-colors">Search Patient Registry...</span>
                <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200/60 rounded-lg shadow-2xs">
                  <span className="text-[9px] font-bold text-slate-400">CMD</span>
                  <div className="w-px h-2 bg-slate-200" />
                  <span className="text-[9px] font-bold text-slate-400">K</span>
                </div>
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
