"use client";

import { useEffect, useState } from "react";
import {
    BookOpen,
    Calendar,
    Clock,
    AlertCircle,
    CheckCircle,
    XCircle,
    Search,
    Eye,
    Package,
    RotateCcw,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import phieuMuonService, { PhieuMuon } from "@/services/phieuMuon";
import Link from "next/link";
import ReturnBookDialog from "./components/ReturnBookDialog";
import { toast } from "sonner";

export default function PhieuMuonManagementPage() {
    const [phieuMuons, setPhieuMuons] = useState<PhieuMuon[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");

    // Dialog trả sách
    const [returnDialog, setReturnDialog] = useState<{
        show: boolean;
        phieuMuon: PhieuMuon | null;
    }>({ show: false, phieuMuon: null });

    useEffect(() => {
        fetchPhieuMuons();
    }, [currentPage]);

    const fetchPhieuMuons = async () => {
        try {
            setLoading(true);
            const res = await phieuMuonService.getAll(currentPage, 10);

            if (res.payload.success) {
                const data = res.payload.data;
                setPhieuMuons(data.data || []);
                setTotalPages(data.last_page || 1);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách phiếu mượn:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "dang_cho":
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/20 text-amber-600 rounded-full text-xs font-semibold">
                        <Clock className="w-3 h-3" /> Đang chờ duyệt
                    </span>
                );
            case "dang_muon":
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">
                        <Clock className="w-3 h-3" /> Đang mượn
                    </span>
                );
            case "gia_han":
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-semibold">
                        <RotateCcw className="w-3 h-3" /> Đã gia hạn
                    </span>
                );
            case "da_tra":
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                        <CheckCircle className="w-3 h-3" /> Đã trả
                    </span>
                );
            case "qua_han":
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold">
                        <AlertCircle className="w-3 h-3" /> Quá hạn
                    </span>
                );
            case "huy":
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-semibold">
                        <XCircle className="w-3 h-3" /> Đã hủy
                    </span>
                );
            default:
                return null;
        }
    };

    const filteredPhieuMuons = phieuMuons.filter((pm) => {
        if (filterStatus !== "all" && pm.trangThai !== filterStatus) {
            return false;
        }
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            return (
                pm.nguoi_muon?.hoTen.toLowerCase().includes(search) ||
                pm.nguoi_muon?.email.toLowerCase().includes(search) ||
                pm.nguoi_muon?.maSinhVien?.toLowerCase().includes(search) ||
                pm.idPhieumuon.toString().includes(search)
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Quản lý Phiếu Mượn</h1>
                    <p className="text-muted-foreground mt-1">Quản lý phiếu mượn sách và trả sách</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên, email, mã SV, ID phiếu..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Lọc trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả</SelectItem>
                            <SelectItem value="dang_cho">Đang chờ duyệt</SelectItem>
                            <SelectItem value="dang_muon">Đang mượn</SelectItem>
                            <SelectItem value="gia_han">Đã gia hạn</SelectItem>
                            <SelectItem value="da_tra">Đã trả</SelectItem>
                            <SelectItem value="qua_han">Quá hạn</SelectItem>
                            <SelectItem value="huy">Đã hủy</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Đang mượn/Gia hạn</p>
                            <p className="text-2xl font-bold text-blue-500">
                                {phieuMuons.filter((p) => p.trangThai === "dang_muon" || p.trangThai === "gia_han").length}
                            </p>
                        </div>
                        <Clock className="w-8 h-8 text-blue-500/50" />
                    </div>
                </div>

                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Đã trả</p>
                            <p className="text-2xl font-bold text-green-500">
                                {phieuMuons.filter((p) => p.trangThai === "da_tra").length}
                            </p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-500/50" />
                    </div>
                </div>

                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Quá hạn</p>
                            <p className="text-2xl font-bold text-red-500">
                                {phieuMuons.filter((p) => p.trangThai === "qua_han").length}
                            </p>
                        </div>
                        <AlertCircle className="w-8 h-8 text-red-500/50" />
                    </div>
                </div>

                <div className="p-4 bg-gray-500/10 border border-gray-500/20 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Đã hủy</p>
                            <p className="text-2xl font-bold text-gray-500">
                                {phieuMuons.filter((p) => p.trangThai === "huy").length}
                            </p>
                        </div>
                        <XCircle className="w-8 h-8 text-gray-500/50" />
                    </div>
                </div>
            </div>

            <div className="border rounded-lg overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted hover:bg-muted">
                            <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">ID</TableHead>
                            <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Người mượn</TableHead>
                            <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Ngày mượn</TableHead>
                            <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Hạn trả</TableHead>
                            <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Số sách</TableHead>
                            <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Trạng thái</TableHead>
                            <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPhieuMuons.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                    Không tìm thấy phiếu mượn nào
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPhieuMuons.map((pm) => (
                                <TableRow key={pm.idPhieumuon}>
                                    <TableCell className="px-4 py-3 font-mono text-sm">#{pm.idPhieumuon}</TableCell>
                                    <TableCell className="px-4 py-3 text-sm">
                                        <div>
                                            <p className="font-medium">{pm.nguoi_muon?.hoTen}</p>
                                            <p className="text-xs text-muted-foreground">{pm.nguoi_muon?.email}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            {new Date(pm.ngayMuon).toLocaleDateString("vi-VN")}
                                        </div>
                                    </TableCell>
                                    {/* THÊM CỘT HẠN TRẢ TẠI ĐÂY */}
                                    <TableCell className="px-4 py-3 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-muted-foreground" />
                                            <span className={pm.trangThai === "qua_han" ? "text-red-500 font-medium" : ""}>
                                                {new Date(pm.hanTra).toLocaleDateString("vi-VN")}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Package className="w-4 h-4 text-muted-foreground" />
                                            <span className="font-medium">{pm.chi_tiet_phieu_muons?.length || 0} sách</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3">{getStatusBadge(pm.trangThai)}</TableCell>
                                    <TableCell className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* 1. Nút Trả sách (Ưu tiên đầu tiên) */}
                                            {(pm.trangThai === "dang_muon" || pm.trangThai === "qua_han" || pm.trangThai === "gia_han") && (
                                                <button
                                                    onClick={() => setReturnDialog({ show: true, phieuMuon: pm })}
                                                    className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 transition-colors font-medium"
                                                >
                                                    Trả sách
                                                </button>
                                            )}

                                            {/* 2. Cặp nút Duyệt/Từ chối */}
                                            {pm.trangThai === "dang_cho" && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={async () => {
                                                            if (confirm("Xác nhận duyệt phiếu mượn này?")) {
                                                                try {
                                                                    await phieuMuonService.approve(pm.idPhieumuon);
                                                                    toast.success("Thành công", { description: "Đã duyệt và xác nhận hóa đơn" });
                                                                    fetchPhieuMuons();
                                                                } catch (e) {
                                                                    toast.error("Lỗi duyệt yêu cầu");
                                                                }
                                                            }
                                                        }}
                                                        className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                                                    >
                                                        Duyệt
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            const lyDo = prompt("Nhập lý do từ chối:");
                                                            if (lyDo !== null) {
                                                                try {
                                                                    await phieuMuonService.cancel(pm.idPhieumuon, lyDo);
                                                                    toast.success("Đã từ chối phiếu mượn");
                                                                    fetchPhieuMuons();
                                                                } catch (e) {
                                                                    toast.error("Lỗi khi từ chối");
                                                                }
                                                            }
                                                        }}
                                                        className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                                                    >
                                                        Từ chối
                                                    </button>
                                                </div>
                                            )}

                                            {/* 3. Nút Xem chi tiết (Cuối cùng) */}
                                            <Link href={`/admin/phieu-muon/${pm.idPhieumuon}`}>
                                                <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-primary" title="Xem chi tiết">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            
            <div className="flex items-center justify-center gap-2 mt-4">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Trước
                </button>
                <span className="text-sm">Trang {currentPage} / {totalPages}</span>
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Sau
                </button>
            </div>

            {returnDialog.show && returnDialog.phieuMuon && (
                <ReturnBookDialog
                    phieuMuon={returnDialog.phieuMuon}
                    onClose={() => {
                        setReturnDialog({ show: false, phieuMuon: null });
                        fetchPhieuMuons();
                    }}
                />
            )}
        </div>
    );
}