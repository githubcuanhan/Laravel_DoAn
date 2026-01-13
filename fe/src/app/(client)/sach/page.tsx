"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { BookOpen, ChevronLeft, ChevronRight, Search as SearchIcon, Plus } from "lucide-react";
import bookService from "@/services/book";
import categoryService from "@/services/category";
import type { Sach } from "@/lib/types/book.types";
import type { DanhMuc } from "@/lib/types/library.types";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";

export default function BookListPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryParam = searchParams.get("query") || "";

  const [keyword, setKeyword] = useState(queryParam);
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [availability, setAvailability] = useState<"all" | "in" | "out">("all");

  const [categories, setCategories] = useState<DanhMuc[]>([]);

  const [books, setBooks] = useState<Sach[]>([]);
  const [allClientBooks, setAllClientBooks] = useState<Sach[]>([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(12);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryService.getAll(1, 100);
        setCategories(res.payload.data?.data ?? []);
      } catch (_) {
        setCategories([]);
      }
    };
    loadCategories();
  }, []);

  // Determine mode
  const isServerPaginated = useMemo(() => {
    return (!keyword && !categoryId) || (!!categoryId && !keyword);
  }, [keyword, categoryId]);

  const applyFilters = async () => {
    setPage(1);
    await fetchData(1);
    const params = new URLSearchParams();
    if (keyword) params.set("query", keyword);
    router.replace(`/sach?${params.toString()}`);
  };

  const fetchData = async (pageToLoad = page) => {
    try {
      setLoading(true);
      setError(null);
      if (isServerPaginated) {
        if (categoryId && !keyword) {
          const res = await bookService.getByCategory(Number(categoryId), pageToLoad, perPage);
          const payload = res.payload.data;
          let items: Sach[] = payload?.data ?? [];
          if (availability !== "all") {
            items = items.filter((b) =>
              availability === "in" ? (b.soLuongKhaDung ?? 0) > 0 : (b.soLuongKhaDung ?? 0) <= 0
            );
          }
          setBooks(items);
          setTotal(payload?.total ?? 0);
          setAllClientBooks([]);
        } else {
          const res = await bookService.getAll(pageToLoad, perPage);
          const payload = res.payload.data;
          let items: Sach[] = payload?.data ?? [];
          if (availability !== "all") {
            items = items.filter((b) =>
              availability === "in" ? (b.soLuongKhaDung ?? 0) > 0 : (b.soLuongKhaDung ?? 0) <= 0
            );
          }
          setBooks(items);
          setTotal(payload?.total ?? 0);
          setAllClientBooks([]);
        }
      } else {
        const res = await bookService.searchBooks(keyword.trim());
        if (!res.payload.success) throw new Error(res.payload.message || "Lỗi tìm kiếm");
        let data: Sach[] = (res.payload.data as any[]).map((b: any) => ({
          ...b,
          hinhAnhs: b.hinh_anhs || [],
          anhBia: b.anh_bia || null,
        }));
        if (categoryId) {
          data = data.filter((b: any) => {
            const dms = b.danh_mucs || b.danhMucs || [];
            return Array.isArray(dms) && dms.some((dm: any) => dm.idDanhmuc === Number(categoryId));
          });
        }
        if (availability !== "all") {
          data = data.filter((b) =>
            availability === "in" ? (b.soLuongKhaDung ?? 0) > 0 : (b.soLuongKhaDung ?? 0) <= 0
          );
        }
        setAllClientBooks(data);
        setTotal(data.length);
        const start = (pageToLoad - 1) * perPage;
        setBooks(data.slice(start, start + perPage));
      }
    } catch (e: any) {
      setError(e?.message || e?.payload?.message || "Không thể tải dữ liệu");
      setBooks([]);
      setTotal(0);
      setAllClientBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loading) fetchData(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, isServerPaginated, availability]);

  useEffect(() => {
    setKeyword(queryParam);
  }, [queryParam]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="p-4">
      <div className="grid gap-4 md:grid-cols-[280px_1fr]">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <SearchIcon className="w-4 h-4" /> Bộ lọc
            </CardTitle>
            <CardDescription>Tra cứu nhanh theo tiêu chí</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Từ khóa</label>
              <Input
                placeholder="Tên sách, tác giả..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Danh mục</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value === "" ? "" : Number(e.target.value))}
              >
                <option value="">Tất cả</option>
                {categories.map((dm) => (
                  <option key={dm.idDanhmuc} value={dm.idDanhmuc}>
                    {dm.tenDanhmuc}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tình trạng</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={availability}
                onChange={(e) => setAvailability(e.target.value as any)}
              >
                <option value="all">Tất cả</option>
                <option value="in">Còn sách</option>
                <option value="out">Hết sách</option>
              </select>
            </div>
            <div className="pt-2">
              <Button className="w-full" onClick={applyFilters}>Áp dụng</Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Danh sách/Tra cứu sách</h1>
              <p className="text-sm text-muted-foreground">Xem và tìm kiếm sách trong thư viện</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                aria-label="Trang trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Trang {page}/{totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || loading}
                aria-label="Trang sau"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="w-4 h-4" /> Kết quả
              </CardTitle>
              <CardDescription>
                Tổng số: {total} {keyword && `| Từ khóa: "${keyword}"`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="h-10 rounded-md bg-muted animate-pulse" />
                  ))}
                </div>
              ) : error ? (
                <div className="p-4 border rounded-md text-sm text-destructive">{error}</div>
              ) : books.length === 0 ? (
                <div className="text-sm text-muted-foreground">Không có kết quả.</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[56px]">#</TableHead>
                        <TableHead>Tên sách</TableHead>
                        <TableHead>Tác giả</TableHead>
                        <TableHead>Mã</TableHead>
                        <TableHead className="text-right">Khả dụng</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {books.map((b) => {
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
        </div>
      </div>
    </div>
  );
}
