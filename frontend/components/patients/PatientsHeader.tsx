"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function PatientsHeader() {
  const router = useRouter();

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6 w-full">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-[1px] w-8 bg-brand-primary/40" />
          <span className="eyebrow text-brand-primary/70">Registry</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-light text-slate-900 tracking-tight">
          Patient <span className="font-semibold text-brand-primary">Management</span>
        </h1>
        <p className="text-sm text-slate-500 max-w-md leading-relaxed">
          Manage your clinic&apos;s patient records and secure contact details.
        </p>
      </div>

      <div className="flex flex-col xs:flex-row sm:flex-row items-stretch xs:items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
        <Button
          onClick={() => router.push('/onboarding')}
          variant="primary"
          className="bg-brand-primary hover:bg-brand-primary/90 px-8 shadow-md"
        >
          Add New Patient
        </Button>
      </div>
    </header>
  );
}
