import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import RouteLogger from './_components/route-logger';
import ThemeProvider from './_components/theme-provider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Logy-Desk",
  description: "Multi-Agent based AI-CS Center",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  

  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full flex flex-col`}>
        <ThemeProvider>
          <RouteLogger />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
