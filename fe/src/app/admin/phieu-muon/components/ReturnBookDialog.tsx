"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  X,
  AlertCircle,
  CheckCircle,
  Calendar,
  DollarSign,
  Clock,
  Info,
  RotateCcw, // Thêm icon gia hạn
} from "lucide-react";
import phieuMuonService, { PhieuMuon, ChiTietPhieuMuon } from "@/services/phieuMuon";
import cauHinhMuonTraService from "@/services/cauHinhMuonTra";

interface ReturnBookDialogProps {
  phieuMuon: PhieuMuon;
  onClose: () => void;
}

export default function ReturnBookDialog({
  phieuMuon,
  onClose,
}: ReturnBookDialogProps) {
  const [selectedBooks, setSelectedBooks] = useState<Set<number>>(new Set());
  const [ngayTraThucTe, setNgayTraThucTe] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [mucPhat, setMucPhat] = useState<number>(5000);
  const [loadingConfig, setLoadingConfig] = useState(true);

  // Lấy danh sách sách có thể trả (Bao gồm cả đang mượn, quá hạn và GIA HẠN)
  const chiTietCoTheTra =
    phieuMuon.chi_tiet_phieu_muons?.filter(
      (ct) => ct.trangThai === "dang_muon" || ct.trangThai === "qua_han" || ct.trangThai === "gia_han"
    ) || [];

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoadingConfig(true);
        const res = await cauHinhMuonTraService.getCurrent();
        if (res.payload.success) {
          setMucPhat(res.payload.data.mucPhatMoiNgay || 5000);
        }
      } catch (err) {
        console.error("Lỗi khi lấy cấu hình:", err);
      } finally {
        setLoadingConfig(false);
      }
    };

    fetchConfig();
    const today = new Date().toISOString().split("T")[0];
    setNgayTraThucTe(today);
  }, []);

  const calculateFine = (hanTra: string) => {
    if (!ngayTraThucTe) return { soNgayTre: 0, tienPhat: 0 };
    const hanTraDate = new Date(hanTra);
    const ngayTraDate = new Date(ngayTraThucTe);
    const diffTime = ngayTraDate.getTime() - hanTraDate.getTime();
    const soNgayTre = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const tienPhat = soNgayTre * mucPhat;
    return { soNgayTre, tienPhat };
  };

  const handleToggleBook = (idSach: number) => {
    const newSelected = new Set(selectedBooks);
    if (newSelected.has(idSach)) {
      newSelected.delete(idSach);
    } else {
      newSelected.add(idSach);
    }
    setSelectedBooks(newSelected);
  };

  const handleSelectAll = () => {
    const allBookIds = chiTietCoTheTra.map((ct) => ct.idSach);
    if (selectedBooks.size === allBookIds.length) {
      setSelectedBooks(new Set());
    } else {
      setSelectedBooks(new Set(allBookIds));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBooks.size === 0) {
      setError("Vui lòng chọn ít nhất 1 sách để trả");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      for (const idSach of selectedBooks) {
        await phieuMuonService.returnBook(phieuMuon.idPhieumuon, idSach, {
          ngayTraThucTe: ngayTraThucTe,
          trangThai: "da_tra",
        });
      }
      setSuccess(true);
      setTimeout(() => onClose(), 2000);
    } catch (err: any) {
      setError(err?.payload?.message || "Có lỗi xảy ra khi trả sách.");
    } finally {
      setLoading(false);
    }
  };

  const totalFine = Array.from(selectedBooks).reduce((total, idSach) => {
    const chiTiet = chiTietCoTheTra.find((ct) => ct.idSach === idSach);
    if (!chiTiet) return total;
    const { tienPhat } = calculateFine(chiTiet.hanTra);
    return total + tienPhat;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl bg-background rounded-2xl shadow-2xl border max-h-[90vh] overflow-hidden flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary text-primary-foreground rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Trả sách</h2>
              <p className="text-muted-foreground text-sm">Phiếu mượn #{phieuMuon.idPhieumuon}</p>
            </div>
          </div>
        </div>

        {success && (
          <div className="m-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-600 dark:text-green-400 font-semibold">Trả sách thành công!</p>
              <p className="text-green-600 dark:text-green-400 text-sm mt-1">Đang đóng...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="m-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-600 dark:text-red-400 font-semibold">Lỗi</p>
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="p-4 bg-muted rounded-xl">
                <p className="text-sm text-muted-foreground mb-2">Người mượn</p>
                <p className="font-semibold">{phieuMuon.nguoi_muon?.hoTen}</p>
                <p className="text-sm text-muted-foreground">{phieuMuon.nguoi_muon?.email}</p>
                {phieuMuon.nguoi_muon?.maSinhVien && (
                  <p className="text-sm text-muted-foreground">SV: {phieuMuon.nguoi_muon.maSinhVien}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Ngày trả thực tế</span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={ngayTraThucTe}
                  onChange={(e) => setNgayTraThucTe(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={loading || loadingConfig}
                  required
                />
                <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-blue-600 dark:text-blue-400 text-xs">
                    Mức phạt: <strong>{mucPhat.toLocaleString("vi-VN")}đ</strong> mỗi ngày trễ
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-semibold flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span>Chọn sách cần trả</span>
                    <span className="text-red-500">*</span>
                  </label>
                  {chiTietCoTheTra.length > 0 && (
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-sm text-primary hover:underline"
                    >
                      {selectedBooks.size === chiTietCoTheTra.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                    </button>
                  )}
                </div>

                {chiTietCoTheTra.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Tất cả sách đã được trả</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {chiTietCoTheTra.map((chiTiet) => {
                      const { soNgayTre, tienPhat } = calculateFine(chiTiet.hanTra);
                      const isSelected = selectedBooks.has(chiTiet.idSach);
                      const isOverdue = soNgayTre > 0;

                      return (
                        <div
                          key={chiTiet.idCTPhieumuon}
                          onClick={() => handleToggleBook(chiTiet.idSach)}
                          className={`p-4 border rounded-xl cursor-pointer transition-all ${
                            isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="mt-1 w-4 h-4 text-primary"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <p className="font-semibold">{chiTiet.sach?.tenSach}</p>
                                {chiTiet.trangThai === "gia_han" && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-500/10 text-purple-500 rounded text-[10px] font-bold">
                                    <RotateCcw className="w-2.5 h-2.5" /> ĐÃ GIA HẠN
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{chiTiet.sach?.tacGia}</p>

                              <div className="flex items-center gap-4 mt-2 text-sm">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-muted-foreground">Hạn trả:</span>
                                  <span className={isOverdue ? "text-red-500 font-semibold" : "font-medium"}>
                                    {new Date(chiTiet.hanTra).toLocaleDateString("vi-VN")}
                                  </span>
                                </div>

                                {isOverdue && (
                                  <>
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-red-500" />
                                      <span className="text-red-500 font-semibold">Trễ {soNgayTre} ngày</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <DollarSign className="w-3 h-3 text-red-500" />
                                      <span className="text-red-500 font-semibold">{tienPhat.toLocaleString("vi-VN")}đ</span>
                                    </div>
                                  </>
                                )}

                                {!isOverdue && (
                                  <div className="flex items-center gap-1 text-green-500">
                                    <CheckCircle className="w-3 h-3" />
                                    <span className="font-medium">Đúng hạn</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {totalFine > 0 && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-red-600 dark:text-red-400">Tổng tiền phạt:</span>
                    <span className="text-2xl font-bold text-red-600 dark:text-red-400">{totalFine.toLocaleString("vi-VN")}đ</span>
                  </div>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                    ⚠️ Người mượn cần thanh toán tiền phạt trước khi nhận lại thẻ
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-muted/50">
              <div className="flex gap-3">
                <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border rounded-lg font-semibold hover:bg-muted transition-all" disabled={loading}>
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading || selectedBooks.size === 0 || loadingConfig || !ngayTraThucTe}
                  className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading || loadingConfig ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {loadingConfig ? "Đang tải..." : "Đang xử lý..."}
                    </span>
                  ) : (
                    `Xác nhận trả (${selectedBooks.size} sách)`
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}