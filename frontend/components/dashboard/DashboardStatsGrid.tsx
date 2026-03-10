"use client";

interface DashboardStatsGridProps {
  totalPatients: number;
  totalConsultations: number;
  appointmentsToday: number;
}

export function DashboardStatsGrid({ totalPatients, totalConsultations, appointmentsToday }: DashboardStatsGridProps) {
  const stats = [
    { label: "Total Patients", value: totalPatients.toString() },
    { label: "Total Consultations", value: totalConsultations.toString() },
    { label: "Appointments Today", value: appointmentsToday.toString() },
    { label: "Follow-ups", value: Math.floor(totalConsultations * 0.3).toString() },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-xl shadow-slate-200/40 relative overflow-hidden group transition-all duration-300 hover:shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-brand-primary/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-700" />
          <div className="relative z-10">
            <h3 className="eyebrow mb-2">{stat.label}</h3>
            <p className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
