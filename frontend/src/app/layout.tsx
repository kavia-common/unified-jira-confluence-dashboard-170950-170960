import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
