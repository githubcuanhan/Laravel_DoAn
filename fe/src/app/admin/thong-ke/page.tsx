"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, Printer, Book, Tags } from "lucide-react"; // Import thêm icon Tags
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import phieuMuonService from "@/services/phieuMuon";
import bookService from "@/services/book";
import categoryService from "@/services/category";
import ReportFilter, { FilterParams } from "./ReportFilter";
import RecentBorrowTable from "./RecentBorrowTable";
import DashboardStatCard from "@/app/admin/dashboard/components/DashboardStatCard";
import TopBooksTable from "@/app/admin/dashboard/components/TopBooksTable"; 
import CategoryStatsTable from "./CategoryStatsTable"; 
import { StatisticsPrintTemplate } from "./StatisticsPrintTemplate";

export default function StatisticsPage() {
  const [data, setData] = useState<any[]>([]); 
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [stats, setStats] = useState({
    totalMoney: 0,
    topCategory: "N/A", // <--- THAY topClass BẰNG topCategory
    overdueCount: 0,
    totalCount: 0,
    topBooks: [] as any[],      
    categoryStats: [] as any[] 
  });

  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Bao-cao-thong-ke-${new Date().toLocaleDateString("vi-VN").replace(/\//g, "-")}`,
  });

  useEffect(() => {
    handleFilter({
      dateType: "ngay_muon",
      startDate: "",
      endDate: "",
      studentCode: "",
      categoryId: "ALL"
    });
  }, []);

  const extractArrayData = (res: any) => {
      const payload = res?.payload || res;
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload?.data)) return payload.data;
      if (payload?.data?.data && Array.isArray(payload.data.data)) return payload.data.data;
      return [];
  };

  const handleFilter = async (filters: FilterParams) => {
    setLoading(true);
    setCurrentPage(1);
    setProgress("Đang tải dữ liệu...");
    try {
      const [resPhieu, resSach, resCat] = await Promise.all([
          phieuMuonService.getAll(1, 1000),
          bookService.getAll(1, 2000),   
          categoryService.getAll(1, 100) 
      ]);

      // A. MAP DANH MỤC
      const catList = extractArrayData(resCat);
      const catMap = new Map<number, string>();
      catList.forEach((c: any) => {
          const id = c.idDanhmuc || c.id;
          const name = c.tenDanhmuc || c.name;
          if (id && name) catMap.set(Number(id), name);
      });

      // B. MAP SÁCH
      const bookList = extractArrayData(resSach);
      const bookToCatNameMap = new Map<number, string>();
      const bookToCatIdMap = new Map<number, number>();
      
      bookList.forEach((b: any) => {
          let catId = b.danhMucs || b.danhMucIds || b.idDanhmuc || b.category_id || b.categoryId;
          if (!catId && typeof b.danhMuc === 'object') catId = b.danhMuc?.id || b.danhMuc?.idDanhmuc;
          
          const catName = catMap.get(Number(catId)) || "Chưa phân loại";
          const bookId = b.idSach || b.id;

          if (bookId) {
              bookToCatNameMap.set(Number(bookId), catName);
              bookToCatIdMap.set(Number(bookId), Number(catId));
          }
      });

      // C. XỬ LÝ PHIẾU
      const simpleList = extractArrayData(resPhieu);
      const fullSlips = await Promise.all(
        simpleList.map(async (item: any) => {
             if(item.chi_tiet_phieu_muons?.length > 0) return item;
             try {
                const detailRes = await phieuMuonService.getOne(item.id || item.idPhieumuon);
                const rawDetail = (detailRes as any).payload?.data || detailRes.data || item;
                return Array.isArray(rawDetail) ? rawDetail[0] : rawDetail;
             } catch { return item; }
        })
      );

      // D. ENRICH
      let allDetails: any[] = [];
      fullSlips.forEach((phieu: any) => {
          const details = phieu.chi_tiet_phieu_muons || phieu.chi_tiet || [];
          if (Array.isArray(details)) {
              details.forEach((dt: any) => {
                  const bookId = dt.sach?.id || dt.sach?.idSach;
                  const resolvedCatName = bookToCatNameMap.get(Number(bookId)) || "Không xác định";
                  const resolvedCatId = bookToCatIdMap.get(Number(bookId));

                  allDetails.push({
                      ...dt,
                      phieu_muon: phieu, 
                      ngayMuon: phieu.ngayMuon,
                      hanTra: phieu.hanTra,
                      enrichedCategory: { id: resolvedCatId, name: resolvedCatName }
                  });
              });
          }
      });

      // E. LỌC
      let items = allDetails;
      const dateField = filters.dateType === "han_tra" ? "hanTra" : "ngayMuon";
      if (filters.startDate) {
          const start = new Date(filters.startDate);
          start.setHours(0, 0, 0, 0);
          items = items.filter((i: any) => new Date(i.phieu_muon?.[dateField]) >= start);
      }
      if (filters.endDate) {
          const end = new Date(filters.endDate);
          end.setHours(23, 59, 59, 999);
          items = items.filter((i: any) => new Date(i.phieu_muon?.[dateField]) <= end);
      }
      if (filters.studentCode && filters.studentCode.trim() !== "") {
        const keyword = filters.studentCode.toLowerCase().trim();
        items = items.filter((item: any) => {
          const user = item.phieu_muon?.nguoi_muon || {};
          const mssv = user.maSinhVien || user.studentCode || "";
          const email = user.email || "";
          const name = user.hoTen || "";
          return String(mssv).toLowerCase().includes(keyword) || 
                 String(email).toLowerCase().includes(keyword) ||
                 String(name).toLowerCase().includes(keyword);
        });
      }
      if (filters.categoryId !== "ALL") {
          items = items.filter((item: any) => String(item.enrichedCategory?.id) === String(filters.categoryId));
      }
      
      setData(items);
      calculateStats(items); 

    } catch (error) {
      console.error("Lỗi:", error);
      setData([]);
    } finally {
      setLoading(false);
      setProgress("");
    }
  };

  const calculateStats = (items: any[]) => {
    let money = 0;
    let overdue = 0;
    const bookCount: Record<string, number> = {};     
    const bookInfo: Record<string, any> = {};         
    const categoryCount: Record<string, number> = {}; 

    items.forEach((item) => {
      // Tiền & Quá hạn
      if (item.tienPhat) money += parseFloat(item.tienPhat.toString());
      if (item.trangThai === 'qua_han' || item.phieu_muon?.trangThai === 'qua_han') overdue++;
      
      // Sách
      if (item.sach) {
          const bookId = item.sach.id || item.sach.idSach;
          bookCount[bookId] = (bookCount[bookId] || 0) + 1;
          bookInfo[bookId] = item.sach; 
      }

      // Danh mục
      const catName = item.enrichedCategory?.name || "Chưa phân loại";
      categoryCount[catName] = (categoryCount[catName] || 0) + 1;
    });

    const topBooksArray = Object.entries(bookCount)
        .map(([id, count]) => ({ idSach: id, totalBorrowed: count, sach: bookInfo[id] }))
        .sort((a, b) => b.totalBorrowed - a.totalBorrowed).slice(0, 10); 

    const categoryStatsArray = Object.entries(categoryCount)
        .map(([name, count]) => ({
            id: name, name, count,
            percentage: Math.round((count / items.length) * 100) || 0
        }))
        .sort((a, b) => b.count - a.count);

    // --- LOGIC LẤY TOP CATEGORY ---
    const topCategoryName = categoryStatsArray.length > 0 ? categoryStatsArray[0].name : "Không có";

    setStats({
      totalMoney: money,
      overdueCount: overdue,
      totalCount: items.length,
      topCategory: topCategoryName, // <--- CẬP NHẬT STATE MỚI
      topBooks: topBooksArray,       
      categoryStats: categoryStatsArray 
    });
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("BAO CAO THONG KE", 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [["Sach", "Danh muc", "Nguoi muon", "Lop", "Ngay muon", "Trang thai"]],
      body: data.map((item) => [
        item.sach?.tenSach || "",
        item.enrichedCategory?.name || "", 
        item.phieu_muon?.nguoi_muon?.hoTen || "",
        item.phieu_muon?.nguoi_muon?.lop?.tenLop || "",
        new Date(item.phieu_muon?.ngayMuon).toLocaleDateString('vi-VN'),
        item.trangThai
      ]),
    });
    doc.save("thong-ke.pdf");
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  
  const PaginationControls = ({ total, page, setPage }: any) => {
      const totalPages = Math.ceil(total / itemsPerPage);
      if (totalPages <= 1) return null;
      return (
        <div className="flex items-center justify-center gap-4 pt-4">
            <button onClick={() => setPage((p:number) => Math.max(p - 1, 1))} disabled={page === 1} className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50">‹</button>
            <span className="text-sm">Trang {page} / {totalPages}</span>
            <button onClick={() => setPage((p:number) => Math.min(p + 1, totalPages))} disabled={page === totalPages} className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50">›</button>
        </div>
      );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Báo Cáo & Thống Kê</h1>
        <div className="flex gap-2">
            {loading && <div className="text-sm text-blue-600 flex items-center gap-2"><Loader2 className="animate-spin w-4 h-4"/> {progress}</div>}
            
            <button onClick={() => handlePrint()} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md">
              <Printer className="w-4 h-4" /> In Báo Cáo
            </button>
        </div>
      </div>

      <ReportFilter onFilter={handleFilter} onExport={handleExportPDF} loading={loading} />

      {/* KPI Cards - THAY ĐỔI TẠI ĐÂY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStatCard title="Tổng tiền phạt" value={`${stats.totalMoney.toLocaleString('vi-VN')} đ`} />
        {/* ĐỔI TIÊU ĐỀ THÀNH THỂ LOẠI HOT NHẤT */}
        <DashboardStatCard title="Thể loại hot nhất" value={stats.topCategory} />
        <DashboardStatCard title="Sách quá hạn" value={stats.overdueCount} />
        <DashboardStatCard title="Tổng lượt sách mượn" value={stats.totalCount} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-full"><TopBooksTable books={stats.topBooks} /></div>
          <div className="h-full"><CategoryStatsTable data={stats.categoryStats} /></div>
      </div>

      <div className="space-y-4">
          <div ref={printRef}>
              <RecentBorrowTable 
                title={`Dữ liệu chi tiết (${data.length} bản ghi)`} 
                rows={currentItems} 
              />
          </div>
          <PaginationControls total={data.length} page={currentPage} setPage={setCurrentPage} />
      </div>

      <div className="hidden">
        <StatisticsPrintTemplate ref={printRef} stats={stats} data={data} />
      </div>
    </div>
  );
}