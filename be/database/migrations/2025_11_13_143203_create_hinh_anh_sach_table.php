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
        Schema::create('hinh_anh_sach', function (Blueprint $table) {
            $table->id();
            $table->foreignId('idSach')->constrained('sach', 'idSach')->onDelete('cascade');
            $table->string('duongDan', 255);
            $table->string('tieuDe', 255)->nullable();
            $table->boolean('is_cover')->default(false);
            $table->integer('thuTu')->default(0);
            $table->timestamps();

            $table->index('idSach', 'hinh_anh_sach_idSach_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hinh_anh_sach');
    }
};
