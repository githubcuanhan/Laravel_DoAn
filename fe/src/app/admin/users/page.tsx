"use client";
import {Mail, Phone, MapPin, Calendar, GraduationCap, IdCard, School, Activity, Eye } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect, useMemo } from "react";
import { Plus, Edit, Trash2, Users, Search, Shield, UserCog, Filter, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import userService from "@/services/user";
import type { PaginatedData } from "@/lib/types/api.types";
import { toast } from "sonner";
import { User } from "@/lib/types";

// Badge colors for roles - using primary theme
const roleColors = {
  admin: "bg-destructive/10 text-destructive border-destructive/30",
  thuthu: "bg-primary/10 text-primary border-primary/30",
  bandoc: "bg-muted text-muted-foreground border-border",
};

// Badge colors for status - using semantic colors
const statusColors = {
  hoat_dong: "bg-green-100 text-green-800 border-green-300 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800",
  tam_khoa: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-800",
  ngung: "bg-red-100 text-red-800 border-red-300 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800",
};

const roleLabels = {
  admin: "Quản trị viên",
  thuthu: "Thủ thư",
  bandoc: "Bạn đọc",
};

const statusLabels = {
  hoat_dong: "Hoạt động",
  tam_khoa: "Tạm khóa",
  ngung: "Ngừng",
};

export default function UsersPage() {
  const [userData, setUserData] = useState<PaginatedData<User> | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const perPage = 10;

  const fetchUsers = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await userService.getAll(page, perPage);
      if (res.payload.success) {
        setUserData(res.payload.data);
      } else {
        setError(res.payload.message || "Không lấy được dữ liệu");
      }
    } catch (err: any) {
      setError(err?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const filteredList = useMemo(() => {
    if (!userData) return [];
    return userData.data.filter((u) => {
      // Filter by role
      if (filterRole !== "all" && u.vaiTro !== filterRole) {
        return false;
      }

      // Filter by status
      if (filterStatus !== "all" && u.trangThai !== filterStatus) {
        return false;
      }

      // Filter by search term
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          u.hoTen.toLowerCase().includes(searchLower) ||
          u.email.toLowerCase().includes(searchLower) ||
          (u.maSinhVien?.toLowerCase() || "").includes(searchLower)
        );
      }

      return true;
    });
  }, [userData, search, filterRole, filterStatus]);

  const onDelete = async (id: number, hoTen: string) => {
    if (!confirm(`Bạn có chắc muốn xóa người dùng "${hoTen}"?`)) return;

    try {
      const res = await userService.delete(id);
      if (res.payload.success) {
          toast.success('Thành công', { description: "Đã xóa người dùng." });
        fetchUsers(page);
      }
    } catch (err: any) {
      toast.error("Lỗi",{ description: err?.message });
    }
  };

  const allUsers = userData?.data || [];
  const adminCount = allUsers.filter(u => u.vaiTro === 'admin').length;
  const thuthuCount = allUsers.filter(u => u.vaiTro === 'thuthu').length;
  const bandocCount = allUsers.filter(u => u.vaiTro === 'bandoc').length;
  const activeCount = allUsers.filter(u => u.trangThai === 'hoat_dong').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Người dùng</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý thông tin người dùng và phân quyền
          </p>
        </div>
        <Link href="/admin/users/add">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Thêm Người dùng
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên, email, mã SV..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10"
          />
        </div>

        {/* Role Filter */}
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả vai trò</SelectItem>
            <SelectItem value="admin">Quản trị viên</SelectItem>
            <SelectItem value="thuthu">Thủ thư</SelectItem>
            <SelectItem value="bandoc">Bạn đọc</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="hoat_dong">Hoạt động</SelectItem>
            <SelectItem value="tam_khoa">Tạm khóa</SelectItem>
            <SelectItem value="ngung">Ngừng</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng người dùng</p>
              <p className="text-2xl font-bold text-blue-500">{allUsers.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500/50" />
          </div>
        </div>

        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Quản trị viên</p>
              <p className="text-2xl font-bold text-purple-500">{adminCount}</p>
            </div>
            <Shield className="w-8 h-8 text-purple-500/50" />
          </div>
        </div>

        <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Thủ thư</p>
              <p className="text-2xl font-bold text-orange-500">{thuthuCount}</p>
            </div>
            <UserCog className="w-8 h-8 text-orange-500/50" />
          </div>
        </div>

        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Đang hoạt động</p>
              <p className="text-2xl font-bold text-green-500">{activeCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500/50" />
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-t-primary border-b-primary/30 border-l-transparent border-r-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Đang tải...</p>
          </div>
        </div>
      ) : error ? (
        <div className="p-10 text-center border rounded-lg">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                  Người dùng
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                  Email
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                  Vai trò
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                  Trạng thái
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                  SĐT
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                  Mã SV
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                  Lớp
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase text-right">
                  Hành động
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                    Không tìm thấy người dùng nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredList.map((user) => (
                  <TableRow key={user.id}>
                    {/* User with Avatar */}
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://ui-avatars.com/api/?background=random&name=${user.hoTen}`}
                          alt={user.hoTen}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="font-medium">{user.hoTen}</div>
                      </div>
                    </TableCell>

                    {/* Email */}
                    <TableCell className="px-4 py-3 text-muted-foreground">
                      {user.email}
                    </TableCell>

                    {/* Role */}
                    <TableCell className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${roleColors[user.vaiTro]}`}
                      >
                        {user.vaiTro === 'admin' && <Shield className="w-3 h-3" />}
                        {user.vaiTro === 'thuthu' && <UserCog className="w-3 h-3" />}
                        {user.vaiTro === 'bandoc' && <Users className="w-3 h-3" />}
                        {roleLabels[user.vaiTro]}
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${statusColors[user.trangThai]}`}
                      >
                        {user.trangThai === 'hoat_dong' && <CheckCircle className="w-3 h-3" />}
                        {user.trangThai === 'tam_khoa' && <AlertCircle className="w-3 h-3" />}
                        {user.trangThai === 'ngung' && <XCircle className="w-3 h-3" />}
                        {statusLabels[user.trangThai]}
                      </span>
                    </TableCell>

                    {/* Phone */}
                    <TableCell className="px-4 py-3 text-muted-foreground">
                      {user.soDienThoai || "-"}
                    </TableCell>

                    {/* Student ID */}
                    <TableCell className="px-4 py-3 text-muted-foreground">
                      {user.maSinhVien || "-"}
                    </TableCell>

                    {/* Class */}
                    <TableCell className="px-4 py-3 text-muted-foreground">
                      {user.lop?.tenLop || "-"}
                    </TableCell>
                    {/* Actions */}
                    <TableCell className="px-4 py-3 text-right">
                      
                      <div className="flex justify-end gap-2">
                                          {/* ... */}
                  {/* Div bao bọc để căn chỉnh các nút nằm ngang */}
                    {/* === NÚT 1: XEM LỊCH SỬ (CON MẮT XANH) === */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href={`/admin/users/${user.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="sr-only">Xem chi tiết</span>
                            </Button>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Xem chi tiết & lịch sử</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                        <Link href={`/admin/users/edit/${user.id}`}>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8 w-8 p-0"
                          onClick={() => onDelete(user.id, user.hoTen)} >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {userData && userData.last_page > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!userData.prev_page_url}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
          >
            Trước
          </Button>

          <span className="px-4 py-2">
            Trang {userData.current_page} / {userData.last_page}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={!userData.next_page_url}
            onClick={() => setPage((p) => p + 1)}
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  );
}
