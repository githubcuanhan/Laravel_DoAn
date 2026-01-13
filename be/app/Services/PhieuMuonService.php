<?php
namespace App\Services;
namespace App\Services;

use App\Repositories\PhieuMuonRepository;
use App\Models\CauHinhMuonTra;
use App\Models\PhieuMuon;
use App\Models\HoaDon;
use App\Models\ChiTietHoaDon;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PhieuMuonService
{
    protected PhieuMuonRepository $repo;

    public function __construct(PhieuMuonRepository $repo)
    {
        $this->repo = $repo;
    }

    public function list($perPage = 10)
    {
        return $this->repo->getAll($perPage);
    }

    public function get(int $id)
    {
        return $this->repo->getById($id);
    }

        public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            $ngayHienTai = \Carbon\Carbon::now()->format('Y-m-d H:i:s');
            
            // 1. Tạo Phiếu mượn
            $phieu = \App\Models\PhieuMuon::create([
                'idNguoiMuon' => $data['idNguoiMuon'],
                'idNguoiTao'  => auth()->id() ?? 4,
                'ngayMuon'    => $ngayHienTai, // Sửa lỗi ngày
                'hanTra'      => $data['hanTra'],
                'trangThai'   => 'dang_cho',
            ]);

            // 2. Tạo Hóa đơn
            $hoaDon = \App\Models\HoaDon::create([
                'idNguoiThu'   => 4, 
                'idNguoiBiThu' => $data['idNguoiMuon'],
                'loaiHoadon'   => 'khac',
                'ngayLap'      => $ngayHienTai,
                'trangThai'    => 'chua_thanh_toan', 
                'tongTien'     => count($data['saches']) * 5000,
                'ghiChu'       => "Phí mượn phiếu #" . $phieu->idPhieumuon,
            ]);

            foreach ($data['saches'] as $sachData) {
                // 3. Tạo chi tiết phiếu mượn
                $ctpm = \App\Models\ChiTietPhieuMuon::create([
                    'idPhieumuon' => $phieu->idPhieumuon,
                    'idSach'      => $sachData['idSach'],
                    'soLuong'     => $sachData['soLuong'] ?? 1,
                    'trangThai'   => 'dang_muon', // Dùng giá trị DB chấp nhận
                    'ngayMuon'    => $ngayHienTai,
                    'hanTra'      => $data['hanTra'],
                ]);

                // 4. Tạo chi tiết hóa đơn (Cầu nối)
                DB::table('chitiethoadon')->insert([
                    'idHoadon'      => $hoaDon->idHoadon,
                    'idCTPhieumuon' => $ctpm->idCTPhieumuon,
                    'soTienPhat'    => 0,
                    'soNgayTre'     => 0,
                    'trangThai'     => 'ap_dung',
                ]);

                // Trừ kho
                \App\Models\Sach::where('idSach', $sachData['idSach'])->decrement('soLuongKhaDung', 1);
            }
            return $phieu;
        });
    }

        public function update(int $id, array $data)
        {
            return $this->repo->update($id, $data);
        }

        public function approve(int $id)
        {
            return DB::transaction(function () use ($id) {
                // 1. Lấy phiếu kèm chi tiết (Sử dụng đúng tên quan hệ chiTietPhieuMuons)
                $phieu = \App\Models\PhieuMuon::with('chiTietPhieuMuons')->findOrFail($id);
                
                // 2. Cập nhật phiếu mượn sang 'dang_muon'
                $phieu->update([
                    'trangThai' => 'dang_muon', 
                    'idNguoiTao' => auth()->id() ?? 4,
                    'ngayMuon' => now() // Cập nhật ngày mượn thực tế
                ]);

                // 3. Tìm hóa đơn thông qua idCTPhieumuon của dòng sách đầu tiên
                $firstDetail = $phieu->chiTietPhieuMuons->first();
                if ($firstDetail) {
                    $idHoadon = DB::table('chitiethoadon')
                        ->where('idCTPhieumuon', $firstDetail->idCTPhieumuon)
                        ->value('idHoadon');

                    if ($idHoadon) {
                        // 4. Chốt hóa đơn thành 'da_thanh_toan'
                        DB::table('hoadon')
                            ->where('idHoadon', $idHoadon)
                            ->update([
                                'trangThai' => 'da_thanh_toan', // Đảm bảo khớp ENUM
                                'idNguoiThu' => auth()->id() ?? 4,
                                'updated_at' => now()
                            ]);
                    }
                }

                return $phieu;
            });
        }
    /**
     * Trả sách: Tự động tính tiền phạt và tạo hóa đơn phạt (loại 'phat_tre_hen')
     */
    // app/Services/PhieuMuonService.php

    public function returnBook(int $phieuMuonId, int $sachId, array $data = [])
    {
        return DB::transaction(function () use ($phieuMuonId, $sachId, $data) {
            // 1. Lấy cấu hình tiền phạt
            $cauHinh = CauHinhMuonTra::where('apDungTuNgay', '<=', Carbon::now())
                ->where(function ($query) {
                    $query->whereNull('apDungDenNgay')
                        ->orWhere('apDungDenNgay', '>=', Carbon::now());
                })
                ->orderBy('apDungTuNgay', 'desc')
                ->first();

            if (!$cauHinh) {
                throw new \Exception('Không tìm thấy cấu hình mượn trả để tính tiền phạt.');
            }

            // 2. Gọi Repository xử lý. 
            // Lưu ý: Repository cần được cập nhật để hiểu trạng thái 'gia_han'
            $data['mucPhat'] = $cauHinh->mucPhatMoiNgay;
            $chiTietPM = $this->repo->returnBook($phieuMuonId, $sachId, $data);

            // 3. Tạo hóa đơn nếu có tiền phạt
            if ($chiTietPM->tienPhat > 0) {
                $phieu = PhieuMuon::find($phieuMuonId);
                
                $hoaDonPhat = HoaDon::create([
                    'idNguoiThu'   => auth()->id() ?? 2,
                    'idNguoiBiThu' => $phieu->idNguoiMuon,
                    'loaiHoadon'   => 'phat_tre_hen',
                    'ngayLap'      => now(),
                    'trangThai'    => 'da_thanh_toan',
                    'tongTien'     => $chiTietPM->tienPhat,
                    'ghiChu'       => "Phạt trả trễ " . $chiTietPM->soNgayTre . " ngày - Sách ID #" . $sachId,
                ]);

                ChiTietHoaDon::create([
                    'idHoadon'      => $hoaDonPhat->idHoadon,
                    'idCTPhieumuon' => $chiTietPM->idCTPhieumuon,
                    'soTienPhat'    => $chiTietPM->tienPhat,
                    'soNgayTre'     => $chiTietPM->soNgayTre,
                    'trangThai'     => 'ap_dung',
                ]);
            }

            return $chiTietPM;
        });
    }
    public function cancel(int $id, string $ghiChu = null)
    {
        return $this->repo->cancel($id, $ghiChu);
    }

    public function delete(int $id)
    {
        return $this->repo->delete($id);
    }
    
