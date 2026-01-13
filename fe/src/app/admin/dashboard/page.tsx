"use client";

import { useEffect, useState, useRef } from "react"; // Đã thêm useRef
import dashboardService, { DashboardData } from "@/services/dashboard";
import DashboardStatCard from "./components/DashboardStatCard";
import DashboardChart from "./components/DashboardChart";
import TopBooksTable from "./components/TopBooksTable";
import RecentBorrowTable from "./components/RecentBorrowTable";
import RecentInvoiceTable from "./components/RecentInvoiceTable";
import { Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { DashboardPrintTemplate } from "./components/DashboardPrintTemplate";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // Khởi tạo Ref cho việc in
  const printRef = useRef<HTMLDivElement>(null);

  // Cấu hình hàm in
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Báo cáo Dashboard - ${new Date().toLocaleDateString("vi-VN")}`,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await dashboardService.getAll();
        if (res.payload.success) setData(res.payload.data);
      } catch (error) {
        console.error("Lỗi khi tải dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-t-primary border-b-primary/30 border-l-transparent border-r-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Đang tải dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <p className="text-center text-red-500">
          Không thể tải dữ liệu dashboard
        </p>
      </div>
    );
  }

  const { kpi, borrowStats, fineStats, topBooks, recentBorrows, recentInvoices } =
    data;

  return (
    <div className="p-6 space-y-6">
      {/* Header - Đã thêm nút In báo cáo */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Tổng quan hoạt động thư viện
          </p>
        </div>
        <button
          onClick={() => handlePrint()}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all"
        >
          <Printer className="w-4 h-4" />
          In báo cáo
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStatCard title="Tổng người dùng" value={kpi.totalUsers} />
        <DashboardStatCard title="Sách trong thư viện" value={kpi.totalBooks} />
        <DashboardStatCard title="Lượt mượn" value={kpi.totalBorrows} />
        <DashboardStatCard
          title="Tiền phạt"
          value={
            parseFloat(kpi.totalIncome.toString()).toLocaleString("vi-VN") +
            " đ"
          }
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardChart
          data={borrowStats}
          title="Lượt mượn theo tháng"
          dataKey="total"
        />
        <DashboardChart
          data={fineStats}
          title="Tiền phạt theo tháng"
          dataKey="totalFine"
        />
      </div>

      {/* Tables */}
      <TopBooksTable books={topBooks} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RecentBorrowTable rows={recentBorrows} title="Lượt mượn gần đây" />
        <RecentInvoiceTable rows={recentInvoices} title="Hóa đơn gần đây" />
      </div>

      {/* Thành phần ẩn phục vụ việc in */}
      <div className="hidden">
        <DashboardPrintTemplate ref={printRef} data={data} />
      </div>
    </div>
  );
}