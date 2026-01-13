<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Auth\Notifications\ResetPassword;
use App\Models\TaiKhoan;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ResetPassword::createUrlUsing(function (TaiKhoan $user, string $token) {
            return env('APP_URL_FRONTEND') . '/auth/reset-password?token=' . $token . '&email=' . $user->email;
        });
    }
}
