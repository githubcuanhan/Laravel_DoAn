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
        Schema::create('chitiethoadon', function (Blueprint $table) {
            $table->foreignId('idHoadon')->constrained('hoadon', 'idHoadon')->onDelete('cascade');
            $table->foreignId('idCTPhieumuon')->constrained('chitietphieumuon', 'idCTPhieumuon')->onDelete('cascade');
            $table->decimal('soTienPhat', 10, 2)->default(0.00);
            $table->integer('soNgayTre')->default(0);
            $table->enum('trangThai', ['ap_dung', 'huy'])->default('ap_dung');
            $table->timestamps();

            $table->primary(['idHoadon', 'idCTPhieumuon']);
            $table->index('idCTPhieumuon', 'cthd_idCTPhieumuon_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chitiethoadon');
    }
};
