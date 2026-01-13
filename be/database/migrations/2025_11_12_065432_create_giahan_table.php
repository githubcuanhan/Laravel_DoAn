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
        Schema::create('giahan', function (Blueprint $table) {
            $table->id('idGiahan');
            $table->foreignId('idCTPhieumuon')->constrained('chitietphieumuon', 'idCTPhieumuon')->onDelete('cascade');
            $table->date('ngayGiaHan');
            $table->date('hanTraMoi');
            $table->string('lyDo', 255)->nullable();
            $table->timestamps();

            $table->index('idCTPhieumuon', 'giahan_idCTPhieumuon_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('giahan');
    }
};
