"use client";
import Footer from "./partial/Footer";
import useScroll from "@/hooks/useScroll";
import Navbar from "./partial/Navbar";
import { Toaster } from "sonner";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const scrollY = useScroll();

  return (
    <div className="min-h-screen bg-background">
      {/* Content */}
      <div className="flex flex-col min-h-screen">
        <Navbar scrollY={scrollY} />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>

      <Toaster position="top-right" richColors />
    </div>
  );
}
