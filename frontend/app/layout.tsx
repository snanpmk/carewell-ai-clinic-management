import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/lib/QueryProvider";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const metadata: Metadata = {
  title: "Carewell Homeo Clinic – AI Consultation Notes",
  description:
    "AI-assisted consultation notes system for Carewell Homeo Clinic. Patient onboarding, symptom capture, and structured medical note generation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 flex">
        <QueryProvider>
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
            <ClientLayout>
              {children}
              <Toaster position="top-right" richColors closeButton />
            </ClientLayout>
          </GoogleOAuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
