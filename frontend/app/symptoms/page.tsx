"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// This page is deprecated. The acute consultation flow now lives at /consultation/acute.
export default function SymptomsPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/consultation/acute");
  }, [router]);
  return null;
}
