import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/hooks/use-auth";

export const metadata: Metadata = {
  title: "EleGuardLK - Protecting Farms, Preventing Elephant Encounters",
  description:
    "EleGuardLK uses advanced geophone sensors to detect elephant movement early and alert farmers in real-time. Together, let's reduce human-elephant conflict in Sri Lanka.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
