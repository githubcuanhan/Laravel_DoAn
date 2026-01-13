"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Menu, Search, ShoppingCart } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ToggleTheme from "@/components/toggle-theme";

interface NavbarProps {
  scrollY: number;
}

export default function Navbar({ scrollY }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const { getTotalItems } = useCartStore();
  const totalCartItems = getTotalItems();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all ${
        scrollY > 50 ? "shadow-sm" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <BookOpen className="w-6 h-6" />
            <span className="hidden sm:inline">Thư viện Online</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Trang chủ
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Về chúng tôi
            </Link>

            {/* Search */}
            <div className="relative flex items-center">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="relative w-64">
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm sách..."
                    className="pr-8"
                    autoFocus
                    onBlur={() => !searchQuery && setIsSearchOpen(false)}
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </form>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="w-5 h-5" />
                </Button>
              )}
            </div>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs font-bold flex items-center justify-center">
                    {totalCartItems > 9 ? "9+" : totalCartItems}
                  </span>
                )}
              </Button>
            </Link>
              {/* Theme Toggle */}
              <ToggleTheme />
            {/* User / Login */}
            {user ? (
              <>
              <Link href="/profile">
                <Button>{user.hoTen}</Button>
              </Link>
                {(user.vaiTro === 'admin' || user.vaiTro === 'thuthu') && (
                  <Link href="/admin/dashboard">
                    <Button>Quản trị</Button>
                  </Link>
                )}
              </>
            ) : (
              <Link href="/auth/login">
                <Button>Đăng nhập</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-2">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground rounded-full text-xs font-bold flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </Button>
            </Link>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 mt-8">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <Input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm sách..."
                        className="pr-8"
                      />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0"
                      >
                        <Search className="w-4 h-4" />
                      </Button>
                    </div>
                  </form>

                  <Link
                    href="/"
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    Trang chủ
                  </Link>
                  <Link
                    href="/about"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    Về chúng tôi
                  </Link>

                  {user ? (
                    <Link href="/profile">
                      <Button className="w-full">{user.hoTen}</Button>
                    </Link>
                  ) : (
                    <Link href="/auth/login">
                      <Button className="w-full">Đăng nhập</Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
