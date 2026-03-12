"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { format } from "date-fns";

export function DashboardHeader() {
  const router = useRouter();
  const today = new Date();

  return (
    <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 w-full pb-8">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-[1px] w-8 bg-brand-primary/40" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-primary/70">
            {format(today, "MMMM do, yyyy")}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-light text-slate-900 tracking-tight">
          Practice <span className="font-semibold text-brand-primary">Overview</span>
        </h1>
        <p className="text-sm text-slate-500 max-w-md leading-relaxed mt-1">
          A thoughtful look at your clinic&apos;s pulse today. Everything looks {today.getHours() < 18 ? 'steady' : 'complete'} for the day.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Button
          onClick={() => router.push('/onboarding')}
          variant="outline"
          className="border-slate-200 text-slate-600 hover:bg-slate-50 px-5"
        >
          New Patient
        </Button>
        <Button
          onClick={() => router.push('/consultation/acute')}
          variant="primary"
          className="bg-brand-primary hover:bg-brand-primary/90 px-8 shadow-md"
        >
          Start Consultation
        </Button>
      </div>
    </header>
  );
}
