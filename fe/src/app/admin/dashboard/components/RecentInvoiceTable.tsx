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
import { DollarSign, CheckCircle, XCircle } from "lucide-react";

export default function RecentInvoiceTable({
  rows,
  title,
}: {
  rows: any[];
  title: string;
}) {
  const formatInvoiceType = (type: string) => {
    switch (type) {
      case "phat_tre_hen":
        return "Phạt trễ hạn";
      case "mat_sach":
        return "Mất sách";
      case "thu_khac":
        return "Thu khác";
      default:
        return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "da_thanh_toan":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-600 rounded-full text-xs font-semibold">
            <CheckCircle className="w-3 h-3" />
            Đã thanh toán
          </span>
        );
      case "chua_thanh_toan":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-600 rounded-full text-xs font-semibold">
            <XCircle className="w-3 h-3" />
            Chưa thanh toán
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <span className="text-sm text-muted-foreground">
            {rows.length} hóa đơn
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                  ID
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                  Người thu
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                  Người bị thu
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                  Loại hóa đơn
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                  Tổng tiền
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                  Ngày lập
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
                    colSpan={7}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    Chưa có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((r: any) => (
                  <TableRow key={r.idHoadon}>
                    <TableCell className="px-4 py-3 font-mono text-sm">
                      #{r.idHoadon}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {r?.nguoi_thu?.hoTen || "N/A"}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {r?.nguoi_bi_thu?.hoTen || "N/A"}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span className="text-sm">
                        {formatInvoiceType(r.loaiHoadon)}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-1 font-semibold">
                        <DollarSign className="w-3 h-3 text-muted-foreground" />
                        {Number(r.tongTien).toLocaleString("vi-VN")}đ
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(r.ngayLap).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      {getStatusBadge(r.trangThai)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
