"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function PatientsHeader() {
  const router = useRouter();

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6 w-full">
      <div className="flex flex-col gap-1">
        <h1>Patients</h1>
        <p className="text-sm text-slate-500 font-medium">Manage your clinic&apos;s patient records and contact details.</p>
      </div>

      <div className="flex flex-col xs:flex-row sm:flex-row items-stretch xs:items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
        <Button
          onClick={() => router.push('/onboarding')}
          variant="primary"
          leftIcon={<Plus className="w-5 h-5 shrink-0" />}
        >
          Add Patient
        </Button>
      </div>
    </header>
  );
}
