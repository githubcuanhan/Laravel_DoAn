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
        Schema::create('chitietphieumuon', function (Blueprint $table) {
            $table->id('idCTPhieumuon');
            $table->foreignId('idPhieumuon')->constrained('phieumuon', 'idPhieumuon')->onDelete('cascade');
            $table->foreignId('idSach')->constrained('sach', 'idSach')->onDelete('restrict');
            $table->date('ngayMuon')->nullable();
            $table->date('hanTra')->nullable();
            $table->date('ngayTraThucTe')->nullable();
            $table->integer('soNgayTre')->default(0);
            $table->decimal('tienPhat', 10, 2)->default(0.00);
            $table->integer('soLuong')->default(1);
            $table->enum('trangThai', ['dang_muon', 'da_tra', 'mat_sach'])->default('dang_muon');
            $table->timestamps();

            $table->unique(['idPhieumuon', 'idSach'], 'ctpm_unique_phieumuon_sach');
            $table->index('idPhieumuon', 'ctpm_idPhieumuon_index');
            $table->index('idSach', 'ctpm_idSach_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chitietphieumuon');
    }
};
