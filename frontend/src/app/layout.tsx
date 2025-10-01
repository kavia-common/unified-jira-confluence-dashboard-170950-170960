import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import { AppProvider } from "../contexts/AppContext";

export const metadata: Metadata = {
  title: "Unified Jira & Confluence Dashboard",
  description: "Connect and manage your Atlassian Jira and Confluence accounts in one unified dashboard",
};

// PUBLIC_INTERFACE
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] antialiased" suppressHydrationWarning>
        <div className="min-h-screen relative">
          <div className="pointer-events-none fixed inset-0" style={{ background: "linear-gradient(135deg, rgba(30,58,138,0.06), rgba(245,158,11,0.06))" }} />
          <AuthProvider>
            <AppProvider>{children}</AppProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
