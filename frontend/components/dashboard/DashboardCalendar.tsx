"use client";

import React, { useMemo } from "react";
import { DayPicker, DayProps } from "react-day-picker";
import "react-day-picker/style.css";
import { format, isSameDay, isToday } from "date-fns";
import { Card } from "@/components/ui/Card";
import { DashboardConsultationItem } from "./DashboardRecentActivity";
import { clsx } from "clsx";
import { Calendar as CalendarIcon, Users, Clock } from "lucide-react";

interface DashboardCalendarProps {
  consultations: DashboardConsultationItem[];
}

export function DashboardCalendar({ consultations }: DashboardCalendarProps) {
  const [selected, setSelected] = React.useState<Date | undefined>(new Date());

  // Group consultations by date string
  const appointmentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    consultations.forEach((apt) => {
      const dateKey = format(new Date(apt.consultationDate), "yyyy-MM-dd");
      counts[dateKey] = (counts[dateKey] || 0) + 1;
    });
    return counts;
  }, [consultations]);

  const selectedDayConsultations = useMemo(() => {
    if (!selected) return [];
    return consultations.filter((apt) =>
      isSameDay(new Date(apt.consultationDate), selected)
    );
  }, [selected, consultations]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Calendar Card */}
      <Card className="lg:col-span-5 p-8 bg-white border-slate-200/60 shadow-sm overflow-visible">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
            <CalendarIcon className="w-5 h-5 text-brand-primary" />
          </div>
          <div>
            <h2 className="text-lg font-light text-slate-900 tracking-tight">Clinical <span className="font-semibold">Schedule</span></h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Engagement Heatmap</p>
          </div>
        </div>

        <div className="w-full custom-day-picker">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={setSelected}
            modifiers={{
              hasAppointments: (date) => !!appointmentCounts[format(date, "yyyy-MM-dd")]
            }}
            classNames={{
              root: "w-full",
              months: "w-full",
              month: "w-full",
              month_grid: "w-full border-separate border-spacing-y-1",
              weekdays: "w-full grid grid-cols-7",
              week: "w-full grid grid-cols-7 text-primary",
              day: "p-0.5 flex",
              button_next: 'm-4',
              button_previous: 'm-4'
            }}
            className="p-0 m-0 w-full"
            components={{
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              DayButton: (props: any) => {
                const { day, modifiers, className, ...buttonProps } = props;
                const dateKey = format(day.date, "yyyy-MM-dd");
                const count = appointmentCounts[dateKey] || 0;

                return (
                  <button {...buttonProps} className={clsx(
                    "relative flex items-center justify-center w-full aspect-square max-w-12 mx-auto cursor-pointer rounded-[14px] transition-all duration-200 group border-0 text-[15px] p-0 m-0",
                    isSameDay(day.date, selected || new Date(0)) ? "bg-brand-primary text-white font-bold shadow-lg shadow-brand-primary/30 scale-105 z-10" : "bg-transparent text-slate-800 hover:bg-brand-primary/5 hover:text-brand-primary",
                    isToday(day.date) && !isSameDay(day.date, selected || new Date(0)) ? "ring-2 ring-brand-primary/40 ring-inset bg-brand-primary/5 text-brand-primary font-bold" : "",
                    modifiers.outside ? "text-slate-300 opacity-40 hover:opacity-100" : ""
                  )}>
                    <span className="relative z-10 font-medium">{day.date.getDate()}</span>
                    {count > 0 && (
                      <span className={clsx(
                        "absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[9px] font-black rounded-full border-[2.5px] border-white shadow-sm z-20",
                        isSameDay(day.date, selected || new Date(0)) ? "bg-white text-brand-primary" : "bg-brand-primary text-white"
                      )}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              }
            }}
          />
        </div>
      </Card>

      {/* Selected Day Details */}
      <Card className="lg:col-span-7 p-0 bg-white border-slate-200/60 shadow-sm overflow-hidden flex flex-col min-h-[480px]">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                {selected ? format(selected, "EEEE") : "Agenda"}
              </h3>
            </div>
            <h2 className="text-xl font-light text-slate-900 tracking-tight">
              {selected ? format(selected, "MMMM do, yyyy") : "Select a date"}
            </h2>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-light text-brand-primary leading-none">{selectedDayConsultations.length}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Interactions</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {selectedDayConsultations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20 px-8 text-center bg-slate-50/10">
              <div className="w-20 h-20 bg-white border border-slate-100 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                <Clock className="w-8 h-8 text-slate-200" />
              </div>
              <p className="text-sm font-light text-slate-400 max-w-[200px] leading-relaxed italic">No clinical activities scheduled for this date.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {selectedDayConsultations.map((apt, index) => (
                <div
                  key={apt._id}
                  className="p-6 hover:bg-slate-50/50 transition-all flex items-center justify-between group animate-in fade-in slide-in-from-bottom-2"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-5">
                    <div className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm group-hover:border-brand-primary/20 transition-colors">
                      <span className="text-base font-semibold text-slate-900 tracking-tight leading-none italic">{format(new Date(apt.consultationDate), "HH:mm")}</span>
                      <span className="text-[8px] font-bold text-brand-primary uppercase tracking-widest mt-1">{format(new Date(apt.consultationDate), "aa")}</span>
                    </div>
                    <div>
                      <p className="text-base font-semibold text-slate-900 group-hover:text-brand-primary transition-colors tracking-tight">
                        {apt.patientId?.name || "Anonymous Patient"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-bold rounded uppercase tracking-wider border border-slate-200/50">OP #{apt.opNumber || "N/A"}</span>
                        <span className="text-[11px] font-medium text-slate-400 line-clamp-1 italic">
                          &quot;{apt.symptoms}&quot;
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={clsx(
                      "px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border shadow-xs",
                      apt.status === "Scheduled" ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                    )}>
                      {apt.status || "Completed"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
