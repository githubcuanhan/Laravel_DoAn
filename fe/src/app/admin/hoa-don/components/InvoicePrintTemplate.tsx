import React from "react";
import { HoaDon } from "@/services/hoaDon";

interface InvoicePrintTemplateProps {
  hoaDon: HoaDon;
}

export const InvoicePrintTemplate = React.forwardRef<
  HTMLDivElement,
  InvoicePrintTemplateProps
>(({ hoaDon }, ref) => {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "phat_tre_hen":
        return "Phạt trễ hạn";
      case "mat_sach":
        return "Mất sách";
      case "khac":
        return "Khác";
      default:
        return type;
    }
  };

  return (
    <div ref={ref} className="print-content">
      <style jsx>{`
        @media print {
          @page {
            size: A4;
            margin: 20mm;
          }
          
          .print-content {
            font-family: 'Times New Roman', serif;
            color: #000;
            background: #fff;
          }
          
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="p-8 bg-white text-black" style={{ minHeight: '297mm', width: '210mm' }}>
        {/* Header */}
        <div className="text-center mb-8 border-b-2 border-black pb-4">
          <h1 className="text-3xl font-bold mb-2">THƯ VIỆN</h1>
          <p className="text-sm">Địa chỉ: [Địa chỉ thư viện]</p>
          <p className="text-sm">Điện thoại: [Số điện thoại] | Email: [Email]</p>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold uppercase">HÓA ĐƠN THANH TOÁN</h2>
          <p className="text-lg mt-2">Số: {hoaDon.idHoadon}</p>
          <p className="text-base mt-1">Loại: {getTypeLabel(hoaDon.loaiHoadon)}</p>
        </div>

        {/* Thông tin người bị thu */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 uppercase border-b border-gray-400 pb-1">
            I. Thông tin người thanh toán
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-2">
                <span className="font-semibold">Họ và tên:</span>{" "}
                {hoaDon.nguoi_bi_thu?.hoTen}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Email:</span>{" "}
                {hoaDon.nguoi_bi_thu?.email}
              </p>
            </div>
            <div>
              {hoaDon.nguoi_bi_thu?.maSinhVien && (
                <p className="mb-2">
                  <span className="font-semibold">Mã sinh viên:</span>{" "}
                  {hoaDon.nguoi_bi_thu.maSinhVien}
                </p>
              )}
              {hoaDon.nguoi_bi_thu?.soDienThoai && (
                <p className="mb-2">
                  <span className="font-semibold">Số điện thoại:</span>{" "}
                  {hoaDon.nguoi_bi_thu.soDienThoai}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Thông tin hóa đơn */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 uppercase border-b border-gray-400 pb-1">
            II. Thông tin hóa đơn
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <p>
              <span className="font-semibold">Ngày lập:</span>{" "}
              {new Date(hoaDon.ngayLap).toLocaleDateString("vi-VN")}
            </p>
            <p>
              <span className="font-semibold">Người thu:</span>{" "}
              {hoaDon.nguoi_thu?.hoTen}
            </p>
            <p>
              <span className="font-semibold">Trạng thái:</span>{" "}
              {hoaDon.trangThai === "da_thanh_toan" ? "Đã thanh toán" : "Chưa thanh toán"}
            </p>
          </div>
        </div>

        {/* Chi tiết hóa đơn */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 uppercase border-b border-gray-400 pb-1">
            III. Chi tiết thanh toán
          </h3>
          <table className="w-full border-collapse border border-black">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-2 text-left">STT</th>
                <th className="border border-black p-2 text-left">Tên sách</th>
                <th className="border border-black p-2 text-left">Mã sách</th>
                <th className="border border-black p-2 text-center">Số ngày trễ</th>
                <th className="border border-black p-2 text-right">Tiền phạt</th>
              </tr>
            </thead>
            <tbody>
              {hoaDon.chi_tiet_hoa_dons?.map((chiTiet, index) => (
                <tr key={`${chiTiet.idHoadon}-${chiTiet.idCTPhieumuon}`}>
                  <td className="border border-black p-2">{index + 1}</td>
                  <td className="border border-black p-2">
                    <div>
                      <p className="font-semibold">
                        {chiTiet.chi_tiet_phieu_muon?.sach?.tenSach}
                      </p>
                      <p className="text-sm text-gray-600">
                        {chiTiet.chi_tiet_phieu_muon?.sach?.tacGia}
                      </p>
                    </div>
                  </td>
                  <td className="border border-black p-2">
                    {chiTiet.chi_tiet_phieu_muon?.sach?.maSach}
                  </td>
                  <td className="border border-black p-2 text-center">
                    {chiTiet.soNgayTre} ngày
                  </td>
                  <td className="border border-black p-2 text-right">
                    {parseFloat(chiTiet.soTienPhat.toString()).toLocaleString("vi-VN")}đ
                  </td>
                </tr>
              ))}
              <tr className="font-bold bg-gray-100">
                <td colSpan={4} className="border border-black p-2 text-right">
                  Tổng cộng:
                </td>
                <td className="border border-black p-2 text-right">
                  {parseFloat(hoaDon.tongTien.toString()).toLocaleString("vi-VN")}đ
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Ghi chú */}
        {hoaDon.ghiChu && (
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2 uppercase">Ghi chú:</h3>
            <p className="italic">{hoaDon.ghiChu}</p>
          </div>
        )}

        {/* Số tiền bằng chữ */}
        <div className="mb-6">
          <p className="font-semibold">
            Số tiền bằng chữ:{" "}
            <span className="italic">
              {/* Có thể thêm hàm convert số sang chữ ở đây */}
              [Số tiền bằng chữ]
            </span>
          </p>
        </div>

        {/* Chữ ký */}
        <div className="mt-12 grid grid-cols-2 gap-8">
          <div className="text-center">
            <p className="font-semibold mb-16">Người thanh toán</p>
            <p className="italic">(Ký và ghi rõ họ tên)</p>
          </div>
          <div className="text-center">
            <p className="font-semibold mb-1">
              Ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm{" "}
              {new Date().getFullYear()}
            </p>
            <p className="font-semibold mb-16">Người thu</p>
            <p className="italic">(Ký và ghi rõ họ tên)</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-300 text-center text-sm text-gray-600">
          <p>
            Cảm ơn bạn đã thanh toán. Vui lòng giữ hóa đơn này để đối chiếu khi cần thiết.
          </p>
        </div>
      </div>
    </div>
  );
});

InvoicePrintTemplate.displayName = "InvoicePrintTemplate";
