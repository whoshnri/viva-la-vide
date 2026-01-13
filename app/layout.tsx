import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DbStatus from "@/components/DbStatus";
import { checkDatabaseConnection } from "@/lib/logic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VIVA-LA-VIDA",
  description: "Seat and Hall Allocation System",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dbStatus = await checkDatabaseConnection();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <DbStatus initialStatus={dbStatus.online} />
      </body>
    </html>
  );
}