// app/Services/PhieuMuonService.php

    public function getByUser(int $userId, int $perPage = 10)
    {
        return PhieuMuon::with(['chiTietPhieuMuons.sach', 'nguoiMuon', 'nguoiTao'])
            ->withCount('giaHans')
            ->where('idNguoiMuon', $userId)
            ->latest('idPhieumuon')
            ->paginate($perPage);
    }
    public function extendAll(int $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $phieu = \App\Models\PhieuMuon::with('chiTietPhieuMuons')->findOrFail($id);
            
            // Kiểm tra nếu đã gia hạn rồi (nếu bạn vẫn muốn chặn 1 lần)
            $idCTs = $phieu->chiTietPhieuMuons->pluck('idCTPhieumuon');
            $daGiaHan = DB::table('giahan')->whereIn('idCTPhieumuon', $idCTs)->exists();
            if ($daGiaHan) {
                throw new \Exception('Phiếu mượn này đã được gia hạn trước đó.');
            }

            $soNgay = (int)($data['soNgay'] ?? 7);
            $hanTraMoi = \Carbon\Carbon::parse($phieu->hanTra)->addDays($soNgay);

            // CẬP NHẬT TRẠNG THÁI THÀNH gia_han
            $phieu->update([
                'hanTra' => $hanTraMoi,
                'trangThai' => 'gia_han' // Đổi từ dang_muon thành gia_han
            ]);

            foreach ($phieu->chiTietPhieuMuons as $ct) {
                $hanTraMoiCuaSach = \Carbon\Carbon::parse($ct->hanTra)->addDays($soNgay);

                DB::table('giahan')->insert([
                    'idCTPhieumuon' => $ct->idCTPhieumuon, 
                    'ngayGiaHan'    => now(),
                    'hanTraMoi'     => $hanTraMoiCuaSach,
                    'lyDo'          => $data['lyDo'] ?? 'Gia hạn toàn bộ sách',
                    'created_at'    => now(),
                    'updated_at'    => now(),
                ]);

                // Cập nhật chi tiết cũng sang trạng thái gia_han (nếu cần đồng bộ)
                $ct->update([
                    'hanTra' => $hanTraMoiCuaSach,
                    'trangThai' => 'gia_han' 
                ]);
            }

            return $phieu;
        });
    }
}
