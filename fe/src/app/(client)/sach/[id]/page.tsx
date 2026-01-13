"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Building2,
  Package,
  ShoppingCart,
  Tag,
  QrCode,
  Library,
  LogIn,
} from "lucide-react";

import bookService from "@/services/book";
import type { Sach } from "@/lib/types";
import { useCartStore } from "@/store/useCartStore";
import { useUserStore } from "@/store/useUserStore";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;

  const [book, setBook] = useState<Sach | null>(null);
  const [loading, setLoading] = useState(true);

  const { addItem } = useCartStore();
  const user = useUserStore((s) => s.user);

  const coverSrc = useMemo(() => {
    if (!book) return "/default-book.jpg";
    const anyBook = book as any;
    return (
      anyBook?.anhBia?.duongDan ||
      anyBook?.anh_bia?.duongDan ||
      anyBook?.hinhAnhs?.[0]?.duongDan ||
      anyBook?.hinh_anhs?.[0]?.duongDan ||
      "/default-book.jpg"
    );
  }, [book]);

  const categoryNames = useMemo(() => {
    if (!book) return "";
    const anyBook = book as any;
    const dms = anyBook.danh_mucs || anyBook.danhMucs || [];
    if (Array.isArray(dms)) {
      return dms.map((dm: any) => dm.tenDanhmuc || dm.ten || dm.name).join(", ");
    }
    return "";
  }, [book]);


  

  const handleAddToCart = () => {
    if (!book) return;
    const imgUrl =
  (Array.isArray(book.anhBia) ? book.anhBia[0]?.duongDan : book.anhBia?.duongDan) ??
  (Array.isArray(book.anh_bia) ? book.anh_bia[0]?.duongDan : book.anh_bia?.duongDan) ??
  book.hinhAnhs?.[0]?.duongDan ??
  book.hinh_anhs?.[0]?.duongDan ??
  null;
    addItem({
      idSach: book.idSach,
      tenSach: book.tenSach,
      tacGia: book.tacGia || undefined,
      soLuongKhaDung: book.soLuongKhaDung ?? 0,
      anhBia: imgUrl ? { duongDan: imgUrl } : null,
    });
      toast.success("Đã thêm vào giỏ mượn", {
      description: `${book.tenSach} đã được thêm vào giỏ`,
    });
  };

  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        setLoading(true);
        const res = await bookService.getOne(bookId);
        if (res.payload.success) {
          const raw = res.payload.data as any;
          const transformed: Sach = {
            ...raw,
            hinhAnhs: raw.hinh_anhs || raw.hinhAnhs || [],
            anhBia: raw.anh_bia || raw.anhBia || null,
          };
          setBook(transformed);
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết sách:", error);
      } finally {
        setLoading(false);
      }
    };
    if (bookId) fetchBookDetail();
  }, [bookId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground">Đang tải thông tin sách...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle>Không tìm thấy sách</CardTitle>
            <CardDescription>Sách có thể đã bị xoá hoặc không tồn tại</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/sach")}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Quay về danh sách
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const available = (book.soLuongKhaDung ?? 0) > 0;

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/sach" className="hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Quay về danh sách
        </Link>
        <span>/</span>
        <span className="text-foreground">{book.tenSach}</span>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-1">
          <CardTitle className="text-xl">{book.tenSach}</CardTitle>
          <CardDescription>
            {book.tacGia ? `Tác giả: ${book.tacGia}` : "Không rõ tác giả"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-[240px_1fr]">
            {/* Left - Cover */}
            <div className="space-y-3">
              <div className="rounded-md overflow-hidden border bg-muted">
                <img src={coverSrc} alt={book.tenSach} className="w-full h-[320px] object-cover" />
              </div>
              <div>
                {available ? (
                  <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs px-2 py-1">Còn sách</span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs px-2 py-1">Hết sách</span>
                )}
              </div>
              {user ? (
                <Button className="w-full" disabled={!available} onClick={handleAddToCart}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {available ? "Thêm vào giỏ mượn" : "Hết sách"}
                </Button>
              ) : (
                <Button className="w-full" asChild variant="default">
                  <Link href="/auth/login">
                    <LogIn className="w-4 h-4 mr-2" />
                    Đăng nhập để mượn sách
                  </Link>
                </Button>
              )}
            </div>

            {/* Right - Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Thông tin sách</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                      <Tag className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-muted-foreground">Mã sách</div>
                        <div className="font-medium">{book.maSach}</div>
                      </div>
                    </div>
                    {book.maQR && (
                      <div className="flex items-start gap-2">
                        <QrCode className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="text-muted-foreground">Mã QR</div>
                          <div className="font-medium break-all">{book.maQR}</div>
                        </div>
                      </div>
                    )}
                    {book.nhaXuatBan && (
                      <div className="flex items-start gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="text-muted-foreground">Nhà xuất bản</div>
                          <div className="font-medium">{book.nhaXuatBan}</div>
                        </div>
                      </div>
                    )}
                    {book.namXuatBan && (
                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="text-muted-foreground">Năm xuất bản</div>
                          <div className="font-medium">{book.namXuatBan}</div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-2">
                      <Package className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-muted-foreground">Số lượng</div>
                        <div className="font-medium">{book.soLuong}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <BookOpen className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-muted-foreground">Khả dụng</div>
                        <div className="font-medium">{book.soLuongKhaDung}</div>
                      </div>
                    </div>
                    {(book as any)?.keSach?.tenKe && (
                      <div className="flex items-start gap-2">
                        <Library className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="text-muted-foreground">Kệ</div>
                          <div className="font-medium">{(book as any).keSach.tenKe}</div>
                        </div>
                      </div>
                    )}
                    {categoryNames && (
                      <div className="flex items-start gap-2 sm:col-span-2">
                        <Tag className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="text-muted-foreground">Danh mục</div>
                          <div className="font-medium">{categoryNames}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {book.moTa && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Mô tả</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {book.moTa}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
