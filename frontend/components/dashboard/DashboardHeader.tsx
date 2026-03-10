"use client";

import { useRouter } from "next/navigation";
import { Plus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function DashboardHeader() {
  const router = useRouter();

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6 w-full">
      <div className="flex flex-col gap-1">
        <h1>Dashboard</h1>
        <p className="text-sm text-slate-500 font-medium tracking-tight">Clinic overview & operational insights for today.</p>
      </div>

      <div className="flex flex-col xs:flex-row sm:flex-row items-stretch xs:items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
        <Button
          onClick={() => router.push('/onboarding')}
          variant="outline"
          leftIcon={<UserPlus className="w-5 h-5 shrink-0" />}
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
