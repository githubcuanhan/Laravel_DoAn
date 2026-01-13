<?php

namespace App\Repositories;

use App\Models\HoaDon;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Models\PhieuMuon;
class HoaDonRepository
{
    public function getAll($perPage = 10)
    {
        try {
            return \App\Models\HoaDon::with([
                'nguoiThu:id,hoTen',
                'nguoiBiThu:id,hoTen',
                'chiTietHoaDons.chiTietPhieuMuon.sach' 
            ])
            ->orderBy('idHoadon', 'desc')
            ->paginate($perPage);
        } catch (\Exception $e) {
            // Nếu có lỗi, log ra để biết chính xác là lỗi gì
            \Illuminate\Support\Facades\Log::error($e->getMessage());
            throw $e;
        }
}

// app/Repositories/HoaDonRepository.php

    public function getById(int $id)
    {
        return HoaDon::with([
            'nguoiThu:id,hoTen,email,soDienThoai',
            'nguoiBiThu:id,hoTen,email,maSinhVien,soDienThoai',
            // SỬA TẠI ĐÂY: Đi qua chiTietHoaDons để lấy sách và phiếu mượn
            'chiTietHoaDons.chiTietPhieuMuon.sach',
            'chiTietHoaDons.chiTietPhieuMuon.phieuMuon'
        ])->findOrFail($id);
    }

    public function updateStatus(int $id, string $trangThai)
    {
        $hoaDon = HoaDon::findOrFail($id);
        $hoaDon->update(['trangThai' => $trangThai]);
        
        return $hoaDon->load([
            'nguoiThu:id,hoTen,email',
            'nguoiBiThu:id,hoTen,email,maSinhVien',
            'chiTietHoaDons.chiTietPhieuMuon.sach:idSach,tenSach,maSach'
        ]);
    }

    public function delete(int $id)
    {
        $hoaDon = HoaDon::findOrFail($id);
        
        // Chỉ cho phép xóa hóa đơn chưa thanh toán
        if ($hoaDon->trangThai === 'da_thanh_toan') {
            throw new \Exception('Không thể xóa hóa đơn đã thanh toán');
        }

        return $hoaDon->delete();
    }
}

