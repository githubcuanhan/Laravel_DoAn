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
        Schema::create('refresh_tokens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('idTaiKhoan')->constrained('taikhoan', 'id')->onDelete('cascade');
            $table->string('token', 255)->unique();
            $table->timestamp('expires_at');
            $table->boolean('revoked')->default(false);
            $table->string('ip', 255)->nullable();
            $table->string('user_agent', 255)->nullable();
            $table->timestamps();

            $table->index(['idTaiKhoan', 'revoked'], 'refresh_tokens_idTaiKhoan_revoked_index');
            $table->index('expires_at', 'refresh_tokens_expires_at_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('refresh_tokens');
    }
};
