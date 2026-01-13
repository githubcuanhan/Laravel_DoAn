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
        Schema::create('hoadon', function (Blueprint $table) {
            $table->id('idHoadon');
            $table->foreignId('idNguoiThu')->constrained('taikhoan', 'id')->onDelete('restrict');
            $table->foreignId('idNguoiBiThu')->constrained('taikhoan', 'id')->onDelete('restrict');
            $table->enum('loaiHoadon', ['phat_tre_hen', 'khac'])->default('phat_tre_hen');
            $table->date('ngayLap');
            $table->enum('trangThai', ['chua_thanh_toan', 'da_thanh_toan'])->default('chua_thanh_toan');
            $table->decimal('tongTien', 10, 2)->default(0.00);
            $table->string('ghiChu', 255)->nullable();
            $table->timestamps();

            $table->index('idNguoiThu', 'hoadon_idNguoiThu_index');
            $table->index('idNguoiBiThu', 'hoadon_idNguoiBiThu_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hoadon');
    }
};
