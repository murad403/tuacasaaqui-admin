import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import ToastProvider from "@/components/shared/ToastProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TuacasaAqui",
  description: "TuacasaAqui Admin Panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased bg-white min-h-screen`}
      >
        <TooltipProvider>
          {children}
          <ToastProvider />
        </TooltipProvider>
      </body>
    </html>
  );
}
