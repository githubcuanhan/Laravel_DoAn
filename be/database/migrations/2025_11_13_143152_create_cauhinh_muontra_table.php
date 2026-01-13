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
        Schema::create('cauhinh_muontra', function (Blueprint $table) {
            $table->id();
            $table->integer('soNgayToiDa')->default(7);
            $table->decimal('mucPhatMoiNgay', 10, 2)->default(5000.00);
            $table->date('apDungTuNgay');
            $table->date('apDungDenNgay')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cauhinh_muontra');
    }
};
