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
  LogOut,
  Shield,
  ShieldAlert
} from "lucide-react";
import { clsx } from "clsx";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, color: "text-brand-primary" },
  { name: "Appointments", href: "/appointments", icon: Calendar, color: "text-brand-accent" },
  { name: "Patients", href: "/patients", icon: Users, color: "text-brand-primary" },
  { name: "Acute Consultation", href: "/consultation/acute", icon: FilePlus, color: "text-brand-accent" },
  { name: "Chronic Case", href: "/consultation/chronic", icon: Stethoscope, color: "text-brand-primary" },
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

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 w-64 bg-slate-950 text-slate-300 flex flex-col border-r border-slate-900 z-50 transition-transform duration-200 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile Close */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-6 right-4 text-slate-500 hover:text-white"
        >
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>

        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-slate-900">
          {/* <Stethoscope className="w-6 h-6 text-brand-primary" /> */}
          <Image src="/logo.svg" alt="Logo" width={40} height={40} />

          <div className="ml-3">
            <h1 className="text-lg font-semibold text-brand-primary! tracking-tight">
              Carewell
            </h1>

            <p className="text-xs text-slate-400">
              Homoeopathic Clinic
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-6 space-y-8">

          {/* Clinic Section */}
          <div>
            <p className="px-3 mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Clinic
            </p>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname?.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition",
                      isActive
                        ? "bg-brand-primary/10 text-white border-l-2 border-brand-primary"
                        : "text-slate-400 hover:text-white hover:bg-slate-900"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="flex-1">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* System Section */}
          <div>
            <p className="px-3 mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              System
            </p>

            <nav className="space-y-1">
              {secondaryItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition",
                      isActive
                        ? "bg-brand-primary/10 text-white border-l-2 border-brand-primary"
                        : "text-slate-400 hover:text-white hover:bg-slate-900"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="flex-1">{item.name}</span>
                  </Link>
                );
              })}

              {/* Privacy Mode */}
              <button
                onClick={togglePrivacyMode}
                className={clsx(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition",
                  privacyMode
                    ? "bg-orange-500/10 text-orange-400"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                )}
              >
                {privacyMode ? (
                  <ShieldAlert className="w-5 h-5" />
                ) : (
                  <Shield className="w-5 h-5" />
                )}

                <span className="flex-1 text-left">Privacy Mode</span>

                {privacyMode && (
                  <Badge
                    label="ON"
                    variant="warning"
                    className="text-[10px]"
                  />
                )}
              </button>
            </nav>
          </div>
        </div>

        {/* User Profile */}
        <div className="border-t border-slate-900 p-4">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-900 transition">

            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
              {user?.profileImage ? (
                <Image
                  src={user.profileImage}
                  alt={user.name || "User"}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              ) : (
                <span className="text-sm font-semibold text-white">
                  {user?.name?.charAt(0) || "D"}
                </span>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">
                {user?.name || "Doctor"}
              </p>

              <p className="text-xs text-slate-400">
                {user?.role === "primary"
                  ? "Primary Doctor"
                  : "Doctor"}
              </p>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>
        </div>
      </aside>
    </>
  );
}