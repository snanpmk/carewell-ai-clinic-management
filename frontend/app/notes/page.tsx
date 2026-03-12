"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// This page is deprecated. Clinical notes editing is now integrated into /consultation/acute.
export default function NotesRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/consultation/acute");
  }, [router]);
  return null;
}
