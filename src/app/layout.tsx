import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import ToastProvider from "@/components/shared/ToastProvider";

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700', '800', '600', '500', '900'],
})

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
        className={`${roboto.className} antialiased bg-white min-h-screen`}
      >
        <TooltipProvider>
          {children}
          <ToastProvider />
        </TooltipProvider>
      </body>
    </html>
  );
}
