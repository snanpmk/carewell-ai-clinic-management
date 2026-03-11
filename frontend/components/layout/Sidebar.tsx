"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FilePlus, 
  Settings, 
  Stethoscope,
  ChevronRight,
  LogOut,
  Shield,
  ShieldAlert,
  User as UserIcon
} from "lucide-react";
import { clsx } from "clsx";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Appointments", href: "/appointments", icon: Calendar },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "Acute Visit", href: "/consultation/acute", icon: FilePlus },
  { name: "Chronic Case", href: "/consultation/chronic", icon: Stethoscope },
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
  const { privacyMode, togglePrivacyMode } = useUIStore();

  const isStaff = user?.role === "staff";

  const filteredNavItems = navItems.filter(item => {
    if (isStaff) {
      return ["Appointments", "Patients"].includes(item.name);
    }
    return true;
  });

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 w-64 bg-slate-950 text-slate-400 flex flex-col border-r border-slate-900 z-50 transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile Close */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-6 right-4 p-2 text-slate-500 hover:text-white transition-colors"
        >
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>

        {/* Logo Section */}
        <div className="h-20 flex items-center px-6 mb-4">
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 rounded-full bg-white border border-brand-primary/20 shadow-inner overflow-hidden flex items-center justify-center shrink-0">
               <Image src="/logo.svg" alt="Logo" width={36} height={36} className="w-full h-full object-cover brightness-110" />
             </div>
             <div className="flex flex-col">
               <span className="text-base font-semibold text-white tracking-tight leading-none">Carewell</span>
               <span className="text-[10px] font-medium text-brand-primary uppercase tracking-wider mt-1">AI Clinical</span>
             </div>
          </div>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto px-4 space-y-8 no-scrollbar">
          
          {/* Main Workspace */}
          <div className="space-y-1">
            <p className="px-3 mb-4 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
              Workspace
            </p>
            <nav className="space-y-1">
              {filteredNavItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname?.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={clsx(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative",
                      isActive
                        ? "text-white bg-white/5"
                        : "hover:text-slate-200 hover:bg-white/5"
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 w-1 h-5 bg-brand-primary rounded-r-full" />
                    )}
                    <item.icon className={clsx(
                      "w-5 h-5 transition-colors",
                      isActive ? "text-brand-primary" : "text-slate-500 group-hover:text-slate-300"
                    )} />
                    <span className="flex-1">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* System & Tools */}
          <div className="space-y-1">
            <p className="px-3 mb-4 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
              Management
            </p>
            <nav className="space-y-1">
              {secondaryItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={clsx(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative",
                      isActive
                        ? "text-white bg-white/5"
                        : "hover:text-slate-200 hover:bg-white/5"
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 w-1 h-5 bg-brand-primary rounded-r-full" />
                    )}
                    <item.icon className={clsx(
                      "w-5 h-5 transition-colors",
                      isActive ? "text-brand-primary" : "text-slate-500 group-hover:text-slate-300"
                    )} />
                    <span className="flex-1">{item.name}</span>
                  </Link>
                );
              })}

              {/* Privacy Mode Toggle */}
              <button
                onClick={togglePrivacyMode}
                className={clsx(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative",
                  privacyMode
                    ? "text-orange-400 bg-orange-400/5"
                    : "hover:text-slate-200 hover:bg-white/5"
                )}
              >
                {privacyMode ? (
                  <ShieldAlert className="w-5 h-5" />
                ) : (
                  <Shield className="w-5 h-5 text-slate-500 group-hover:text-slate-300" />
                )}
                <span className="flex-1 text-left">Privacy Mode</span>
                {privacyMode && (
                  <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse shadow-[0_0_8px_rgba(251,146,60,0.5)]" />
                )}
              </button>
            </nav>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-4 space-y-3 mt-auto">
          <div className="bg-slate-900/50 rounded-xl border border-slate-900 p-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                <UserIcon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {user?.role === "primary" ? "Administrator" : isStaff ? "Reception / Staff" : "Practitioner"}
                </p>
                <p className="text-[9px] text-slate-500 mt-0.5">
                  Clinic Staff
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleLogout}
            variant="ghost"
            fullWidth
            size="sm"
            className="text-red-400 hover:text-red-500 hover:bg-red-400/10 border-red-400/5 hover:border-red-400/20 rounded-xl justify-center h-10 min-w-0"
            leftIcon={<LogOut className="w-4 h-4" />}
          >
            Sign Out
          </Button>
        </div>
      </aside>
    </>
  );
}
