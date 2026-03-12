"use client";

import Link from "next/link";
import { Clock, ArrowUpRight, Stethoscope } from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";
import { clsx } from "clsx";

export interface DashboardConsultationItem {
  _id: string;
  consultationDate: string;
  symptoms: string;
  opNumber?: string;
  status?: string;
  patientId?: {
    _id: string;
    name: string;
  };
}

interface DashboardRecentActivityProps {
  recentConsultations: DashboardConsultationItem[];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function formatRelativeDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isToday(d)) return format(d, "hh:mm a") + " · Today";
  if (isYesterday(d)) return format(d, "hh:mm a") + " · Yesterday";
  return format(d, "dd MMM, hh:mm a");
}

// Deterministic colour per patient — cycles through a palette
const AVATAR_PALETTES = [
  "bg-violet-100 text-violet-700",
  "bg-sky-100 text-sky-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
];

function avatarClass(id: string) {
  const index = id.charCodeAt(id.length - 1) % AVATAR_PALETTES.length;
  return AVATAR_PALETTES[index];
}

export function DashboardRecentActivity({ recentConsultations }: DashboardRecentActivityProps) {
  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-px w-6 bg-brand-primary/40" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-[0.15em]">
            Recent Patient Stories
          </h2>
          {recentConsultations.length > 0 && (
            <span className="px-2 py-0.5 bg-brand-primary/10 text-brand-primary text-[9px] font-bold rounded-full uppercase tracking-wider animate-pulse">
              Live
            </span>
          )}
        </div>
        <Link
          href="/appointments"
          className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-brand-primary uppercase tracking-wider transition-colors"
        >
          All records <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Feed */}
      {recentConsultations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
          <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mb-3 border border-slate-100">
            <Clock className="w-5 h-5 text-slate-300" />
          </div>
          <p className="text-xs font-medium text-slate-400">No recent records to show yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50 overflow-hidden">
          {recentConsultations.map((apt, index) => {
            const name = apt.patientId?.name || "Anonymous";
            const initials = getInitials(name);
            const isLatest = index === 0;

            return (
              <div
                key={apt._id}
                className={clsx(
                  "group relative flex items-center gap-4 px-5 py-4 transition-all duration-200 hover:bg-slate-50/80",
                  "animate-in fade-in slide-in-from-bottom-1"
                )}
                style={{ animationDelay: `${index * 40}ms` }}
              >
                {/* Live dot on latest */}
                {isLatest && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-brand-primary rounded-r-full" />
                )}

                {/* Avatar */}
                <div
                  className={clsx(
                    "w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-bold shrink-0 transition-transform duration-200 group-hover:scale-110",
                    avatarClass(apt._id)
                  )}
                >
                  {initials}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <Link
                      href={`/patients/${apt.patientId?._id}`}
                      className="text-sm font-semibold text-slate-900 hover:text-brand-primary transition-colors truncate"
                    >
                      {name}
                    </Link>
                    {apt.opNumber && (
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                        #{apt.opNumber}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-medium italic line-clamp-1">
                    &quot;{apt.symptoms}&quot;
                  </p>
                </div>

                {/* Right meta */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">
                    {formatRelativeDate(apt.consultationDate)}
                  </span>
                  <Link
                    href={`/patients/${apt.patientId?._id}`}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-primary uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-all duration-200 hover:gap-1.5"
                  >
                    <Stethoscope className="w-3 h-3" /> View
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
