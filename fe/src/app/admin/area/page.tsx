"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Edit, Trash2, Search, MapPin } from "lucide-react";
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
import Link from "next/link";
import areaService from "@/services/area";
import type { Khu } from "@/lib/types/library.types";
import type { PaginatedResponse, PaginatedData } from "@/lib/types/api.types";
import { toast } from "sonner";
import { handleErrorApi } from "@/lib/utils/mini";

export default function KhuTable() {
  const [khuData, setKhuData] = useState<PaginatedData<Khu> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const fetchKhu = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await areaService.getAll(page, perPage);
      if (res.payload.success) {
        setKhuData(res.payload.data);
      } else {
        setError(res.payload.message || "Dữ liệu trả về không hợp lệ");
      }
    } catch (err: any) {
      handleErrorApi({ error: err, setError });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKhu(page);
  }, [page]);

  const filteredList = useMemo(() => {
    if (!khuData) return [];
    if (!search) return khuData.data;
    const searchLower = search.toLowerCase();
    return khuData.data.filter(
      (khu) =>
        khu.tenKhu.toLowerCase().includes(searchLower) ||
        khu.viTri?.toLowerCase().includes(searchLower)
    );
  }, [khuData, search]);

  const onDelete = async (areaId: number, tenKhu: string) => {
    if (!confirm(`Bạn có chắc muốn xóa khu vực "${tenKhu}"?`)) return;

    try {
      setLoading(true);
      const response = await areaService.delete(areaId);
      if (response.payload.success) {
        fetchKhu(page);
        toast.success("Thành công",{
          description: "Khu vực đã được xóa",
        });
      }
    } catch (error: any) {
      handleErrorApi({ error });
    } finally {
      setLoading(false);
    }
  };

  const allKhu = khuData?.data || [];
  const totalKhu = allKhu.length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Khu vực</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý danh sách khu vực trong thư viện
          </p>
        </div>
        <Link href="/admin/area/add">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Thêm Khu vực
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên khu hoặc vị trí..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
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
                  ID
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                  Tên Khu
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                  Vị Trí
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
                    Không tìm thấy khu vực nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredList.map((khu) => (
                  <TableRow key={khu.idKhu}>
                    <TableCell className="px-4 py-3">
                      <span className="font-mono text-sm">#{khu.idKhu}</span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{khu.tenKhu}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground">
                      {khu.viTri || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/area/edit/${khu.idKhu}`}>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => onDelete(khu.idKhu, khu.tenKhu)}
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
      {khuData && khuData.last_page > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!khuData.prev_page_url}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
          >
            Trước
          </Button>
          <span className="px-4 py-2">
            Trang {khuData.current_page} / {khuData.last_page}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={!khuData.next_page_url}
            onClick={() => setPage((p) => Math.min(p + 1, khuData.last_page))}
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  );
}
