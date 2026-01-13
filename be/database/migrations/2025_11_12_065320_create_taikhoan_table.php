<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('taikhoan', function (Blueprint $table) {
            $table->id();
            $table->string('email', 255)->unique();
            $table->string('password', 255);
            $table->enum('vaiTro', ['admin', 'thuthu', 'bandoc'])->default('bandoc');
            $table->string('hoTen', 100);
            $table->string('soDienThoai', 20)->nullable();
            $table->date('ngaySinh')->nullable();
            $table->string('diaChi', 255)->nullable();
            $table->foreignId('idLop')->nullable()->constrained('lop', 'idLop')->onDelete('set null');
            $table->string('maSinhVien', 50)->nullable();
            $table->enum('trangThai', ['hoat_dong', 'tam_khoa', 'ngung'])->default('hoat_dong');
            $table->timestamp('last_login_at')->nullable();
            $table->rememberToken();
            $table->timestamps();

            $table->index('idLop', 'taikhoan_idLop_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('taikhoan');
    }
};
