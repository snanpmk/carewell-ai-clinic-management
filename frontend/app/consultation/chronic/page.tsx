"use client";

import { Suspense } from "react";
import ChronicCaseWizard from "@/components/chronic-case/ChronicCaseWizard";
import { useSearchParams } from "next/navigation";

function ChronicCasePageContent() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId");

  return (
    <div className="flex-1 w-full p-4 md:p-6 pb-24 md:pb-8 flex flex-col h-full overflow-hidden">
      <div className="w-full flex-1 flex flex-col min-h-0 relative">
       

        <div className="flex-1 overflow-y-auto no-scrollbar">
          <ChronicCaseWizard patientId={patientId || undefined} />
        </div>
      </div>
    </div>
  );
}

export default function ChronicCasePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading case view...</div>}>
      <ChronicCasePageContent />
    </Suspense>
  );
}
