import type { Metadata, Viewport } from "next";
import "./globals.css";
import { QueryProvider } from "@/lib/QueryProvider";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Carewell Homeo Clinic – AI Consultation Notes",
  description:
    "AI-assisted consultation notes system for Carewell Homeo Clinic. Patient onboarding, symptom capture, and structured medical note generation.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Carewell AI",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Carewell AI",
  },
};

export const viewport: Viewport = {
  themeColor: "#008D96",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
              <Toaster
                position="top-right"
                richColors
                closeButton
                theme="light"
                          />
            </ClientLayout>
          </GoogleOAuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
