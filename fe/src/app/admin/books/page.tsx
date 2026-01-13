"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Edit, Trash2, Book, Search, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import bookService from "@/services/book";
import type { PaginatedData } from "@/lib/types/api.types";
import { toast } from "sonner";
import { Sach } from "@/lib/types";
import { handleErrorApi } from "@/lib/utils/mini";

export default function Books() {
  const [bookData, setBookData] = useState<PaginatedData<Sach> | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterTrangThai, setFilterTrangThai] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const perPage = 10;

  const fetchBooks = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await bookService.getAll(page, perPage);
      if (res.payload.success) {
        const mappedData = res.payload.data.data.map((b: any) => ({
        ...b,
        anhBia: b.anh_bia,
        hinhAnhs: b.hinh_anhs,
      }));
      setBookData({ ...res.payload.data, data: mappedData });
      } else {
        setError(res.payload.message || "Không lấy được dữ liệu");
      }
    } catch (err: any) {
      handleErrorApi({ error: err, setError });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(page);
  }, [page]);

  const filteredList = useMemo(() => {
    if (!bookData) return [];
    let list = bookData.data;
    if (filterTrangThai !== "all") {
      list = list.filter((b) => b.trangThai === filterTrangThai);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.tenSach.toLowerCase().includes(searchLower) ||
          (b.tacGia?.toLowerCase() || "").includes(searchLower) ||
          b.maSach?.toLowerCase().includes(searchLower)
      );
    }

    return list;
  }, [bookData, search, filterTrangThai]);

  const onDelete = async (idSach: number, tenSach: string) => {
    if (!confirm(`Bạn có chắc muốn xóa sách "${tenSach}"?`)) return;

    try {
      setLoading(true);
      const res = await bookService.delete(idSach);
      if (res.payload.success) {
        toast.success("Xóa thành công", {
          description: `Sách "${tenSach}" đã được xóa khỏi hệ thống.`
        });
        fetchBooks(page);
      }
    } catch (err: any) {
      handleErrorApi({ error: err });
    } finally {
      setLoading(false);
    }
  };

  // HÀM CHUYỂN ĐỔI SIZE SANG TIẾNG VIỆT (CHỮ THƯỜNG KHÔNG MÀU NỀN)
  const getSizeText = (size: string) => {
    switch (size?.toLowerCase()) {
      case "lon": return "Lớn";
      case "vua": return "Vừa";
      case "nho": return "Nhỏ";
      default: return "---";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "dang_su_dung":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-600 rounded-full text-xs font-semibold">
            <CheckCircle className="w-3 h-3" />
            Đang sử dụng
          </span>
        );
      case "tam_khoa":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-600 rounded-full text-xs font-semibold">
            <AlertCircle className="w-3 h-3" />
            Tạm khóa
          </span>
        );
      case "ngung_phuc_vu":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-600 rounded-full text-xs font-semibold">
            <XCircle className="w-3 h-3" />
            Ngưng phục vụ
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-500/20 text-gray-600 rounded-full text-xs font-semibold">
            N/A
          </span>
        );
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Sách</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý danh sách sách trong thư viện
          </p>
        </div>
        <Link href="/admin/books/add">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Thêm Sách
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên sách, tác giả hoặc mã sách..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10"
          />
        </div>

        <Select value={filterTrangThai} onValueChange={setFilterTrangThai}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="dang_su_dung">Đang sử dụng</SelectItem>
            <SelectItem value="tam_khoa">Tạm khóa</SelectItem>
            <SelectItem value="ngung_phuc_vu">Ngưng phục vụ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-t-primary border-b-primary/30 border-l-transparent border-r-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Đang tải...</p>
          </div>
        </div>
      ) : error ? (
        <div className="border rounded-lg p-10 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Hình ảnh</TableHead>
                <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Mã sách</TableHead>
                <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Tên sách</TableHead>
                <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Tác giả</TableHead>
                <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Số lượng</TableHead>
                <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Size sách</TableHead>
                <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Trạng thái</TableHead>
                <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                    Không tìm thấy sách nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredList.map((book) => (
                  <TableRow key={book.idSach}>
                    <TableCell className="px-4 py-3">
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                        <img
                          src={book.anhBia?.duongDan || book.hinhAnhs?.[0]?.duongDan || "/placeholder.jpg"}
                          alt={book.tenSach}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 font-mono text-sm text-muted-foreground">
                        {book.maSach || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Book className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium line-clamp-1">{book.tenSach}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground">
                      {book.tacGia || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm">
                      <div>T: {book.soLuong || 0}</div>
                      <div className="text-xs text-muted-foreground">C: {book.soLuongKhaDung || 0}</div>
                    </TableCell>
                    {/* SIZE SÁCH CHỮ TRẮNG BÌNH THƯỜNG */}
                    <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                      {getSizeText(book.sizesach || "")}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {getStatusBadge(book.trangThai || "")}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/books/edit/${book.idSach}`}>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => onDelete(book.idSach, book.tenSach)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {bookData && bookData.last_page > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!bookData.prev_page_url}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
          >
            Trước
          </Button>
          <span className="px-4 py-2 text-sm">
            Trang {bookData.current_page} / {bookData.last_page}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={!bookData.next_page_url}
            onClick={() => setPage((p) => Math.min(p + 1, bookData.last_page))}
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  );
}