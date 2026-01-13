'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    List,
    Trash2,
    BookOpen,
    Calendar,
    Info,
    CheckCircle,
    AlertCircle,
    CircleDollarSign,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useUserStore } from '@/store/useUserStore';
import phieuMuonService, { CreatePhieuMuonBody } from '@/services/phieuMuon';
import cauHinhMuonTraService from '@/services/cauHinhMuonTra';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function CartPage() {
    const [borrowOpen, setBorrowOpen] = useState(false);
    const router = useRouter();
    const user = useUserStore((state) => state.user);
    const { items, removeItem, clearCart, getTotalItems } = useCartStore();
    const [ngayMuon, setNgayMuon] = useState<string>('');
    const [hanTra, setHanTra] = useState<string>('');
    const [ghiChu, setGhiChu] = useState('');
    const [soNgayToiDa, setSoNgayToiDa] = useState<number>(14);
    const [loadingConfig, setLoadingConfig] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // --- CẤU HÌNH PHÍ MƯỢN (Đồng bộ với Backend) ---
    const PHI_MUON_MOI_QUYEN = 5000;
    const tongPhiMuon = items.length * PHI_MUON_MOI_QUYEN;

    // Lấy cấu hình mượn trả
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                setLoadingConfig(true);
                const res = await cauHinhMuonTraService.getCurrent();
                if (res.payload.success) {
                    const config = res.payload.data;
                    const maxDays = config.soNgayToiDa ?? config.soNgayMuon ?? 14;
                    setSoNgayToiDa(maxDays);

                    const today = new Date();
                    const todayStr = today.toISOString().split('T')[0];
                    setNgayMuon(todayStr);

                    const returnDate = new Date(today);
                    returnDate.setDate(returnDate.getDate() + maxDays);
                    const returnDateStr = returnDate.toISOString().split('T')[0];
                    setHanTra(returnDateStr);
                }
            } catch (err) {
                console.error('Lỗi khi lấy cấu hình:', err);
                const today = new Date();
                const todayStr = today.toISOString().split('T')[0];
                setNgayMuon(todayStr);
                const returnDate = new Date(today);
                returnDate.setDate(returnDate.getDate() + 14);
                const returnDateStr = returnDate.toISOString().split('T')[0];
                setHanTra(returnDateStr);
            } finally {
                setLoadingConfig(false);
            }
        };

        fetchConfig();
    }, []);

    const submitBorrow = async () => {
        if (!user) {
            setError('Vui lòng đăng nhập để mượn sách');
            setTimeout(() => {
                router.push('/auth/login');
            }, 1200);
            return;
        }

        if (items.length === 0) {
            setError('Danh sách sách đã chọn đang trống');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const body: CreatePhieuMuonBody = {
                saches: items.map((item) => ({
                    idSach: item.idSach,
                    soLuong: 1,
                })),
                ngayMuon,
                hanTra,
                ghiChu: ghiChu || undefined,
            };

            await phieuMuonService.create(body);
            setSuccess(true);
            clearCart();
            setBorrowOpen(false);
        } catch (err: any) {
            console.error('Lỗi mượn sách:', err);
            setError(err?.payload?.message || 'Có lỗi xảy ra khi mượn sách. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await submitBorrow();
    };

    if (success) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center">
                    <CardHeader>
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                        <CardTitle className="text-2xl">Đã gửi yêu cầu mượn</CardTitle>
                        <CardDescription>Yêu cầu đang chờ thủ thư duyệt. Bạn có thể theo dõi tại trang Lịch sử mượn.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="p-4">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <List className="w-5 h-5" />
                    <h1 className="text-xl font-semibold">Danh sách sách đã chọn</h1>
                </div>
                <div className="text-sm text-muted-foreground">{items.length} sách</div>
            </div>

            {error && (
                <div className="mb-4 p-3 border border-red-500/30 rounded-md bg-red-500/10 text-sm flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                    <div>
                        <div className="font-semibold text-red-600 dark:text-red-400">Lỗi</div>
                        <div className="text-red-600 dark:text-red-400">{error}</div>
                    </div>
                </div>
            )}

            <div className="grid gap-4 ">
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Sách đã chọn</CardTitle>
                            <CardDescription>Quản lý sách muốn mượn</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {items.length === 0 ? (
                                <div className="text-sm text-muted-foreground">
                                    Giỏ sách trống. <Link className="underline" href="/sach">Khám phá sách</Link>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[56px]">#</TableHead>
                                                <TableHead>Tên sách</TableHead>
                                                <TableHead>Tác giả</TableHead>
                                                <TableHead className="text-right">Còn lại</TableHead>
                                                <TableHead className="text-right">Thao tác</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {items.map((item) => (
                                                <TableRow key={item.idSach}>
                                                    <TableCell>
                                                        {item.anhBia?.duongDan ? (
                                                            <img
                                                                src={item.anhBia.duongDan}
                                                                alt={item.tenSach}
                                                                className="h-10 w-8 object-cover rounded"
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-8 rounded bg-muted flex items-center justify-center">
                                                                <BookOpen className="w-4 h-4 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        <Link href={`/sach/${item.idSach}`} className="hover:underline">
                                                            {item.tenSach}
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">
                                                        {item.tacGia || ''}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {item.soLuongKhaDung}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => removeItem(item.idSach)}
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-1" /> Xóa
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <div className="flex justify-end gap-4 items-center">
                    {items.length > 0 && (
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Tổng phí dự kiến:</p>
                            <p className="text-lg font-bold text-red-600">{tongPhiMuon.toLocaleString()}đ</p>
                        </div>
                    )}
                    <Button
                        type="button"
                        onClick={() => setBorrowOpen(true)}
                        disabled={loading || loadingConfig || items.length === 0}
                    >
                        Tiến hành mượn
                    </Button>
                </div>
            </div>

            <Dialog open={borrowOpen} onOpenChange={setBorrowOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Xác nhận yêu cầu mượn</DialogTitle>
                        <DialogDescription>Kiểm tra thông tin mượn trước khi gửi yêu cầu cho thủ thư duyệt.</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" /> Ngày mượn
                                </label>
                                <Input type="date" value={ngayMuon} readOnly disabled />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" /> Hạn trả
                                </label>
                                <Input
                                    type="date"
                                    value={hanTra}
                                    onChange={(e) => setHanTra(e.target.value)}
                                    min={ngayMuon || new Date().toISOString().split('T')[0]}
                                    required
                                    disabled={loading || loadingConfig}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Ghi chú</label>
                            <Textarea
                                value={ghiChu}
                                onChange={(e) => setGhiChu(e.target.value)}
                                placeholder="Ghi chú thêm (nếu có)..."
                                rows={2}
                                disabled={loading}
                            />
                        </div>

                        <div className="rounded border p-3 text-sm space-y-2 bg-muted/30">
                            <CardTitle className="text-xs uppercase text-muted-foreground mb-2 flex items-center gap-1">
                                <CircleDollarSign className="w-3 h-3" /> Tóm tắt phí mượn
                            </CardTitle>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Số lượng sách:</span>
                                <span className="font-medium">{items.length} quyển</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Đơn giá mượn:</span>
                                <span className="font-medium">5.000đ/quyển</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t">
                                <span className="font-bold">Tổng phí dự kiến:</span>
                                <span className="font-bold text-red-600 text-base">{tongPhiMuon.toLocaleString()}đ</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded text-xs text-yellow-700 dark:text-yellow-400">
                            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div>
                                <strong>Lưu ý:</strong> Bạn sẽ nộp khoản phí này trực tiếp tại thư viện khi đến nhận sách. Vui lòng trả sách đúng hạn ({soNgayToiDa} ngày) để tránh phát sinh phí phạt trả trễ.
                            </div>
                        </div>

                        <div className="flex gap-2 justify-end">
                            <Button type="button" variant="outline" onClick={() => setBorrowOpen(false)} disabled={loading}>
                                Hủy
                            </Button>
                            <Button type="button" onClick={submitBorrow} disabled={loading || loadingConfig || items.length === 0}>
                                {loading ? 'Đang xử lý...' : `Xác nhận & Gửi yêu cầu`}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </form>
    );
}