"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Stethoscope, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/useAuthStore";

interface PatientProfileHeaderProps {
  patientId: string;
}

export function PatientProfileHeader({ patientId }: PatientProfileHeaderProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const isStaff = user?.role === "staff";

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-6 w-full">
      <div className="flex items-center gap-4">
        <Link 
          href="/patients"
          className="p-2.5 border border-slate-200 bg-white rounded-xl text-slate-500 hover:text-brand-primary hover:bg-slate-50 shadow-sm transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Patient Registry</h1>
          <p className="text-sm text-slate-500 font-medium tracking-tight">
            {isStaff ? "Patient contact information and engagement" : "Comprehensive medical history & analytics"}
          </p>
        </div>
      </div>
      
      {!isStaff && (
        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
          <Button
            onClick={() => router.push(`/consultation/acute?patientId=${patientId}`)}
            variant="outline"
            className="rounded-2xl"
            leftIcon={<FilePlus className="w-4 h-4 shrink-0" />}
          >
            Acute Visit
          </Button>
          <Button
            onClick={() => router.push(`/consultation/chronic?patientId=${patientId}`)}
            variant="primary"
            className="rounded-2xl"
            leftIcon={<Stethoscope className="w-4 h-4 shrink-0" />}
          >
            Chronic Case
          </Button>
        </div>
      )}
    </header>
  );
}
