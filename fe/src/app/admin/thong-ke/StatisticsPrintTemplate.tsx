import React from "react";

interface Props {
  stats: {
    totalMoney: number;
    topCategory: string;
    overdueCount: number;
    totalCount: number;
    topBooks: any[];      // Thêm dữ liệu Top Sách
    categoryStats: any[]; // Thêm dữ liệu Thể loại
  };
  data: any[]; // Danh sách phiếu chi tiết
  filterInfo?: string;
}

export const StatisticsPrintTemplate = React.forwardRef<HTMLDivElement, Props>(
  ({ stats, data, filterInfo }, ref) => {
    return (
      <div ref={ref} className="p-10 text-black bg-white w-full min-h-screen font-sans">
        {/* HEADER: Đơn giản giống Dashboard */}
        <div className="text-center mb-10 border-b-2 border-black pb-5">
          <h1 className="text-2xl font-bold uppercase">Báo Cáo Thống Kê Chi Tiết</h1>
          <p>Ngày xuất: {new Date().toLocaleString("vi-VN")}</p>
          {filterInfo && <p className="text-sm mt-1 italic">({filterInfo})</p>}
        </div>

        {/* 1. CHỈ SỐ TỔNG QUAN */}
        <h2 className="text-lg font-bold mb-3 uppercase border-b border-gray-400 pb-1">1. Tổng quan</h2>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="border border-black p-3">
            Tổng lượt mượn: <strong className="float-right text-lg">{stats.totalCount}</strong>
          </div>
          <div className="border border-black p-3">
            Tổng tiền phạt: <strong className="float-right text-lg">{stats.totalMoney.toLocaleString('vi-VN')} đ</strong>
          </div>
          <div className="border border-black p-3">
            Sách quá hạn: <strong className="float-right text-lg text-red-600">{stats.overdueCount}</strong>
          </div>
          <div className="border border-black p-3">
            Thể loại hot nhất: <strong className="float-right text-lg">{stats.topCategory}</strong>
          </div>
        </div>

        {/* 2. TOP SÁCH MƯỢN NHIỀU */}
        <h2 className="text-lg font-bold mb-3 uppercase border-b border-gray-400 pb-1">2. Top sách được quan tâm</h2>
        <table className="w-full border-collapse border border-black mb-8 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-2 w-12 text-center">#</th>
              <th className="border border-black p-2 text-left">Tên sách</th>
              <th className="border border-black p-2 text-left">Tác giả</th>
              <th className="border border-black p-2 text-right w-24">Lượt mượn</th>
            </tr>
          </thead>
          <tbody>
            {stats.topBooks.length > 0 ? (
              stats.topBooks.map((b: any, i: number) => (
                <tr key={i}>
                  <td className="border border-black p-2 text-center">{i + 1}</td>
                  <td className="border border-black p-2">{b.sach?.tenSach || "N/A"}</td>
                  <td className="border border-black p-2">{b.sach?.tacGia || "-"}</td>
                  <td className="border border-black p-2 text-right font-bold">{b.totalBorrowed}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="border border-black p-3 text-center italic">Chưa có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* 3. THỐNG KÊ THỂ LOẠI */}
        <h2 className="text-lg font-bold mb-3 uppercase border-b border-gray-400 pb-1">3. Phân bố thể loại</h2>
        <table className="w-full border-collapse border border-black mb-8 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-2 w-12 text-center">#</th>
              <th className="border border-black p-2 text-left">Tên danh mục</th>
              <th className="border border-black p-2 text-center w-24">Tỷ lệ</th>
              <th className="border border-black p-2 text-right w-24">Số lượng</th>
            </tr>
          </thead>
          <tbody>
            {stats.categoryStats.length > 0 ? (
              stats.categoryStats.slice(0, 10).map((c: any, i: number) => (
                <tr key={i}>
                  <td className="border border-black p-2 text-center">{i + 1}</td>
                  <td className="border border-black p-2">{c.name}</td>
                  <td className="border border-black p-2 text-center">{c.percentage}%</td>
                  <td className="border border-black p-2 text-right">{c.count}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="border border-black p-3 text-center italic">Chưa có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* 4. DANH SÁCH CHI TIẾT (Trang chính) */}
        <h2 className="text-lg font-bold mb-3 uppercase border-b border-gray-400 pb-1">4. Danh sách phiếu mượn chi tiết</h2>
        <table className="w-full border-collapse border border-black text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-2 w-10 text-center">STT</th>
              <th className="border border-black p-2 text-left">Tên Sách</th>
              <th className="border border-black p-2 text-left w-32">Danh mục</th>
              <th className="border border-black p-2 text-left w-32">Người mượn</th>
              <th className="border border-black p-2 text-center w-20">Ngày mượn</th>
              <th className="border border-black p-2 text-center w-20">Hạn trả</th>
              <th className="border border-black p-2 text-right w-20">Tiền phạt</th>
              <th className="border border-black p-2 text-center w-24">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  <td className="border border-black p-2 text-center">{index + 1}</td>
                  <td className="border border-black p-2">{item.sach?.tenSach || "N/A"}</td>
                  <td className="border border-black p-2">{item.enrichedCategory?.name || "-"}</td>
                  <td className="border border-black p-2">
                    <div>{item.phieu_muon?.nguoi_muon?.hoTen}</div>
                    <div className="italic text-[10px]">{item.phieu_muon?.nguoi_muon?.maSinhVien}</div>
                  </td>
                  <td className="border border-black p-2 text-center">
                    {new Date(item.phieu_muon?.ngayMuon).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="border border-black p-2 text-center">
                    {new Date(item.phieu_muon?.hanTra).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="border border-black p-2 text-right">
                    {item.tienPhat ? Number(item.tienPhat).toLocaleString('vi-VN') : 0}
                  </td>
                  <td className="border border-black p-2 text-center">
                      {item.trangThai === 'da_tra' ? 'Đã trả' : 
                       item.trangThai === 'dang_muon' ? 'Đang mượn' : 
                       item.trangThai === 'qua_han' ? 'Quá hạn' : item.trangThai}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="border border-black p-4 text-center italic">Không có dữ liệu phù hợp</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* FOOTER: Chữ ký */}
        <div className="mt-16 flex justify-between px-10 break-inside-avoid">
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

StatisticsPrintTemplate.displayName = "StatisticsPrintTemplate";