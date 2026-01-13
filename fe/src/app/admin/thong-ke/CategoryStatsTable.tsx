"use client";

import { useState, useMemo } from "react";
import { Search, Tags, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface CategoryStat {
  id: number | string;
  name: string;
  count: number;      // Số lượt mượn
  percentage: number; // Tỷ lệ %
}

export default function CategoryStatsTable({ data }: { data: CategoryStat[] }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 5; // Số dòng mỗi trang (chỉnh lên 10 nếu muốn dài hơn)

  // 1. Logic Lọc (Client-side)
  const filteredList = useMemo(() => {
    if (!search) return data;
    const searchLower = search.toLowerCase();
    return data.filter((item) =>
      item.name.toLowerCase().includes(searchLower)
    );
  }, [data, search]);

  // 2. Logic Phân trang
  const totalPages = Math.ceil(filteredList.length / perPage);
  const paginatedList = filteredList.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Tags className="w-5 h-5 text-blue-600" /> Thống kê theo Danh mục
          </CardTitle>
          
          {/* Ô tìm kiếm */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm tên danh mục..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // Reset về trang 1 khi tìm
              }}
              className="pl-8 h-9 text-sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="w-[50px] text-center">#</TableHead>
                <TableHead>Tên Danh mục</TableHead>
                <TableHead className="w-[150px]">Mức độ phổ biến</TableHead>
                <TableHead className="text-right">Lượt mượn</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    Không có dữ liệu phù hợp
                  </TableCell>
                </TableRow>
              ) : (
                paginatedList.map((cat, index) => {
                  const rank = (page - 1) * perPage + index + 1;
                  return (
                    <TableRow key={index}>
                      <TableCell className="text-center font-medium text-muted-foreground">
                        {rank}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-blue-700">{cat.name}</span>
                      </TableCell>
                      <TableCell>
                        {/* Thanh phần trăm */}
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                              style={{ width: `${cat.percentage}%` }} 
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-8 text-right">
                            {cat.percentage}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {cat.count}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Thanh phân trang */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-muted-foreground">
              Hiển thị {paginatedList.length} / {filteredList.length} danh mục
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="p-1.5 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center px-2 text-sm font-medium">
                {page} / {totalPages}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="p-1.5 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}