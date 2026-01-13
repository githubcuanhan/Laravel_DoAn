import React from "react";
import { PhieuMuon } from "@/services/phieuMuon";

interface PhieuMuonPrintTemplateProps {
  phieuMuon: PhieuMuon;
}

export const BorrowReceiptPrintTemplate = React.forwardRef<
  HTMLDivElement,
  PhieuMuonPrintTemplateProps
>(({ phieuMuon }, ref) => {
  const totalFine = phieuMuon.chi_tiet_phieu_muons?.reduce(
    (total, ct) => total + parseFloat(ct.tienPhat.toString()),
    0
  ) || 0;

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
          <h2 className="text-2xl font-bold uppercase">PHIẾU MƯỢN SÁCH</h2>
          <p className="text-lg mt-2">Số: {phieuMuon.idPhieumuon}</p>
        </div>

        {/* Thông tin người mượn */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 uppercase border-b border-gray-400 pb-1">
            I. Thông tin người mượn
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-2">
                <span className="font-semibold">Họ và tên:</span>{" "}
                {phieuMuon.nguoi_muon?.hoTen}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Email:</span>{" "}
                {phieuMuon.nguoi_muon?.email}
              </p>
            </div>
            <div>
              {phieuMuon.nguoi_muon?.maSinhVien && (
                <p className="mb-2">
                  <span className="font-semibold">Mã sinh viên:</span>{" "}
                  {phieuMuon.nguoi_muon.maSinhVien}
                </p>
              )}
              {phieuMuon.nguoi_muon?.soDienThoai && (
                <p className="mb-2">
                  <span className="font-semibold">Số điện thoại:</span>{" "}
                  {phieuMuon.nguoi_muon.soDienThoai}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Thông tin phiếu mượn */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 uppercase border-b border-gray-400 pb-1">
            II. Thông tin mượn sách
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <p>
              <span className="font-semibold">Ngày mượn:</span>{" "}
              {new Date(phieuMuon.ngayMuon).toLocaleDateString("vi-VN")}
            </p>
            <p>
              <span className="font-semibold">Hạn trả:</span>{" "}
              {new Date(phieuMuon.hanTra).toLocaleDateString("vi-VN")}
            </p>
            <p>
              <span className="font-semibold">Người tạo:</span>{" "}
              {phieuMuon.nguoi_tao?.hoTen}
            </p>
          </div>
        </div>

        {/* Danh sách sách */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 uppercase border-b border-gray-400 pb-1">
            III. Danh sách sách mượn
          </h3>
          <table className="w-full border-collapse border border-black">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-2 text-left">STT</th>
                <th className="border border-black p-2 text-left">Tên sách</th>
                <th className="border border-black p-2 text-left">Mã sách</th>
                <th className="border border-black p-2 text-center">SL</th>
                <th className="border border-black p-2 text-left">Hạn trả</th>
                <th className="border border-black p-2 text-left">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {phieuMuon.chi_tiet_phieu_muons?.map((chiTiet, index) => (
                <tr key={chiTiet.idCTPhieumuon}>
                  <td className="border border-black p-2">{index + 1}</td>
                  <td className="border border-black p-2">
                    <div>
                      <p className="font-semibold">{chiTiet.sach?.tenSach}</p>
                      <p className="text-sm text-gray-600">{chiTiet.sach?.tacGia}</p>
                    </div>
                  </td>
                  <td className="border border-black p-2">{chiTiet.sach?.maSach}</td>
                  <td className="border border-black p-2 text-center">
                    {chiTiet.soLuong}
                  </td>
                  <td className="border border-black p-2">
                    {new Date(chiTiet.hanTra).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="border border-black p-2">
                    {chiTiet.trangThai === "dang_muon" && "Đang mượn"}
                    {chiTiet.trangThai === "da_tra" && "Đã trả"}
                    {chiTiet.trangThai === "mat_sach" && "Mất sách"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tiền phạt (nếu có) */}
        {totalFine > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3 uppercase border-b border-gray-400 pb-1">
              IV. Tiền phạt
            </h3>
            <table className="w-full border-collapse border border-black">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black p-2 text-left">Tên sách</th>
                  <th className="border border-black p-2 text-center">Số ngày trễ</th>
                  <th className="border border-black p-2 text-right">Tiền phạt</th>
                </tr>
              </thead>
              <tbody>
                {phieuMuon.chi_tiet_phieu_muons
                  ?.filter((ct) => ct.tienPhat > 0)
                  .map((chiTiet) => (
                    <tr key={chiTiet.idCTPhieumuon}>
                      <td className="border border-black p-2">
                        {chiTiet.sach?.tenSach}
                      </td>
                      <td className="border border-black p-2 text-center">
                        {chiTiet.soNgayTre} ngày
                      </td>
                      <td className="border border-black p-2 text-right">
                        {parseFloat(chiTiet.tienPhat.toString()).toLocaleString("vi-VN")}đ
                      </td>
                    </tr>
                  ))}
                <tr className="font-bold bg-gray-100">
                  <td colSpan={2} className="border border-black p-2 text-right">
                    Tổng cộng:
                  </td>
                  <td className="border border-black p-2 text-right">
                    {totalFine.toLocaleString("vi-VN")}đ
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Ghi chú */}
        {phieuMuon.ghiChu && (
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2 uppercase">Ghi chú:</h3>
            <p className="italic">{phieuMuon.ghiChu}</p>
          </div>
        )}

        {/* Chữ ký */}
        <div className="mt-12 grid grid-cols-2 gap-8">
          <div className="text-center">
            <p className="font-semibold mb-16">Người mượn</p>
            <p className="italic">(Ký và ghi rõ họ tên)</p>
          </div>
          <div className="text-center">
            <p className="font-semibold mb-1">
              Ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm{" "}
              {new Date().getFullYear()}
            </p>
            <p className="font-semibold mb-16">Thủ thư</p>
            <p className="italic">(Ký và ghi rõ họ tên)</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-300 text-center text-sm text-gray-600">
          <p>
            Lưu ý: Vui lòng trả sách đúng hạn. Mỗi ngày trễ hạn sẽ bị phạt theo quy định của
            thư viện.
          </p>
        </div>
      </div>
    </div>
  );
});

BorrowReceiptPrintTemplate.displayName = "BorrowReceiptPrintTemplate";
