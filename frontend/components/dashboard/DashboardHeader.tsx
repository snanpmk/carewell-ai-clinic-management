"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function DashboardHeader() {
  const router = useRouter();

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6 w-full">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-500 font-medium">{"Here's your clinic overview for today."}</p>
      </div>

      <div className="flex flex-col xs:flex-row sm:flex-row items-stretch xs:items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
        <Button
          onClick={() => router.push('/onboarding')}
          variant="outline"
          className="w-full sm:w-auto bg-white shadow-xs capitalize text-sm font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          leftIcon={<Plus className="w-4 h-4 shrink-0" />}
        >
          New Patient
        </Button>
        <Button
          onClick={() => router.push('/consultation/acute')}
          variant="primary"
          className="w-full sm:w-auto capitalize text-sm font-semibold transition-colors"
          leftIcon={<Plus className="w-4 h-4 shrink-0" />}
        >
          New Consultation
        </Button>
      </div>
    </header>
  );
}
