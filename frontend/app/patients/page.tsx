"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllPatients } from "@/services/patientService";

import { PatientsHeader } from "@/components/patients/PatientsHeader";
import { PatientsToolbar } from "@/components/patients/PatientsToolbar";
import { PatientsList, PatientItem } from "@/components/patients/PatientsList";

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: response, isLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: getAllPatients,
  });

  const patients = response?.data || [];

  const filteredPatients = patients.filter((patient: PatientItem) => {
    const query = searchQuery.toLowerCase();
    return (
      (patient?.name || "").toLowerCase().includes(query) ||
      (patient?.phone || "").includes(query) ||
      (patient?.email || "").toLowerCase().includes(query) ||
      (patient?._id || "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="mx-auto space-y-6 animate-in fade-in duration-500 pb-12 fill-mode-both px-4 md:px-0">
      <PatientsHeader />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mb-4" />
          <p className="text-sm font-medium">Loading patients...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <PatientsToolbar 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            filteredCount={filteredPatients.length} 
          />
          <PatientsList patients={filteredPatients} />
        </div>
      )}
    </div>
  );
}
