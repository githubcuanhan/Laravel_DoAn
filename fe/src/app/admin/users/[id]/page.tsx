"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Clock, CheckCircle, AlertCircle, Phone, 
  GraduationCap, Shield, User, MapPin, Calendar, IdCard,
  Receipt, BookOpen, ChevronLeft, ChevronRight, Hash,
  Eye, Package, RotateCcw, XCircle, DollarSign
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

import phieuMuonService from "@/services/phieuMuon";
import userService from "@/services/user";
import hoaDonService from "@/services/hoaDon";

export default function UserHistoryPage() {
    const params = useParams();
    const userId = Number(params.id);

    const [userInfo, setUserInfo] = useState<any>(null);
    const [historyData, setHistoryData] = useState<any[]>([]);
    const [hoaDonData, setHoaDonData] = useState<any[]>([]); 
    const [isLoading, setIsLoading] = useState(true);
    
    const [currentPmPage, setCurrentPmPage] = useState(1);
    const [currentHdPage, setCurrentHdPage] = useState(1);
    const itemsPerPage = 5;

    const totalPmPages = Math.ceil(historyData.length / itemsPerPage);
    const currentPhieuMuon = useMemo(() => {
        const start = (currentPmPage - 1) * itemsPerPage;
        return historyData.slice(start, start + itemsPerPage);
    }, [historyData, currentPmPage]);

    const totalHdPages = Math.ceil(hoaDonData.length / itemsPerPage);
    const currentHoaDon = useMemo(() => {
        const start = (currentHdPage - 1) * itemsPerPage;
        return hoaDonData.slice(start, start + itemsPerPage);
    }, [hoaDonData, currentHdPage]);

    const formatDate = (date: string | null) => {
        if (!date) return "---";
        try {
            return format(parseISO(date), "dd/MM/yyyy", { locale: vi });
        } catch {
            return "---";
        }
    };

    // Badge trạng thái phiếu mượn (Giữ nguyên)
    const getStatusBadgePm = (status: string) => {
        switch (status) {
            case "dang_cho": return <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/20 text-amber-600 rounded-full text-xs font-semibold"><Clock className="w-3 h-3" /> Đang chờ duyệt</span>;
            case "dang_muon": return <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold"><Clock className="w-3 h-3" /> Đang mượn</span>;
            case "gia_han": return <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-semibold"><RotateCcw className="w-3 h-3" /> Đã gia hạn</span>;
            case "da_tra": return <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold"><CheckCircle className="w-3 h-3" /> Đã trả</span>;
            case "qua_han": return <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold"><AlertCircle className="w-3 h-3" /> Quá hạn</span>;
            case "huy": return <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-semibold"><XCircle className="w-3 h-3" /> Đã hủy</span>;
            default: return null;
        }
    };

    // Badge trạng thái hóa đơn (Lấy từ file bạn gửi)
    const getStatusBadgeHd = (status: string) => {
        switch (status) {
          case 'da_thanh_toan':
            return <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold"><CheckCircle className="w-3 h-3" /> Đã thanh toán</span>;
          case 'chua_thanh_toan':
            return <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold"><AlertCircle className="w-3 h-3" /> Chưa thanh toán</span>;
          default: return null;
        }
    };

    const getTypeLabelHd = (type: string) => {
        switch (type) {
          case 'phat_tre_hen': return 'Phạt trễ hạn';
          case 'mat_sach': return 'Mất sách';
          default: return 'Khác';
        }
    };

    const fetchData = useCallback(async () => {
        if (isNaN(userId)) return;
        setIsLoading(true);
        try {
            const [userRes, historyRes, hoaDonRes] = await Promise.all([
                userService.getById(userId),
                phieuMuonService.getByUserId(userId),
                hoaDonService.getAll(1, 100) 
            ]);

            if (userRes.payload.success) setUserInfo(userRes.payload.data);
            if (historyRes.payload) {
                const list = historyRes.payload.data?.data || historyRes.payload.data || [];
                setHistoryData(list.sort((a: any, b: any) => b.idPhieumuon - a.idPhieumuon));
            }
            if (hoaDonRes.payload.success) {
                const allHds = hoaDonRes.payload.data.data || [];
                setHoaDonData(allHds.filter((hd: any) => hd.idNguoiBiThu === userId));
            }
        } catch (error) {
            toast.error("Lỗi tải dữ liệu");
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => { fetchData(); }, [fetchData]);

    if (isLoading) return <div className="p-6 space-y-6"><Skeleton className="h-10 w-48" /><Skeleton className="h-96 w-full" /></div>;

    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-500">
            {/* GIỮ NGUYÊN PHẦN TRÊN CỦA BẠN */}
            <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" asChild className="rounded-full shadow-sm">
                    <Link href="/admin/users"><ArrowLeft className="h-4 w-4 mr-2" /> Quay lại danh sách</Link>
                </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <Card className="flex flex-col items-center justify-center p-6 border-muted">
                    <Avatar className="w-24 h-24 mb-4 border-4 border-primary/10">
                        <AvatarFallback className="bg-primary/5 text-primary font-bold text-2xl">{userInfo?.hoTen?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-2xl font-bold">{userInfo?.hoTen}</h2>
                    <p className="text-muted-foreground">{userInfo?.email}</p>
                    <div className="mt-4 flex gap-2">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">{userInfo?.vaiTro}</span>
                    </div>
                </Card>
                <Card className="lg:col-span-2 p-6 border-muted">
                    <CardHeader className="px-0 pt-0 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2 text-primary uppercase font-bold tracking-tight">
                            <User className="w-5 h-5" /> Thông tin cá nhân
                        </CardTitle>
                    </CardHeader>
                    <div className="grid md:grid-cols-2 gap-6">
                        <InfoItem icon={<IdCard className="w-4 h-4 text-muted-foreground"/>} label="Mã sinh viên" value={userInfo?.maSinhVien} />
                        <InfoItem icon={<Phone className="w-4 h-4 text-muted-foreground"/>} label="Số điện thoại" value={userInfo?.soDienThoai} />
                        <InfoItem icon={<Calendar className="w-4 h-4 text-muted-foreground"/>} label="Ngày sinh" value={formatDate(userInfo?.ngaySinh)} />
                        <InfoItem icon={<GraduationCap className="w-4 h-4 text-muted-foreground"/>} label="Lớp học" value={userInfo?.lop?.tenLop} />
                    </div>
                </Card>
            </div>

            {/* THỐNG KÊ (Giữ nguyên form của bạn) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-between">
                    <div><p className="text-sm text-muted-foreground font-medium uppercase tracking-tight">Tổng lượt mượn</p><p className="text-2xl font-bold text-blue-500">{historyData.length}</p></div>
                    <BookOpen className="w-8 h-8 text-blue-500/50" />
                </div>
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-between">
                    <div><p className="text-sm text-muted-foreground font-medium uppercase tracking-tight">Đang mượn</p><p className="text-2xl font-bold text-amber-500">{historyData.filter(p => p.trangThai === "dang_muon" || p.trangThai === "gia_han").length}</p></div>
                    <Clock className="w-8 h-8 text-amber-500/50" />
                </div>
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-between">
                    <div><p className="text-sm text-muted-foreground font-medium uppercase tracking-tight">Hóa đơn nợ</p><p className="text-2xl font-bold text-red-500">{hoaDonData.filter(h => h.trangThai === "chua_thanh_toan").length}</p></div>
                    <AlertCircle className="w-8 h-8 text-red-500/50" />
                </div>
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-between">
                    <div><p className="text-sm text-muted-foreground font-medium uppercase tracking-tight">Hoàn tất</p><p className="text-2xl font-bold text-green-500">{hoaDonData.filter(h => h.trangThai === "da_thanh_toan").length}</p></div>
                    <CheckCircle className="w-8 h-8 text-green-500/50" />
                </div>
            </div>

            {/* TABLE LỊCH SỬ MƯỢN TRẢ (Giữ nguyên form của bạn) */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold flex items-center gap-2 tracking-tighter uppercase"><BookOpen className="w-5 h-5 text-primary"/> Lịch sử mượn trả</h3>
                    <PaginationControls currentPage={currentPmPage} totalPages={totalPmPages} onPageChange={setCurrentPmPage} />
                </div>
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted hover:bg-muted font-bold">
                                <TableHead className="px-4 py-3 text-xs uppercase text-muted-foreground">ID</TableHead>
                                <TableHead className="px-4 py-3 text-xs uppercase text-muted-foreground">Sách đã mượn</TableHead>
                                <TableHead className="px-4 py-3 text-xs uppercase text-muted-foreground">Thời gian</TableHead>
                                <TableHead className="px-4 py-3 text-xs uppercase text-muted-foreground">Trạng thái</TableHead>
                                <TableHead className="px-4 py-3 text-xs uppercase text-muted-foreground text-right">Chi tiết</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentPhieuMuon.map((pm) => (
                                <TableRow key={pm.idPhieumuon} className="hover:bg-muted/30">
                                    <TableCell className="px-4 py-3 font-mono text-sm">#{pm.idPhieumuon}</TableCell>
                                    <TableCell className="px-4 py-3 font-medium text-sm">
                                        <div className="flex items-center gap-2"><Package className="w-4 h-4 text-muted-foreground" /> {pm.chi_tiet_phieu_muons?.[0]?.sach?.tenSach}</div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-xs font-medium">
                                        <div className="flex flex-col gap-1 text-blue-500"><Clock className="w-3 h-3 inline"/> Mượn: {formatDate(pm.ngayMuon)}</div>
                                        <div className="flex flex-col gap-1 text-red-500"><Calendar className="w-3 h-3 inline"/> Hạn: {formatDate(pm.hanTra)}</div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3">{getStatusBadgePm(pm.trangThai)}</TableCell>
                                    <TableCell className="px-4 py-3 text-right">
                                        <Link href={`/admin/phieu-muon/${pm.idPhieumuon}`}><button className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-primary"><Eye className="w-4 h-4" /></button></Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* TABLE HÓA ĐƠN - THÊM THEO FORM FILE BẠN GỬI */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold flex items-center gap-2 tracking-tighter uppercase"><Receipt className="w-5 h-5 text-red-500"/> Danh sách hóa đơn</h3>
                    <PaginationControls currentPage={currentHdPage} totalPages={totalHdPages} onPageChange={setCurrentHdPage} />
                </div>
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted hover:bg-muted font-bold">
                                <TableHead className="px-4 py-3 text-xs uppercase text-muted-foreground">ID</TableHead>
                                <TableHead className="px-4 py-3 text-xs uppercase text-muted-foreground">Người thu</TableHead>
                                <TableHead className="px-4 py-3 text-xs uppercase text-muted-foreground">Loại</TableHead>
                                <TableHead className="px-4 py-3 text-xs uppercase text-muted-foreground">Tổng tiền</TableHead>
                                <TableHead className="px-4 py-3 text-xs uppercase text-muted-foreground">Ngày lập</TableHead>
                                <TableHead className="px-4 py-3 text-xs uppercase text-muted-foreground">Trạng thái</TableHead>
                                <TableHead className="px-4 py-3 text-xs uppercase text-muted-foreground text-right pr-6">Chi tiết</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentHoaDon.length === 0 ? (
                                <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">Không tìm thấy hóa đơn nào</TableCell></TableRow>
                            ) : (
                                currentHoaDon.map((hd) => (
                                    <TableRow key={hd.idHoadon} className="hover:bg-muted/30 transition-colors">
                                        <TableCell className="px-4 py-3 font-mono text-sm">#{hd.idHoadon}</TableCell>
                                        <TableCell className="px-4 py-3 text-sm font-medium">{hd.nguoi_thu?.hoTen || 'N/A'}</TableCell>
                                        <TableCell className="px-4 py-3 text-sm">{getTypeLabelHd(hd.loaiHoadon)}</TableCell>
                                        <TableCell className="px-4 py-3">
                                            <div className="flex items-center gap-1 font-bold text-red-500">
                                                <DollarSign className="w-3 h-3" />
                                                {parseFloat(hd.tongTien.toString()).toLocaleString('vi-VN')}đ
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-sm">
                                            <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" /> {new Date(hd.ngayLap).toLocaleDateString('vi-VN')}</div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3">{getStatusBadgeHd(hd.trangThai)}</TableCell>
                                        <TableCell className="px-4 py-3 text-right pr-6">
                                            <Link href={`/admin/hoa-don/${hd.idHoadon}`}><button className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-primary"><Eye className="w-4 h-4" /></button></Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}

function InfoItem({ icon, label, value }: { icon: any, label: string, value: any }) {
    return (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/5 border border-transparent hover:border-muted transition-all">
            <div className="mt-1">{icon}</div>
            <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest leading-none mb-1">{label}</p>
                <p className="text-sm font-semibold">{value || "---"}</p>
            </div>
        </div>
    );
}

function PaginationControls({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (p: number) => void }) {
    return (
        <div className="flex items-center gap-2 bg-background p-1 rounded-md border shadow-sm">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
            <span className="text-[11px] font-bold px-1">Trang {currentPage}/{totalPages || 1}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages || totalPages === 0}><ChevronRight className="h-4 w-4" /></Button>
        </div>
    );
}