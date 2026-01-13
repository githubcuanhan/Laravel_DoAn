"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Edit, Trash2, Search, BookOpen, Library, MapPin } from "lucide-react";
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
import bookshelvesService from "@/services/bookshelf";
import type { KeSach } from "@/lib/types/library.types";
import type { PaginatedData } from "@/lib/types/api.types";
import { toast } from "sonner";
import { handleErrorApi } from "@/lib/utils/mini";

export default function KeSachTable() {
  const [keSachData, setKeSachData] = useState<PaginatedData<KeSach> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const fetchKeSach = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await bookshelvesService.getAll(page, perPage);
      if (res.payload.success) setKeSachData(res.payload.data);
      else setError(res.payload.message || "Dữ liệu trả về không hợp lệ");
    } catch (err: any) {
      handleErrorApi({ error: err, setError });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeSach(page);
  }, [page]);

  const [filterKhu, setFilterKhu] = useState<string>("all");

  const filteredList = useMemo(() => {
    if (!keSachData) return [];
    let list = keSachData.data;

    if (filterKhu !== "all") {
      list = list.filter((ke) => ke.idKhu === Number(filterKhu));
    }

    if (search) {
      const searchLower = search.toLowerCase();
      list = list.filter(
        (ke) =>
          ke.tenKe.toLowerCase().includes(searchLower) ||
          (ke.khu?.tenKhu.toLowerCase() || "").includes(searchLower)
      );
    }

    return list;
  }, [keSachData, search, filterKhu]);

  const khuList = useMemo(() => {
    if (!keSachData) return [];
    const khuMap = new Map();
    keSachData.data.forEach((ke) => {
      if (ke.khu) {
        khuMap.set(ke.idKhu, ke.khu);
      }
    });
    return Array.from(khuMap.values());
  }, [keSachData]);

  const onDelete = async (idKeSach: number, tenKe: string) => {
    if (!confirm(`Bạn có chắc muốn xóa kệ sách "${tenKe}"?`)) return;

    try {
      setLoading(true);
      const res = await bookshelvesService.delete(idKeSach);
      if (res.payload.success) {
          toast.success("Thành công", { description: "Kệ sách đã được xóa" });
        fetchKeSach(page);
      }
    } catch (err: any) {
      handleErrorApi({ error: err });
    } finally {
      setLoading(false);
    }
  };

  const allKeSach = keSachData?.data || [];
  const totalKeSach = allKeSach.length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Kệ Sách</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý danh sách kệ sách trong thư viện
          </p>
        </div>
        <Link href="/admin/bookshelves/add">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Thêm Kệ sách
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên kệ hoặc khu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Khu Filter */}
        <Select value={filterKhu} onValueChange={setFilterKhu}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lọc theo khu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả khu</SelectItem>
            {khuList.map((khu) => (
              <SelectItem key={khu.idKhu} value={khu.idKhu.toString()}>
                {khu.tenKhu}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
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
                <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                  ID Kệ
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                  Tên Kệ
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                  Tên Khu
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase text-right">
                  Hành động
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    Không tìm thấy kệ sách nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredList.map((ke) => (
                  <TableRow key={ke.idKeSach}>
                    <TableCell className="px-4 py-3">
                      <span className="font-mono text-sm">#{ke.idKeSach}</span>
                    </TableCell>

                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{ke.tenKe}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{ke.khu?.tenKhu || "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/bookshelves/edit/${ke.idKeSach}`}>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => onDelete(ke.idKeSach, ke.tenKe)}
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
      {keSachData && keSachData.last_page > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!keSachData.prev_page_url}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
          >
            Trước
          </Button>
          <span className="px-4 py-2">
            Trang {keSachData.current_page} / {keSachData.last_page}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={!keSachData.next_page_url}
            onClick={() => setPage((p) => Math.min(p + 1, keSachData.last_page))}
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  );
}
