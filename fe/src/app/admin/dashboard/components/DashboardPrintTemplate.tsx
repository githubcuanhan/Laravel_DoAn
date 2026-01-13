import React from "react";
import { DashboardData } from "@/services/dashboard";

interface Props {
  data: DashboardData;
}

export const DashboardPrintTemplate = React.forwardRef<HTMLDivElement, Props>(
  ({ data }, ref) => {
    return (
      <div ref={ref} className="p-10 text-black bg-white w-full min-h-screen">
        {/* Tiêu đề báo cáo */}
        <div className="text-center mb-10 border-b-2 border-black pb-5">
          <h1 className="text-2xl font-bold uppercase">Báo Cáo Tổng Quan Thư Viện</h1>
          <p>Ngày xuất: {new Date().toLocaleString("vi-VN")}</p>
        </div>

        {/* 1. Chỉ số chính (KPI) */}
        <h2 className="text-lg font-bold mb-3">1. Chỉ số chính</h2>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="border border-black p-3">Tổng người dùng: <strong>{data.kpi.totalUsers}</strong></div>
          <div className="border border-black p-3">Sách trong thư viện: <strong>{data.kpi.totalBooks}</strong></div>
          <div className="border border-black p-3">Tổng lượt mượn: <strong>{data.kpi.totalBorrows}</strong></div>
          <div className="border border-black p-3">Tổng tiền phạt: <strong>{Number(data.kpi.totalIncome).toLocaleString()} đ</strong></div>
        </div>

        {/* 2. Top 10 sách */}
        <h2 className="text-lg font-bold mb-3">2. Top sách được mượn nhiều nhất</h2>
        <table className="w-full border-collapse border border-black mb-8 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-2 text-left">Tên sách</th>
              <th className="border border-black p-2 text-right">Lượt mượn</th>
            </tr>
          </thead>
          <tbody>
            {data.topBooks.map((b: any, i: number) => (
              <tr key={i}>
                <td className="border border-black p-2">{b.sach?.tenSach}</td>
                <td className="border border-black p-2 text-right">{b.totalBorrowed}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 3. Hoạt động gần đây */}
        <h2 className="text-lg font-bold mb-3">3. Hoạt động mượn sách gần đây</h2>
        <table className="w-full border-collapse border border-black mb-8 text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-2 text-left">Người mượn</th>
              <th className="border border-black p-2 text-left">Tên sách</th>
              <th className="border border-black p-2 text-center">Ngày mượn</th>
              <th className="border border-black p-2 text-center">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {data.recentBorrows.slice(0, 10).map((r: any, i: number) => (
              <tr key={i}>
                <td className="border border-black p-2">{r.nguoi_muon?.hoTen}</td>
                <td className="border border-black p-2">{r.sach?.tenSach}</td>
                <td className="border border-black p-2 text-center">
                  {new Date(r.ngayMuon).toLocaleDateString("vi-VN")}
                </td>
                <td className="border border-black p-2 text-center">
                  {r.trangThai === "dang_muon" ? "Đang mượn" : r.trangThai === "da_tra" ? "Đã trả" : "Khác"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="mt-16 flex justify-between px-10">
          <div className="text-center italic">
            <p>Ngày .... tháng .... năm ....</p>
            <p className="font-bold not-italic">Người lập biểu</p>
          </div>
          <div className="text-center font-bold">
            <p>Xác nhận của Thủ thư</p>
          </div>
        </div>
      </div>
    );
  }
);

DashboardPrintTemplate.displayName = "DashboardPrintTemplate";