import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import ToastProvider from "@/components/ToastProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "BookNook | Online Library",
  description: "A small online library - Add a book, borrow a book, return a book.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors font-sans">
        <ToastProvider />
        {/* Navbar on all pages */}
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">{children}</main>
        {/* Footer on all pages */}
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}
