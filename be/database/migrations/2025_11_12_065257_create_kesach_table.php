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
        Schema::create('kesach', function (Blueprint $table) {
            $table->id('idKeSach');
            $table->foreignId('idKhu')
                ->constrained('khu', 'idKhu')
                ->onDelete('restrict');
            $table->string('tenKe', 100);
            $table->string('moTa', 255)->nullable();
            $table->timestamps();

            $table->index('idKhu', 'kesach_idKhu_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kesach');
    }
};
