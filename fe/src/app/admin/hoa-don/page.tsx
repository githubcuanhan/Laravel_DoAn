'use client';

import { useEffect, useState } from 'react';
import {
  Receipt,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
  Eye,
  User,
  FileText,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import hoaDonService, { HoaDon } from '@/services/hoaDon';
import Link from 'next/link';
import { toast } from "sonner";

export default function HoaDonManagementPage() {
  const [hoaDons, setHoaDons] = useState<HoaDon[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    fetchHoaDons();
  }, [currentPage]);

  const fetchHoaDons = async () => {
    try {
      setLoading(true);
      const res = await hoaDonService.getAll(currentPage, 10);

      if (res.payload.success) {
        const data = res.payload.data;
        setHoaDons(data.data || []);
        setTotalPages(data.last_page || 1);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách hóa đơn:', error);
      toast.error('Không thể tải danh sách hóa đơn');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'da_thanh_toan':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
            <CheckCircle className="w-3 h-3" />
            Đã thanh toán
          </span>
        );
      case 'chua_thanh_toan':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold">
            <AlertCircle className="w-3 h-3" />
            Chưa thanh toán
          </span>
        );
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'phat_tre_hen':
        return 'Phạt trễ hạn';
      case 'mat_sach':
        return 'Mất sách';
      case 'khac':
        return 'Khác';
      default:
        return type;
    }
  };

  const handleUpdateStatus = async (
    id: number,
    newStatus: 'chua_thanh_toan' | 'da_thanh_toan'
  ) => {
    try {
      const res = await hoaDonService.updateStatus(id, newStatus);
      if (res.payload.success) {
        toast.success('Cập nhật trạng thái thành công');
        fetchHoaDons();
      }
    } catch (error: any) {
      toast.error(error?.payload?.message || 'Không thể cập nhật trạng thái');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa hóa đơn này?')) {
      return;
    }

    try {
      const res = await hoaDonService.delete(id);
      if (res.payload.success) {
        toast.success('Xóa hóa đơn thành công');
        fetchHoaDons();
      }
    } catch (error: any) {
      toast.error(error?.payload?.message || 'Không thể xóa hóa đơn');
    }
  };

  const filteredHoaDons = hoaDons.filter((hd) => {
    // Filter by status
    if (filterStatus !== 'all' && hd.trangThai !== filterStatus) {
      return false;
    }

    // Filter by type
    if (filterType !== 'all' && hd.loaiHoadon !== filterType) {
      return false;
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        hd.idHoadon.toString().includes(search) ||
        hd.nguoi_bi_thu?.hoTen.toLowerCase().includes(search) ||
        hd.nguoi_bi_thu?.email.toLowerCase().includes(search) ||
        hd.nguoi_bi_thu?.maSinhVien?.toLowerCase().includes(search) ||
        hd.nguoi_thu?.hoTen.toLowerCase().includes(search)
      );
    }

    return true;
  });

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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Hóa đơn</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý hóa đơn phạt và thanh toán
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo ID, tên, email, mã SV..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Lọc trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="chua_thanh_toan">Chưa thanh toán</SelectItem>
              <SelectItem value="da_thanh_toan">Đã thanh toán</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Lọc loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              <SelectItem value="phat_tre_hen">Phạt trễ hạn</SelectItem>
              <SelectItem value="mat_sach">Mất sách</SelectItem>
              <SelectItem value="khac">Khác</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng hóa đơn</p>
              <p className="text-2xl font-bold text-blue-500">
                {hoaDons.length}
              </p>
            </div>
            <Receipt className="w-8 h-8 text-blue-500/50" />
          </div>
        </div>

        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Chưa thanh toán</p>
              <p className="text-2xl font-bold text-red-500">
                {
                  hoaDons.filter((h) => h.trangThai === 'chua_thanh_toan')
                    .length
                }
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500/50" />
          </div>
        </div>

        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Đã thanh toán</p>
              <p className="text-2xl font-bold text-green-500">
                {hoaDons.filter((h) => h.trangThai === 'da_thanh_toan').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500/50" />
          </div>
        </div>

        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng tiền</p>
              <p className="text-2xl font-bold text-purple-500">
                {hoaDons
                  .reduce(
                    (sum, h) => sum + parseFloat(h.tongTien.toString()),
                    0
                  )
                  .toLocaleString('vi-VN')}
                đ
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-500/50" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                ID
              </TableHead>
              <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                Người bị thu
              </TableHead>
              <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                Người thu
              </TableHead>
              <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                Loại
              </TableHead>
              <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                Tổng tiền
              </TableHead>
              <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                Ngày lập
              </TableHead>
              <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                Trạng thái
              </TableHead>
              <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase text-right">
                Hành động
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHoaDons.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Không tìm thấy hóa đơn nào
                </TableCell>
              </TableRow>
            ) : (
              filteredHoaDons.map((hd) => (
                <TableRow key={hd.idHoadon}>
                  <TableCell className="px-4 py-3">
                    <span className="font-mono text-sm">#{hd.idHoadon}</span>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="font-medium">{hd.nguoi_bi_thu?.hoTen}</p>
                        <p className="text-xs text-muted-foreground">
                          {hd.nguoi_bi_thu?.email}
                        </p>
                        {hd.nguoi_bi_thu?.maSinhVien && (
                          <p className="text-xs text-muted-foreground">
                            SV: {hd.nguoi_bi_thu.maSinhVien}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <p className="text-sm">{hd.nguoi_thu?.hoTen || 'N/A'}</p>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <span className="text-sm">
                      {getTypeLabel(hd.loaiHoadon)}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold">
                        {parseFloat(hd.tongTien.toString()).toLocaleString(
                          'vi-VN'
                        )}
                        đ
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      {new Date(hd.ngayLap).toLocaleDateString('vi-VN')}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {getStatusBadge(hd.trangThai)}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link href={`/admin/hoa-don/${hd.idHoadon}`}>
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>
                      {hd.trangThai === 'chua_thanh_toan' && (
                        <button
                          onClick={() =>
                            handleUpdateStatus(hd.idHoadon, 'da_thanh_toan')
                          }
                          className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Đánh dấu đã thanh toán
                        </button>
                      )}
                      {hd.trangThai === 'chua_thanh_toan' && (
                        <button
                          onClick={() => handleDelete(hd.idHoadon)}
                          className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trước
          </button>
          <span className="px-4 py-2">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}
