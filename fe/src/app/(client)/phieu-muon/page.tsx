"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, BookOpen, Clock, CheckCircle, Calendar, Eye, RotateCcw } from "lucide-react";
import phieuMuonService, { PhieuMuon } from "@/services/phieuMuon";
import { toast } from "sonner"; 

export default function PhieuMuonPage() {
  const [data, setData] = useState<any[]>([]); 
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detail, setDetail] = useState<any | null>(null);

  const [extendOpen, setExtendOpen] = useState(false);
  const [extendData, setExtendData] = useState({ id: 0, soNgay: 7, lyDo: "" });
  const [extending, setExtending] = useState(false);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / perPage)), [total, perPage]);

  const fetchBorrows = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await phieuMuonService.getMyBorrows(page, perPage);
      const payload = res.payload.data;
      setData(payload?.data ?? []);
      setTotal(payload?.total ?? (payload?.data?.length ?? 0));
    } catch (e: any) {
      setError(e?.payload?.message || "Không thể tải dữ liệu.");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [page, perPage]);

  useEffect(() => {
    fetchBorrows();
  }, [fetchBorrows]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "dang_cho":
        return <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300"><Clock className="h-3 w-3" /> Đang chờ duyệt</span>;
      case "dang_muon":
        return <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300"><Clock className="h-3 w-3" /> Đang mượn</span>;
      case "da_tra":
        return <span className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-300"><CheckCircle className="h-3 w-3" /> Đã trả</span>;
      case "qua_han":
        return <span className="inline-flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-900/30 px-2 py-0.5 text-xs font-medium text-red-700 dark:text-red-300"><AlertCircle className="h-3 w-3" /> Quá hạn</span>;
      case "gia_han":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 text-xs font-medium text-purple-700 dark:text-purple-300">
            <RotateCcw className="h-3 w-3" /> Đã gia hạn
          </span>
        );
      default:
        return null;
    }
  };

  const openDetail = async (id: number) => {
    try {
      setDetailOpen(true);
      setDetailLoading(true);
      setDetail(null);
      const res = await phieuMuonService.getOne(id);
      if (res.payload.success) setDetail(res.payload.data);
    } finally {
      setDetailLoading(false);
    }
  };

  const openExtendDialog = (id: number) => {
    setExtendData({ id, soNgay: 7, lyDo: "" });
    setExtendOpen(true);
  };

  const handleConfirmExtend = async () => {
    if (extendData.soNgay <= 0) {
      toast.error("Số ngày không hợp lệ");
      return;
    }
    try {
      setExtending(true);
      // @ts-ignore
      await phieuMuonService.extend(extendData.id, {
        soNgay: extendData.soNgay,
        lyDo: extendData.lyDo
      });
      
      toast.success("Thành công", { description: `Phiếu mượn đã được chuyển sang trạng thái Gia hạn` });
      setExtendOpen(false);
      fetchBorrows(); 
    } catch (e: any) {
      const errorMsg = e?.payload?.message || "Gia hạn thất bại";
      toast.error("Thông báo", { description: errorMsg });
    } finally {
      setExtending(false);
    }
  };

  const formatDate = (d?: string) => {
    if (!d) return "";
    const date = new Date(d);
    return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Lịch sử mượn sách</h1>
          <p className="text-sm text-muted-foreground">Xem các phiếu mượn của bạn</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Danh sách phiếu mượn
          </CardTitle>
          <CardDescription>Tổng số: {total}</CardDescription>
          <CardAction>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={loading || page <= 1}>Trang trước</Button>
              <span className="text-sm text-muted-foreground">{page}/{totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={loading || page >= totalPages}>Trang sau</Button>
            </div>
          </CardAction>
        </CardHeader>
        <CardContent>
          {loading && data.length === 0 ? (
            <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => (<div key={i} className="h-12 rounded-md bg-muted animate-pulse" />))}</div>
          ) : error ? (
            <div className="p-4 border border-destructive/50 rounded-md text-sm text-destructive bg-destructive/10">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">#</TableHead>
                    <TableHead>Ngày mượn</TableHead>
                    <TableHead>Hạn trả</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ghi chú</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((pm) => (
                    <TableRow key={pm.idPhieumuon}>
                      <TableCell className="font-medium">{pm.idPhieumuon}</TableCell>
                      <TableCell>{formatDate(pm.ngayMuon)}</TableCell>
                      <TableCell>{formatDate(pm.hanTra)}</TableCell>
                      <TableCell>{getStatusBadge(pm.trangThai)}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-muted-foreground">{pm.ghiChu ?? ""}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          {(pm.trangThai === "dang_muon" || pm.trangThai === "qua_han") && (
                            <Button 
                              size="sm" 
                              variant="secondary"
                              className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white border-none flex items-center"
                              onClick={() => openExtendDialog(pm.idPhieumuon)}
                            >
                              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Gia hạn
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8" 
                            onClick={() => openDetail(pm.idPhieumuon)}
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" /> Xem
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pop-up Gia hạn */}
      <Dialog open={extendOpen} onOpenChange={setExtendOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Gia hạn phiếu mượn #{extendData.id}</DialogTitle>
            <DialogDescription>Nhập thông tin lý do để gia hạn thêm thời gian mượn sách.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="soNgay">Số ngày gia hạn</Label>
              <Input id="soNgay" type="number" value={extendData.soNgay} onChange={(e) => setExtendData({ ...extendData, soNgay: parseInt(e.target.value) })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lyDo">Lý do gia hạn</Label>
              <Textarea id="lyDo" placeholder="Lý do cá nhân, chưa đọc xong..." value={extendData.lyDo} onChange={(e) => setExtendData({ ...extendData, lyDo: e.target.value })} className="min-h-[100px]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setExtendOpen(false)}>Hủy</Button>
            <Button onClick={handleConfirmExtend} disabled={extending} className="bg-indigo-600 hover:bg-indigo-700 text-white">{extending ? "Đang xử lý..." : "Xác nhận gia hạn"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Chi tiết phiếu mượn {detail ? `#${detail.idPhieumuon}` : ""}</DialogTitle>
            {detail && <DialogDescription>Trạng thái: {getStatusBadge(detail.trangThai)}</DialogDescription>}
          </DialogHeader>
          {detailLoading ? (
            <div className="space-y-2 pt-4">{Array.from({ length: 5 }).map((_, i) => (<div key={i} className="h-10 rounded-md bg-muted animate-pulse" />))}</div>
          ) : detail && (
            <div className="space-y-4 pt-4">
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" /><span>Ngày mượn: <strong>{formatDate(detail.ngayMuon)}</strong></span></div>
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" /><span>Hạn trả: <strong>{formatDate(detail.hanTra)}</strong></span></div>
              </div>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow><TableHead>Sách</TableHead><TableHead className="text-center">Trạng thái</TableHead><TableHead className="text-right">Hạn trả</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {detail.chi_tiet_phieu_muons?.map((ct: any) => (
                      <TableRow key={ct.idCTPhieumuon}>
                        <TableCell className="font-medium">{ct.sach?.tenSach}</TableCell>
                        <TableCell className="text-sm text-center">
                          {ct.trangThai === "dang_muon" && <span className="text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-400/10 px-2 py-0.5 rounded-full">Đang mượn</span>}
                          {ct.trangThai === "da_tra" && <span className="text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-400/10 px-2 py-0.5 rounded-full">Đã trả</span>}
                          {ct.trangThai === "gia_han" && <span className="text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-400/10 px-2 py-0.5 rounded-full">Đã gia hạn</span>}
                        </TableCell>
                        <TableCell className="text-sm text-right text-muted-foreground">{formatDate(ct.hanTra)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}