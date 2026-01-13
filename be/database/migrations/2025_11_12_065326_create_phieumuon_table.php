<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('phieumuon', function (Blueprint $table) {
            $table->id('idPhieumuon');
            $table->foreignId('idNguoiMuon')->constrained('taikhoan', 'id')->onDelete('restrict');
            $table->foreignId('idNguoiTao')->constrained('taikhoan', 'id')->onDelete('restrict');
            $table->date('ngayMuon');
            $table->date('hanTra');
            $table->enum('trangThai', ['dang_muon', 'da_tra', 'qua_han', 'huy'])->default('dang_muon');
            $table->string('ghiChu', 255)->nullable();
            $table->timestamps();

            $table->index('idNguoiMuon', 'pm_idNguoiMuon_index');
            $table->index('idNguoiTao', 'pm_idNguoiTao_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('phieumuon');
    }
};
