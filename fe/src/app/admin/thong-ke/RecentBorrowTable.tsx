"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookOpen, User, CheckCircle, AlertCircle, XCircle } from "lucide-react";

export default function RecentBorrowTable({
  rows,
  title,
}: {
  rows: any[];
  title: string;
}) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "da_tra":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-600 rounded-full text-xs font-semibold">
            <CheckCircle className="w-3 h-3" />
            Đã trả
          </span>
        );
      case "dang_muon":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-600 rounded-full text-xs font-semibold">
            <BookOpen className="w-3 h-3" />
            Đang mượn
          </span>
        );
      case "mat_sach":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-600 rounded-full text-xs font-semibold">
            <XCircle className="w-3 h-3" />
            Mất sách
          </span>
        );
      case "qua_han": // Thêm case quá hạn
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-600 rounded-full text-xs font-semibold">
             <AlertCircle className="w-3 h-3" />
             Quá hạn
          </span>
        );
      default:
        return <span className="text-xs">{status}</span>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <span className="text-sm text-muted-foreground">
            {rows.length} bản ghi
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                  Sách
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                  Người mượn
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                  Ngày mượn
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                  Hạn trả
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase text-right">
                  Trạng thái
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    Chưa có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                // 🔥 SỬA QUAN TRỌNG: Thêm index và tạo key kết hợp để tránh trùng lặp
                rows.map((r: any, index: number) => {
                  const isOverdue =
                    (r.trangThai === "dang_muon" || r.phieu_muon?.trangThai === "dang_muon") &&
                    new Date(r.hanTra) < new Date();
                  
                  // Tạo key duy nhất: dùng id chi tiết nếu có, hoặc kết hợp id phiếu + index
                  const uniqueKey = r.idCTPhieumuon || `row-${r.phieu_muon?.id || 'idx'}-${index}`;

                  return (
                    <TableRow key={uniqueKey}>
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">
                              {r?.sach?.tenSach || "Không rõ"}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {r?.sach?.tacGia || "N/A"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">
                              {r?.phieu_muon?.nguoi_muon?.hoTen || "Không rõ"}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {r?.phieu_muon?.nguoi_muon?.maSinhVien || r?.phieu_muon?.nguoi_muon?.email || "N/A"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span className="text-sm">{formatDate(r.ngayMuon)}</span>
                        {r.soNgayTre > 0 && (
                          <p className="text-xs text-orange-600">
                            Trễ {r.soNgayTre} ngày
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span
                          className={`text-sm ${
                            isOverdue ? "text-orange-600 font-medium" : ""
                          }`}
                        >
                          {formatDate(r.hanTra)}
                        </span>
                        {/* Hiển thị tiền phạt nếu có */}
                        {r.tienPhat && parseFloat(r.tienPhat) > 0 && (
                          <p className="text-xs text-red-600 font-semibold mt-1">
                            Phạt: {parseFloat(r.tienPhat).toLocaleString("vi-VN")}đ
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right">
                        {getStatusBadge(r.trangThai || r.phieu_muon?.trangThai)}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer thống kê nhanh */}
        {rows.length > 0 && (
          <div className="mt-4 pt-4 border-t flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-muted-foreground">
                {rows.filter((r: any) => r.trangThai === "da_tra" || r.phieu_muon?.trangThai === "da_tra").length} Đã trả
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="text-muted-foreground">
                {rows.filter((r: any) => r.trangThai === "dang_muon" || r.phieu_muon?.trangThai === "dang_muon").length}{" "}
                Đang mượn
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}