"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FilePlus, 
  Settings, 
  Sparkles,
  Stethoscope,
  HeartPulse,
  ChevronRight,
  LogOut
} from "lucide-react";
import { clsx } from "clsx";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, color: "text-blue-500" },
  { name: "Appointments", href: "/appointments", icon: Calendar, color: "text-purple-500" },
  { name: "Patients", href: "/patients", icon: Users, color: "text-emerald-500" },
  { name: "Acute Consultation", href: "/consultation/acute", icon: FilePlus, color: "text-orange-500" },
  { name: "Chronic Case", href: "/consultation/chronic", icon: Stethoscope, color: "text-rose-500" },
  { name: "AI Tools", href: "/ai-tools", icon: Sparkles, color: "text-indigo-500" },
];

const secondaryItems = [
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}

      <aside className={clsx(
        "fixed inset-y-0 left-0 w-72 bg-slate-950 text-slate-300 flex flex-col border-r border-slate-900 z-50 transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
      {/* Mobile Close Button */}
      <button 
        onClick={onClose}
        className="lg:hidden absolute top-6 right-4 p-2 text-slate-500 hover:text-white transition-colors"
      >
        <ChevronRight className="w-6 h-6 rotate-180" />
      </button>

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-64 bg-linear-to-b from-blue-600/5 to-transparent pointer-events-none" />
      
      {/* Brand */}
      <div className="h-24 flex items-center px-8 relative z-10">
        <div className="relative group cursor-pointer">
          <div className="absolute -inset-1.5 bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
          <div className="relative bg-slate-900 ring-1 ring-slate-800 rounded-xl p-2.5">
            <HeartPulse className="w-6 h-6 text-blue-500" />
          </div>
        </div>
        <div className="ml-4">
          <h1 className="text-lg font-black tracking-tight leading-none bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">Carewell</h1>
          <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] mt-1.5">Doctor Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-4 space-y-8 overflow-y-auto relative z-10">
        <div>
          <h3 className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            Main Menu <div className="h-px flex-1 bg-slate-900" />
          </h3>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              // Exact match for acute consultation, broad match for others to prevent "Chronic" highlighting "Acute"
              const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
                
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "group relative flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 active:scale-[0.98]",
                    isActive
                      ? "bg-linear-to-r from-blue-600/20 to-transparent text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/50"
                  )}
                >
                  {/* Active Indicator Pips */}
                  {isActive && (
                     <div className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  )}
                  
                  <div className={clsx(
                    "p-2 rounded-xl transition-all duration-300",
                    isActive ? "bg-blue-600/20 shadow-inner" : "bg-slate-900/40 group-hover:bg-slate-800"
                  )}>
                    <item.icon className={clsx("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-blue-400" : "text-slate-500")} />
                  </div>
                  
                  <span className="flex-1 tracking-tight">{item.name}</span>
                  
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
           <h3 className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            Configuration <div className="h-px flex-1 bg-slate-900" />
          </h3>
          <nav className="space-y-1.5">
            {secondaryItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300",
                    isActive
                      ? "bg-slate-900 text-white border border-slate-800 shadow-xl"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/50"
                  )}
                >
                  <div className="p-2 rounded-xl bg-slate-900/40 group-hover:bg-slate-800">
                    <item.icon className="w-5 h-5 text-slate-500 group-hover:text-slate-300" />
                  </div>
                  <span className="flex-1 tracking-tight">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Profile Hook */}
      <div className="p-4 mt-auto">
        <div className="group bg-slate-900/40 backdrop-blur-md hover:bg-slate-900 transition-all cursor-pointer p-4 rounded-4xl border border-slate-900 hover:border-slate-800 shadow-2xl relative overflow-hidden">
          {/* Animated Glow */}
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-r from-blue-600/0 via-blue-600/5 to-blue-600/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="relative shrink-0 w-11 h-11">
              <div className="absolute -inset-0.5 bg-linear-to-tr from-blue-600 to-indigo-600 rounded-full opacity-75 blur-[2px]" />
              <div className="relative w-11 h-11 rounded-full bg-slate-950 flex items-center justify-center border border-white/10 overflow-hidden">
                {user?.profileImage ? (
                  <Image src={user.profileImage} alt={user.name || "User"} width={44} height={44} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-black text-white italic">{user?.name ? user.name.charAt(0) : "D"}</span>
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-black text-white truncate tracking-tight">{user?.name || "Doctor"}</p>
              <div className="mt-1">
                <Badge 
                  label={user?.role === "primary" ? "Primary Doctor" : "Doctor"} 
                  variant={user?.role === "primary" ? "warning" : "primary"} 
                />
              </div>
            </div>
            {/* Logout Button inside the profile hook */}
            <button 
              onClick={handleLogout}
              className="p-2 rounded-xl bg-slate-800/50 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
}
