"use client";

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "sonner";
import SystemSidebar from "./partial/system-sidebar";

export default function SystemLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SystemSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <div className="text-sm text-muted-foreground">Hệ thống quản lý thư viện</div>
          </div>
        </header>
        <main className="flex-1 p-4">
          {children}
        </main>
        <Toaster position="top-right" richColors />
      </SidebarInset>
    </SidebarProvider>
  );
}

