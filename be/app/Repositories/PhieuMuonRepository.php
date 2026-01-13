<?php

namespace App\Repositories;

use App\Models\PhieuMuon;
use App\Models\ChiTietPhieuMuon;
use App\Models\Sach;
use App\Models\HoaDon;
use App\Models\ChiTietHoaDon;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PhieuMuonRepository
{
    public function getAll($perPage = 10)
    {
        // Tự động cập nhật trạng thái qua_han cho các phiếu mượn quá hạn
        $this->updateOverdueStatus();

        return PhieuMuon::with([
            'nguoiMuon:id,hoTen,email,maSinhVien',
            'nguoiTao:id,hoTen,email',
            'chiTietPhieuMuons.sach:idSach,tenSach,maSach,tacGia'
        ])->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function getById(int $id)
        {
            // Tự động cập nhật trạng thái qua_han cho phiếu mượn này nếu quá hạn
            $this->updateOverdueStatus($id);

            return PhieuMuon::with([
                'nguoiMuon:id,hoTen,email,maSinhVien,soDienThoai',
                'nguoiTao:id,hoTen,email',
                'chiTietPhieuMuons.sach:idSach,tenSach,maSach,tacGia,soLuongKhaDung',
                // Tải thông tin hóa đơn đi kèm các quan hệ định danh người dùng
                'chiTietPhieuMuons.chiTietHoaDons.hoaDon.nguoiThu:id,hoTen,email',
                'chiTietPhieuMuons.chiTietHoaDons.hoaDon.nguoiBiThu:id,hoTen,email,maSinhVien,soDienThoai'
            ])->findOrFail($id);
        }

    public function getByUserId(int $userId, $perPage = 10)
    {
        $this->updateOverdueStatus();

        return PhieuMuon::where('idNguoiMuon', $userId)
            ->withCount('giaHans') // <--- THÊM DÒNG NÀY ĐỂ FE SINH VIÊN ẨN NÚT
            ->with([
                'nguoiTao:id,hoTen,email',
                'chiTietPhieuMuons.sach:idSach,tenSach,maSach,tacGia'
            ])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

     public function create(array $data)
{
    return DB::transaction(function () use ($data) {
        // 1. Tạo phiếu mượn (BỎ phiMuon và tongPhiMuon)
        $phieuMuon = PhieuMuon::create([
            'idNguoiMuon' => $data['idNguoiMuon'],
            'idNguoiTao'  => $data['idNguoiTao'] ?? null,
            'ngayMuon'    => $data['ngayMuon'] ?? Carbon::now(),
            'hanTra'      => $data['hanTra'],
            'trangThai'   => $data['trangThai'] ?? 'dang_cho',
            'ghiChu'      => $data['ghiChu'] ?? null,
        ]);

        // 2. Tạo chi tiết phiếu mượn
        foreach ($data['saches'] as $sachData) {
            $sach = Sach::findOrFail($sachData['idSach']);
            
            // Chỉ kiểm tra số lượng, KHÔNG trừ kho ở đây (Trừ kho lúc Approve)
            if ($sach->soLuongKhaDung < ($sachData['soLuong'] ?? 1)) {
                throw new \Exception("Sách '{$sach->tenSach}' không đủ số lượng");
            }

            ChiTietPhieuMuon::create([
                'idPhieumuon' => $phieuMuon->idPhieumuon,
                'idSach' => $sachData['idSach'],
                'ngayMuon' => $data['ngayMuon'] ?? Carbon::now(),
                'hanTra' => $data['hanTra'],
                'soLuong' => $sachData['soLuong'] ?? 1,
                'trangThai' => 'dang_muon', // Trạng thái của dòng sách
            ]);
        }

        return $phieuMuon->load(['nguoiMuon', 'chiTietPhieuMuons.sach']);
    });
}
    public function update(int $id, array $data)
    {
        $phieuMuon = PhieuMuon::findOrFail($id);
        $phieuMuon->update([
            'trangThai' => $data['trangThai'] ?? $phieuMuon->trangThai,
            'ghiChu' => $data['ghiChu'] ?? $phieuMuon->ghiChu,
        ]);

        return $phieuMuon->load([
            'nguoiMuon:id,hoTen,email,maSinhVien',
            'nguoiTao:id,hoTen,email',
            'chiTietPhieuMuons.sach:idSach,tenSach,maSach,tacGia'
        ]);
    }

        public function returnBook(int $phieuMuonId, int $sachId, array $data)
    {
        return DB::transaction(function () use ($phieuMuonId, $sachId, $data) {
            // 1. Tìm chi tiết phiếu mượn
            $chiTiet = ChiTietPhieuMuon::where('idPhieumuon', $phieuMuonId)
                ->where('idSach', $sachId)
                ->firstOrFail();

            // CHẶN: Chỉ cho phép trả nếu đang mượn, quá hạn hoặc ĐÃ GIA HẠN
            if (!in_array($chiTiet->trangThai, ['dang_muon', 'qua_han', 'gia_han'])) {
                throw new \Exception('Sách này đã được trả hoặc không ở trạng thái có thể thực hiện trả.');
            }

            // 2. Tính toán ngày trễ và tiền phạt (Dựa trên hạn trả cũ hoặc hạn trả mới sau khi gia hạn)
            $ngayTraThucTe = $data['ngayTraThucTe'] ?? Carbon::now();
            $soNgayTre = max(0, Carbon::parse($chiTiet->hanTra)->diffInDays($ngayTraThucTe, false));
            $tienPhat = $soNgayTre * ($data['mucPhat'] ?? 5000);

            // 3. Cập nhật trạng thái chi tiết sách sang 'da_tra'
            $chiTiet->update([
                'ngayTraThucTe' => $ngayTraThucTe,
                'soNgayTre' => $soNgayTre,
                'tienPhat' => $tienPhat,
                'trangThai' => $data['trangThai'] ?? 'da_tra',
            ]);

            // 4. Tăng số lượng sách khả dụng trong kho
            $sach = Sach::findOrFail($sachId);
            $sach->increment('soLuongKhaDung', $chiTiet->soLuong);

            // 5. Xử lý hóa đơn phạt nếu có tiền phạt
            if ($tienPhat > 0) {
                $phieuMuon = PhieuMuon::findOrFail($phieuMuonId);
                $idNguoiThu = $data['idNguoiThu'] ?? auth()->id() ?? $phieuMuon->idNguoiTao;
                $idNguoiBiThu = $phieuMuon->idNguoiMuon;

                // Kiểm tra xem đã có hóa đơn phạt chưa thanh toán trong ngày hôm nay chưa để gộp vào
                $hoaDon = HoaDon::where('idNguoiBiThu', $idNguoiBiThu)
                    ->where('loaiHoadon', 'phat_tre_hen')
                    ->where('trangThai', 'chua_thanh_toan')
                    ->whereDate('ngayLap', Carbon::today())
                    ->first();

                if (!$hoaDon) {
                    // Tạo hóa đơn mới
                    $hoaDon = HoaDon::create([
                        'idNguoiThu' => $idNguoiThu,
                        'idNguoiBiThu' => $idNguoiBiThu,
                        'loaiHoadon' => 'phat_tre_hen',
                        'ngayLap' => Carbon::now(),
                        'trangThai' => 'chua_thanh_toan',
                        'tongTien' => $tienPhat,
                        'ghiChu' => "Phạt trả sách trễ - Phiếu mượn #{$phieuMuonId}"
                    ]);
                } else {
                    // Cập nhật (cộng dồn) tổng tiền hóa đơn hiện có
                    $hoaDon->increment('tongTien', $tienPhat);
                }

                // Tạo hoặc cập nhật chi tiết hóa đơn phạt cho cuốn sách này
                ChiTietHoaDon::updateOrCreate(
                    [
                        'idHoadon' => $hoaDon->idHoadon,
                        'idCTPhieumuon' => $chiTiet->idCTPhieumuon,
                    ],
                    [
                        'soTienPhat' => $tienPhat,
                        'soNgayTre' => $soNgayTre,
                        'trangThai' => 'ap_dung',
                    ]
                );
            }

            // 6. Cập nhật trạng thái Phiếu mượn tổng nếu tất cả sách đã được trả
            $this->updatePhieuMuonStatusAfterReturn($phieuMuonId);

            return $chiTiet;
        });
    }

    /**
     * Hàm hỗ trợ cập nhật trạng thái phiếu mượn tổng
     */
    protected function updatePhieuMuonStatusAfterReturn(int $phieuMuonId)
    {
        $phieu = PhieuMuon::with('chiTietPhieuMuons')->find($phieuMuonId);
        
        // Kiểm tra nếu tất cả các cuốn sách trong phiếu đều đã có trạng thái 'da_tra'
        $tatCaDaTra = $phieu->chiTietPhieuMuons->every(function ($ct) {
            return $ct->trangThai === 'da_tra';
        });

        if ($tatCaDaTra) {
            $phieu->update(['trangThai' => 'da_tra']);
        }
    }

    public function delete(int $id)
    {
        return DB::transaction(function () use ($id) {
            $phieuMuon = PhieuMuon::findOrFail($id);

            // Kiểm tra trạng thái
            if ($phieuMuon->trangThai !== 'huy') {
                throw new \Exception('Chỉ có thể xóa phiếu mượn đã hủy');
            }

            // Hoàn trả số lượng sách
            foreach ($phieuMuon->chiTietPhieuMuons as $chiTiet) {
                if ($chiTiet->trangThai === 'dang_muon') {
                    $sach = Sach::findOrFail($chiTiet->idSach);
                    $sach->increment('soLuongKhaDung', $chiTiet->soLuong);
                }
            }

            return $phieuMuon->delete();
        });
    }

    public function cancel(int $id, string $ghiChu = null)
    {
        return DB::transaction(function () use ($id, $ghiChu) {
            $phieuMuon = PhieuMuon::findOrFail($id);

            // 1. Cập nhật điều kiện: Cho phép hủy/từ chối khi đang chờ duyệt, đang mượn, quá hạn hoặc đã gia hạn
            $trangThaiChoPhep = ['dang_cho', 'dang_muon', 'gia_han', 'qua_han'];
            
            if (!in_array($phieuMuon->trangThai, $trangThaiChoPhep)) {
                throw new \Exception('Không thể hủy phiếu mượn ở trạng thái này.');
            }

            // 2. Hoàn trả số lượng sách vào kho (Chỉ thực hiện nếu phiếu đã qua bước duyệt - tức là đã trừ kho)
            // Phiếu 'dang_cho' thường chưa trừ kho nên không cần increment
            if (in_array($phieuMuon->trangThai, ['dang_muon', 'gia_han', 'qua_han'])) {
                foreach ($phieuMuon->chiTietPhieuMuons as $chiTiet) {
                    // Chỉ hoàn kho những cuốn sách chưa được trả
                    if ($chiTiet->trangThai !== 'da_tra') {
                        $sach = Sach::findOrFail($chiTiet->idSach);
                        $sach->increment('soLuongKhaDung', $chiTiet->soLuong);
                        
                        // Cập nhật chi tiết sang 'da_tra' để kết thúc dòng mượn
                        $chiTiet->update(['trangThai' => 'da_tra']);
                    }
                }
            }

            // 3. Cập nhật trạng thái phiếu mượn tổng thành 'huy'
            $phieuMuon->update([
                'trangThai' => 'huy',
                'ghiChu' => $ghiChu ?? $phieuMuon->ghiChu,
            ]);

            return $phieuMuon->load([
                'nguoiMuon:id,hoTen,email,maSinhVien',
                'nguoiTao:id,hoTen,email',
                'chiTietPhieuMuons.sach:idSach,tenSach,maSach,tacGia'
            ]);
        });
    }

    /**
     * Tự động cập nhật trạng thái qua_han cho các phiếu mượn quá hạn
     */
    private function updateOverdueStatus(?int $phieuMuonId = null)
    {
        // SỬA TẠI ĐÂY: Cho phép cập nhật quá hạn cho cả phiếu đang mượn và phiếu ĐÃ GIA HẠN
        $query = PhieuMuon::whereIn('trangThai', ['dang_muon', 'gia_han']) 
            ->where('hanTra', '<', Carbon::now());

        if ($phieuMuonId) {
            $query->where('idPhieumuon', $phieuMuonId);
        }

        $query->update(['trangThai' => 'qua_han']);
    }
}

