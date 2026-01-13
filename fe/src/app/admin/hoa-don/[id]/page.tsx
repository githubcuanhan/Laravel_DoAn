"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Receipt,
  Calendar,
  User,
  DollarSign,
  FileText,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Clock,
  Printer,
} from "lucide-react";
import hoaDonService, { HoaDon } from "@/services/hoaDon";
import Link from "next/link";
import { toast } from "sonner";
import { useReactToPrint } from "react-to-print";
import { InvoicePrintTemplate } from "../components/InvoicePrintTemplate";

export default function HoaDonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);

  const [hoaDon, setHoaDon] = useState<HoaDon | null>(null);
  const [loading, setLoading] = useState(true);

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Invoice-${hoaDon?.idHoadon}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
  });

  useEffect(() => {
    if (id) {
      fetchHoaDon();
    }
  }, [id]);

  const fetchHoaDon = async () => {
    try {
      setLoading(true);
      const res = await hoaDonService.getOne(id);

      if (res.payload.success) {
        setHoaDon(res.payload.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết hóa đơn:", error);
      toast.error("Không thể tải chi tiết hóa đơn");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    newStatus: "chua_thanh_toan" | "da_thanh_toan"
  ) => {
    if (!hoaDon) return;

    try {
      const res = await hoaDonService.updateStatus(hoaDon.idHoadon, newStatus);
      if (res.payload.success) {
        toast.success("Cập nhật trạng thái thành công");
        fetchHoaDon();
      }
    } catch (error: any) {
      toast.error(error?.payload?.message || "Không thể cập nhật trạng thái");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "da_thanh_toan":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
            <CheckCircle className="w-4 h-4" />
            Đã thanh toán
          </span>
        );
      case "chua_thanh_toan":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-full text-sm font-semibold">
            <AlertCircle className="w-4 h-4" />
            Chưa thanh toán
          </span>
        );
      default:
        return null;
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-t-primary border-b-primary/30 border-l-transparent border-r-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!hoaDon) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <AlertCircle className="w-16 h-16 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Không tìm thấy hóa đơn</h2>
        <Link href="/admin/hoa-don">
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
            Quay lại danh sách
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/admin/hoa-don"
          className="hover:text-primary transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Danh sách hóa đơn
        </Link>
        <span>/</span>
        <span className="text-foreground">Hóa đơn #{hoaDon.idHoadon}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            Hóa đơn #{hoaDon.idHoadon}
            {getStatusBadge(hoaDon.trangThai)}
          </h1>
          <p className="text-muted-foreground mt-1">
            Loại: {getTypeLabel(hoaDon.loaiHoadon)}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Printer className="w-4 h-4" />
            In hóa đơn
          </button>
          {hoaDon.trangThai === "chua_thanh_toan" && (
            <button
              onClick={() => handleUpdateStatus("da_thanh_toan")}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Đánh dấu đã thanh toán
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Thông tin */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thông tin người bị thu */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Thông tin người bị thu
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Họ tên</p>
                <p className="font-semibold">{hoaDon.nguoi_bi_thu?.hoTen}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="font-semibold">{hoaDon.nguoi_bi_thu?.email}</p>
              </div>
              {hoaDon.nguoi_bi_thu?.maSinhVien && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Mã sinh viên
                  </p>
                  <p className="font-semibold">
                    {hoaDon.nguoi_bi_thu.maSinhVien}
                  </p>
                </div>
              )}
              {hoaDon.nguoi_bi_thu?.soDienThoai && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Số điện thoại
                  </p>
                  <p className="font-semibold">
                    {hoaDon.nguoi_bi_thu.soDienThoai}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Chi tiết hóa đơn */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Chi tiết hóa đơn
            </h2>
            <div className="space-y-3">
              {hoaDon.chi_tiet_hoa_dons?.map((chiTiet) => (
                <div
                  key={`${chiTiet.idHoadon}-${chiTiet.idCTPhieumuon}`}
                  className="p-4 border rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link
                        href={`/admin/books/${chiTiet.chi_tiet_phieu_muon?.sach?.idSach}`}
                      >
                        <p className="font-semibold hover:text-primary transition-colors">
                          {chiTiet.chi_tiet_phieu_muon?.sach?.tenSach}
                        </p>
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {chiTiet.chi_tiet_phieu_muon?.sach?.tacGia}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Mã: {chiTiet.chi_tiet_phieu_muon?.sach?.maSach}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Tiền phạt</p>
                      <p className="font-semibold text-red-500">
                        {parseFloat(
                          chiTiet.soTienPhat.toString()
                        ).toLocaleString("vi-VN")}
                        đ
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Số ngày trễ</p>
                      <p className="font-medium text-red-500">
                        {chiTiet.soNgayTre} ngày
                      </p>
                    </div>
                    {chiTiet.chi_tiet_phieu_muon?.phieu_muon && (
                      <div>
                        <p className="text-muted-foreground">Phiếu mượn</p>
                        <Link
                          href={`/admin/phieu-muon/${chiTiet.chi_tiet_phieu_muon.phieu_muon.idPhieumuon}`}
                          className="font-medium text-primary hover:underline"
                        >
                          #{chiTiet.chi_tiet_phieu_muon.phieu_muon.idPhieumuon}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Stats */}
        <div className="space-y-6">
          {/* Thông tin hóa đơn */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              Thông tin hóa đơn
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ngày lập</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <p className="font-semibold">
                    {new Date(hoaDon.ngayLap).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Người thu</p>
                <p className="font-semibold">{hoaDon.nguoi_thu?.hoTen}</p>
                <p className="text-xs text-muted-foreground">
                  {hoaDon.nguoi_thu?.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Loại hóa đơn</p>
                <p className="font-semibold">
                  {getTypeLabel(hoaDon.loaiHoadon)}
                </p>
              </div>

              {hoaDon.ghiChu && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Ghi chú</p>
                  <p className="text-sm italic">{hoaDon.ghiChu}</p>
                </div>
              )}
            </div>
          </div>

          {/* Tổng tiền */}
          <div className="border border-primary/30 rounded-lg p-6 bg-primary/10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
              <DollarSign className="w-5 h-5" />
              Tổng tiền
            </h2>
            <p className="text-3xl font-bold text-primary">
              {parseFloat(hoaDon.tongTien.toString()).toLocaleString("vi-VN")}đ
            </p>
          </div>
        </div>
      </div>

      {/* Hidden Print Template */}
      <div className="hidden">
        <InvoicePrintTemplate ref={printRef} hoaDon={hoaDon} />
      </div>
    </div>
  );
}

