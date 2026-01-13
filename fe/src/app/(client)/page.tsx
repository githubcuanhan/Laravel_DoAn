"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, Search, User, ShoppingCart, Clock, CheckCircle, AlertCircle } from "lucide-react";
import bookService from "@/services/book";
import type { Sach } from "@/lib/types/book.types";
import phieuMuonService, { PhieuMuon } from "@/services/phieuMuon";
import { useUserStore } from "@/store/useUserStore";

export default function Home() {
  const [recentBooks, setRecentBooks] = useState<Sach[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [borrows, setBorrows] = useState<PhieuMuon[]>([]);
  const [loadingBorrows, setLoadingBorrows] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingBooks(true);
        const res = await bookService.getAll(1, 8);
        setRecentBooks(res.payload.data?.data ?? []);
      } finally {
        setLoadingBooks(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchBorrows = async () => {
      try {
        setLoadingBorrows(true);
        const res = await phieuMuonService.getMyBorrows(1, 5);
        setBorrows(res.payload.data?.data ?? []);
      } catch {
        // ignore if not authenticated
      } finally {
        setLoadingBorrows(false);
      }
    };
    fetchBorrows();
  }, []);

  const getStatusBadge = (status: PhieuMuon["trangThai"]) => {
    switch (status) {
      case "dang_cho":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
            <Clock className="h-3 w-3" /> Đang chờ duyệt
          </span>
        );
      case "dang_muon":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
            <Clock className="h-3 w-3" /> Đang mượn
          </span>
        );
      case "da_tra":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-300">
            <CheckCircle className="h-3 w-3" /> Đã trả
          </span>
        );
      case "qua_han":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-900/30 px-2 py-0.5 text-xs font-medium text-red-700 dark:text-red-300">
            <AlertCircle className="h-3 w-3" /> Quá hạn
          </span>
        );
      default:
        return null;
    }
  };

  const user = useUserStore((s) => s.user);

  return (
    <div className="space-y-6">
      {/* Guest Welcome Banner */}
      {!user && (
        <Card className="border-primary/50 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">Chào mừng đến với Thư viện!</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Bạn đang ở chế độ khách vãng lai. Đăng nhập để mượn sách và trải nghiệm đầy đủ tính năng.
                </p>
                <div className="flex gap-2">
                  <Button asChild>
                    <Link href="/auth/login">Đăng nhập</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/auth/register">Đăng ký</Link>
                  </Button>
                </div>
              </div>
              <div className="text-6xl">📚</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{user ? 'Tổng quan' : 'Khám phá sách'}</h1>
          <p className="text-sm text-muted-foreground">
            {user ? 'Giao diện người dùng theo phong cách quản lý hệ thống' : 'Tìm kiếm và khám phá hàng ngàn đầu sách'}
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Search className="w-4 h-4" /> Tìm kiếm sách
            </CardTitle>
            <CardDescription>Tra cứu sách theo tên, tác giả...</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/sach">Mở trang tra cứu</Link>
            </Button>
          </CardContent>
        </Card>

        {user && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShoppingCart className="w-4 h-4" /> Giỏ mượn
                </CardTitle>
                <CardDescription>Quản lý sách đã chọn để mượn</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/cart">Mở giỏ mượn</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="w-4 h-4" /> Hồ sơ
                </CardTitle>
                <CardDescription>Thông tin cá nhân và lịch sử mượn</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/profile">Xem hồ sơ</Link>
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Recent books and borrows */}
      <div className={`grid gap-4 ${user ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>
        <Card className={user ? 'lg:col-span-2' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="w-4 h-4" /> Sách mới
            </CardTitle>
            <CardDescription>Danh sách sách mới cập nhật</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingBooks ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-24 rounded-md bg-muted animate-pulse" />
                ))}
              </div>
            ) : recentBooks.length === 0 ? (
              <p className="text-sm text-muted-foreground">Chưa có dữ liệu.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-14">#</TableHead>
                      <TableHead>Tên sách</TableHead>
                      <TableHead>Tác giả</TableHead>
                      <TableHead>Mã</TableHead>
                      <TableHead className="text-right">Khả dụng</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentBooks.map((b) => {
                      const imgUrl =
                        b.anhBia?.duongDan ??
                        b.anh_bia?.duongDan ??
                        b.hinhAnhs?.[0]?.duongDan ??
                        b.hinh_anhs?.[0]?.duongDan ??
                        null;

                      return (
                        <TableRow key={b.idSach} className="hover:bg-muted/50">
                          <TableCell>
                            {imgUrl ? (
                              <img
                                src={imgUrl}
                                alt={b.tenSach}
                                className="h-10 w-8 object-cover rounded"
                              />
                            ) : (
                              <div className="h-10 w-8 rounded bg-muted flex items-center justify-center">
                                <BookOpen className="w-4 h-4 text-muted-foreground" />
                              </div>
                            )}
                          </TableCell>

                          <TableCell className="font-medium">
                            <Link href={`/sach/${b.idSach}`} className="hover:underline">
                              {b.tenSach}
                            </Link>
                          </TableCell>

                          <TableCell className="text-sm text-muted-foreground">
                            {b.tacGia || ""}
                          </TableCell>

                          <TableCell className="text-sm text-muted-foreground">
                            {b.maSach}
                          </TableCell>

                          <TableCell className="text-right">
                            {b.soLuongKhaDung ?? b.soLuong ?? 0}
                          </TableCell>

                          <TableCell className="text-right">
                            <Button asChild size="sm" variant="outline">
                              <Link href={`/sach/${b.idSach}`}>Xem</Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}

                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {user && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="w-4 h-4" /> Phiếu mượn gần đây
              </CardTitle>
              <CardDescription>5 phiếu mượn gần nhất của bạn</CardDescription>
              <CardAction>
                <Button asChild size="sm" variant="outline">
                  <Link href="/phieu-muon">Xem tất cả</Link>
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              {loadingBorrows ? (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-14 rounded-md bg-muted animate-pulse" />
                  ))}
                </div>
              ) : borrows.length === 0 ? (
                <p className="text-sm text-muted-foreground">Chưa có phiếu mượn.</p>
              ) : (
                <div className="space-y-3">
                  {borrows.map((pm) => (
                    <div key={pm.idPhieumuon} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">#{pm.idPhieumuon}</span>
                        {getStatusBadge(pm.trangThai)}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground flex items-center justify-between">
                        <span>Ngày mượn: {new Date(pm.ngayMuon).toLocaleDateString("vi-VN")}</span>
                        <span>Hạn trả: {new Date(pm.hanTra).toLocaleDateString("vi-VN")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
