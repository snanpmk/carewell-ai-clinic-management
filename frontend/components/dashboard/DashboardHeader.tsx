"use client";

import { useRouter } from "next/navigation";
import { Plus, UserPlus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/useAuthStore";
import { format } from "date-fns";

export function DashboardHeader() {
  const router = useRouter();
  const { user } = useAuthStore();
  const today = new Date();

  return (
    <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 w-full pb-2 border-b border-slate-100">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 bg-brand-primary/10 rounded-lg">
            <Calendar className="w-4 h-4 text-brand-primary" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {format(today, "EEEE, MMMM do, yyyy")}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
          Good {today.getHours() < 12 ? 'Morning' : today.getHours() < 17 ? 'Afternoon' : 'Evening'}, <span className="text-brand-primary">Dr. {user?.name.split(' ')[0] || 'Carewell'}</span>
        </h1>
        <p className="text-sm text-slate-500 font-medium max-w-lg">
          Welcome back to your clinical command center. Here&apos;s a quick overview of your practice for today.
        </p>
      </div>

      <div className="flex flex-col xs:flex-row items-stretch gap-3 w-full lg:w-auto">
        <Button
          onClick={() => router.push('/onboarding')}
          variant="outline"
          leftIcon={<UserPlus className="w-5 h-5 shrink-0" />}
          className="shadow-sm"
        >
          New Patient
        </Button>
        <Button
          onClick={() => router.push('/consultation/acute')}
          variant="primary"
          leftIcon={<Plus className="w-5 h-5 shrink-0" />}
        >
          Consultation
        </Button>
      </div>
    </header>
  );
}
