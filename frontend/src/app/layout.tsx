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
      <body suppressHydrationWarning>
        <AuthProvider>
          <AppProvider>
            {children}
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
