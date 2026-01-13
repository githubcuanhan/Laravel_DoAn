import { BookOpen } from "lucide-react";
import Link from "next/link";

export default function AuthRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 mb-8"
        >
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold">Library Online</p>
            <p className="text-xs text-muted-foreground">Thư viện số</p>
          </div>
        </Link>

        {/* Form Container */}
        {children}
      </div>
    </div>
  );
}
