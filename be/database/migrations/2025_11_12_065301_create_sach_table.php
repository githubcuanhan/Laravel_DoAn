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
        Schema::create('sach', function (Blueprint $table) {
            $table->id('idSach');
            $table->string('maSach', 50)->unique();
            $table->string('maQR', 255)->unique()->nullable();
            $table->string('tenSach', 255);
            $table->string('tacGia', 255)->nullable();
            $table->string('nhaXuatBan', 255)->nullable();
            $table->integer('namXuatBan')->nullable();
            $table->integer('soLuong')->default(0);
            $table->integer('soLuongKhaDung')->default(0);
            $table->enum('trangThai', ['dang_su_dung', 'tam_khoa', 'ngung_phuc_vu'])->default('dang_su_dung');
            $table->text('moTa')->nullable();
            $table->foreignId('idKeSach')->nullable()->constrained('kesach', 'idKeSach')->onDelete('set null');
            $table->timestamps();

            $table->index('idKeSach', 'sach_idKeSach_index');
        });

        // Thêm fulltext index
        DB::statement('ALTER TABLE sach ADD FULLTEXT sach_search_fulltext (tenSach, tacGia, nhaXuatBan, moTa)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sach');
    }
};
