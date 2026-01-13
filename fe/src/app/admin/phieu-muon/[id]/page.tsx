"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  User,
  Package,
  AlertCircle,
  CheckCircle,
  DollarSign,
  FileText,
  Printer,
  RotateCcw,
  XCircle,
} from "lucide-react";
import phieuMuonService, { PhieuMuon } from "@/services/phieuMuon";
import Link from "next/link";
import ReturnBookDialog from "../components/ReturnBookDialog";
import { useReactToPrint } from "react-to-print";
import { BorrowReceiptPrintTemplate } from "../components/BorrowReceiptPrintTemplate";
import { toast } from "sonner";

export default function PhieuMuonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);

  const [phieuMuon, setPhieuMuon] = useState<PhieuMuon | null>(null);
  const [loading, setLoading] = useState(true);
  const [returnDialog, setReturnDialog] = useState<{
    show: boolean;
    phieuMuon: PhieuMuon | null;
  }>({ show: false, phieuMuon: null });

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Phieu-Muon-${phieuMuon?.idPhieumuon}`,
  });

  useEffect(() => {
    if (id) fetchPhieuMuon();
  }, [id]);

  const fetchPhieuMuon = async () => {
    try {
      setLoading(true);
      const res = await phieuMuonService.getOne(id);
      if (res.payload.success) setPhieuMuon(res.payload.data);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết phiếu mượn:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "dang_cho":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-500/20 text-amber-600 rounded-full text-sm font-semibold">
            <Clock className="w-4 h-4" /> Đang chờ duyệt
          </span>
        );
      case "dang_muon":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold">
            <Clock className="w-4 h-4" /> Đang mượn
          </span>
        );
      case "gia_han":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-full text-sm font-semibold">
            <RotateCcw className="w-4 h-4" /> Đã gia hạn
          </span>
        );
      case "da_tra":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
            <CheckCircle className="w-4 h-4" /> Đã trả
          </span>
        );
      case "qua_han":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-full text-sm font-semibold">
            <AlertCircle className="w-4 h-4" /> Quá hạn
          </span>
        );
      case "huy":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-500/20 text-gray-400 rounded-full text-sm font-semibold">
             <XCircle className="w-4 h-4" /> Đã hủy
          </span>
        );
      default: return null;
    }
  };

  if (loading) return <div className="p-20 text-center">Đang tải...</div>;
  if (!phieuMuon) return <div className="p-20 text-center">Không tìm thấy phiếu</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/admin/phieu-muon" className="hover:text-primary transition-colors flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Danh sách phiếu mượn
        </Link>
        <span>/</span>
        <span className="text-foreground">Phiếu #{phieuMuon.idPhieumuon}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            Phiếu mượn #{phieuMuon.idPhieumuon}
            {getStatusBadge(phieuMuon.trangThai)}
          </h1>
          <p className="text-muted-foreground mt-1">
            Tạo ngày: {phieuMuon.created_at && new Date(phieuMuon.created_at).toLocaleDateString("vi-VN")}
          </p>
        </div>
        <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
          <Printer className="w-4 h-4" /> In phiếu
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Thông tin người mượn */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Thông tin người mượn
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div><p className="text-sm text-muted-foreground">Họ tên</p><p className="font-semibold">{phieuMuon.nguoi_muon?.hoTen}</p></div>
              <div><p className="text-sm text-muted-foreground">Email</p><p className="font-semibold">{phieuMuon.nguoi_muon?.email}</p></div>
              {phieuMuon.nguoi_muon?.maSinhVien && (
                <div><p className="text-sm text-muted-foreground">Mã sinh viên</p><p className="font-semibold">{phieuMuon.nguoi_muon.maSinhVien}</p></div>
              )}
            </div>
          </div>

          {/* Danh sách sách */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary" /> Danh sách sách</h2>
            <div className="space-y-3">
              {phieuMuon.chi_tiet_phieu_muons?.map((chiTiet) => (
                <div key={chiTiet.idCTPhieumuon} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold">{chiTiet.sach?.tenSach}</p>
                      <p className="text-sm text-muted-foreground">Mã: {chiTiet.sach?.maSach}</p>
                    </div>
                    <div className="text-right"><p className="text-sm text-muted-foreground">Số lượng</p><p className="font-semibold">{chiTiet.soLuong}</p></div>
                  </div>
                  <div className="mt-3 pt-3 border-t grid md:grid-cols-2 gap-3 text-sm">
                    <div><p className="text-muted-foreground">Hạn trả</p><p className="font-medium">{new Date(chiTiet.hanTra).toLocaleDateString("vi-VN")}</p></div>
                    <div>
                      <p className="text-muted-foreground">Trạng thái</p>
                      <span className={chiTiet.trangThai === 'gia_han' ? 'text-purple-500 font-medium' : chiTiet.trangThai === 'dang_muon' ? 'text-blue-500 font-medium' : ''}>
                        {chiTiet.trangThai === 'gia_han' ? 'Đã gia hạn' : chiTiet.trangThai === 'dang_muon' ? 'Đang mượn' : 'Đã trả'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-6">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-primary" /> Hành động</h2>
            <div className="space-y-4">
              
              {/* TRƯỜNG HỢP 1: PHIẾU CHỜ DUYỆT */}
              {phieuMuon.trangThai === "dang_cho" && (
                <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={async () => {
                      if(confirm("Duyệt phiếu mượn này?")) {
                        await phieuMuonService.approve(phieuMuon.idPhieumuon);
                        toast.success("Đã duyệt phiếu");
                        fetchPhieuMuon();
                      }
                    }}
                    className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
                  >
                    Duyệt phiếu
                  </button>
                  <button 
                    onClick={async () => {
                      const lyDo = prompt("Lý do từ chối:");
                      if(lyDo !== null) {
                        await phieuMuonService.cancel(phieuMuon.idPhieumuon, lyDo);
                        toast.success("Đã từ chối phiếu");
                        fetchPhieuMuon();
                      }
                    }}
                    className="w-full py-3 border border-red-500 text-red-500 rounded-lg font-bold hover:bg-red-50"
                  >
                    Từ chối
                  </button>
                </div>
              )}

              {/* TRƯỜNG HỢP 2: ĐANG MƯỢN / GIA HẠN / QUÁ HẠN */}
              {(phieuMuon.trangThai === "dang_muon" || phieuMuon.trangThai === "gia_han" || phieuMuon.trangThai === "qua_han") && (
                <div className="space-y-3">
                  <button
                    onClick={() => setReturnDialog({ show: true, phieuMuon })}
                    className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-bold"
                  >
                    Trả sách
                  </button>
                  
                  {phieuMuon.trangThai === "dang_muon" && (
                    <button 
                      onClick={async () => {
                        const lyDo = prompt("Lý do hủy phiếu:");
                        if(lyDo) {
                          await phieuMuonService.cancel(phieuMuon.idPhieumuon, lyDo);
                          fetchPhieuMuon();
                        }
                      }}
                      className="w-full px-4 py-3 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 font-semibold"
                    >
                      Hủy phiếu
                    </button>
                  )}
                </div>
              )}

              {/* TRƯỜNG HỢP 3: ĐÃ TRẢ / ĐÃ HỦY */}
              {(phieuMuon.trangThai === "da_tra" || phieuMuon.trangThai === "huy") && (
                <div className="p-4 bg-muted rounded-lg text-center text-sm italic">
                   Phiếu này đã kết thúc xử lý.
                </div>
              )}

            </div>
          </div>
          
          {/* Thông tin ngày mượn/hạn trả */}
          <div className="border rounded-lg p-6 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ngày mượn</p>
                <p className="font-semibold flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(phieuMuon.ngayMuon).toLocaleDateString("vi-VN")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Hạn trả</p>
                <p className="font-semibold flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(phieuMuon.hanTra).toLocaleDateString("vi-VN")}</p>
              </div>
          </div>
        </div>
      </div>

      {returnDialog.show && returnDialog.phieuMuon && (
        <ReturnBookDialog
          phieuMuon={returnDialog.phieuMuon}
          onClose={() => {
            setReturnDialog({ show: false, phieuMuon: null });
            fetchPhieuMuon();
          }}
        />
      )}

      <div className="hidden">
        <BorrowReceiptPrintTemplate ref={printRef} phieuMuon={phieuMuon} />
      </div>
    </div>
  );
}