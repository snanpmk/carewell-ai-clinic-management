"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PatientProfileHeaderProps {
  patientId: string;
}

export function PatientProfileHeader({ patientId }: PatientProfileHeaderProps) {
  const router = useRouter();

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-6 w-full">
      <div className="flex items-center gap-4">
        <Link 
          href="/patients"
          className="p-2.5 border border-slate-200/80 bg-white/60 backdrop-blur-md rounded-xl text-slate-500 hover:text-blue-600 hover:bg-white shadow-sm shadow-slate-200/40 transition-all hover:-translate-x-0.5"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Patient Profile</h1>
          <p className="text-sm text-slate-500 font-medium">Detailed history and information</p>
        </div>
      </div>
      
      <div className="flex w-full sm:w-auto mt-2 sm:mt-0">
        <Button
          onClick={() => router.push(`/consultation/acute?patientId=${patientId}`)}
          variant="primary"
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 capitalize text-sm font-semibold text-white transition-colors"
          leftIcon={<Plus className="w-4 h-4 shrink-0" />}
        >
          New Consultation
        </Button>
      </div>
    </header>
  );
}
