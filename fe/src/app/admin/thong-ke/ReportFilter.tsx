"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, FileDown, Filter } from "lucide-react";

import categoryService from "@/services/category";
// Không cần lopService nữa

export interface FilterParams {
  dateType: string;
  startDate: string;
  endDate: string;
  studentCode: string; // Đổi classId -> studentCode
  categoryId: string;
}

interface FilterProps {
  onFilter: (params: FilterParams) => void;
  onExport: () => void;
  loading: boolean;
}

export default function ReportFilter({ onFilter, onExport, loading }: FilterProps) {
  const [categories, setCategories] = useState<any[]>([]);

  const [filters, setFilters] = useState<FilterParams>({
    dateType: "ngay_muon",
    startDate: "",
    endDate: "",
    studentCode: "", // Mặc định rỗng
    categoryId: "ALL",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resCat = await categoryService.getAll(1, 100);
        // Fix TS Error: Truy cập payload.data
        const listCat = (resCat as any).payload?.data?.data || (resCat as any).payload?.data || [];
        setCategories(listCat);
      } catch (error) {
        console.error("Lỗi tải danh mục:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          
          {/* Cột 1: Tiêu chí ngày */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
              <Filter className="w-3 h-3"/> Tiêu chí
            </label>
            <select 
              name="dateType" 
              className="w-full border rounded-md px-3 py-2 text-sm bg-blue-50/50 font-medium text-blue-700" 
              onChange={handleChange}
              value={filters.dateType}
            >
              <option value="ngay_muon">Ngày mượn</option>
              <option value="han_tra">Hạn trả</option>
            </select>
          </div>

          {/* Cột 2: Từ ngày */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground">Từ ngày</label>
            <input type="date" name="startDate" className="w-full border rounded-md px-3 py-2 text-sm" onChange={handleChange} />
          </div>

          {/* Cột 3: Đến ngày */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground">Đến ngày</label>
            <input type="date" name="endDate" className="w-full border rounded-md px-3 py-2 text-sm" onChange={handleChange} />
          </div>

          {/* Cột 4: MÃ SINH VIÊN (INPUT) - THAY ĐỔI Ở ĐÂY */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground">Mã Sinh Viên</label>
            <input 
              type="text" 
              name="studentCode" 
              placeholder="Nhập mã SV..." 
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
              onChange={handleChange}
              value={filters.studentCode}
            />
          </div>

          {/* Cột 5: Loại sách */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground">Loại sách</label>
            <select name="categoryId" className="w-full border rounded-md px-3 py-2 text-sm bg-white" onChange={handleChange}>
              <option value="ALL">Tất cả loại</option>
              {categories.map((cat: any) => (
                <option key={cat.id || cat.idDanhmuc} value={cat.id || cat.idDanhmuc}>
                  {cat.tenDanhMuc}
                </option>
              ))}
            </select>
          </div>

          {/* Cột 6: Nút bấm */}
          <div className="flex gap-2">
            <Button onClick={() => onFilter(filters)} disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700">
              <Search className="w-4 h-4 mr-2" /> Lọc
            </Button>
            <Button variant="outline" onClick={onExport} size="icon" title="Xuất PDF">
              <FileDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}