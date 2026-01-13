<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CauHinhMuonTra;
use Carbon\Carbon;

class CauHinhMuonTraSeeder extends Seeder
{
    public function run(): void
    {
        // Xóa dữ liệu cũ
        CauHinhMuonTra::truncate();

        // Cấu hình hiện tại: Mượn 14 ngày, phạt 5000đ/ngày
        CauHinhMuonTra::create([
            'soNgayToiDa' => 14,
            'mucPhatMoiNgay' => 5000,
            'apDungTuNgay' => Carbon::now()->subDays(30),
            'apDungDenNgay' => null, // Áp dụng vô thời hạn
        ]);

        $this->command->info('✅ Đã seed CauHinhMuonTra');
    }
}

