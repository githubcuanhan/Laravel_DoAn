<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\KeSachController;
use App\Http\Controllers\KhuController;
use App\Http\Controllers\TaiKhoanController;
use App\Http\Controllers\LopController;
use App\Http\Controllers\CauHinhMuonTraController;
use App\Http\Controllers\DanhMucController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PhieuMuonController;
use App\Http\Controllers\HoaDonController;

// API routes
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('refresh-token', [AuthController::class, 'refreshToken']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('jwtAuth');
    Route::get('/users/{id}/phieu-muon', [App\Http\Controllers\Api\PhieuMuonController::class, 'getHistoryByUserId']);
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('reset-password', [AuthController::class, 'resetPassword']);
});

Route::prefix('khu')->group(function () {
    Route::get('/', [KhuController::class, 'index']);
    Route::get('{id}', [KhuController::class, 'show']);
    Route::post('/', [KhuController::class, 'store']);
    Route::put('{id}', [KhuController::class, 'update']);
    Route::delete('{id}', [KhuController::class, 'destroy']);
});

Route::prefix('danhmuc')->group(function () {
    Route::get('/', [DanhMucController::class, 'index']);
    Route::get('{id}', [DanhMucController::class, 'show']);
    Route::post('/', [DanhMucController::class, 'store']);
    Route::put('{id}', [DanhMucController::class, 'update']);
    Route::delete('{id}', [DanhMucController::class, 'destroy']);
});

Route::prefix('bookshelf')->group(function () {
    Route::get('/', [KeSachController::class, 'index']);
    Route::get('{id}', [KeSachController::class, 'show']);
    Route::post('/', [KeSachController::class, 'store']);
    Route::put('{id}', [KeSachController::class, 'update']);
    Route::delete('{id}', [KeSachController::class, 'destroy']);
});

Route::prefix('sach')->group(function () {
    Route::get('/hero', [BookController::class, 'hero']);
    Route::get('/', [BookController::class, 'index']);
    Route::get('/search', [BookController::class, 'search']);
    Route::get('{id}', [BookController::class, 'show']);
    Route::get('/category/{id}', [BookController::class, 'category']);
    Route::post('/', [BookController::class, 'store']);
    Route::put('{id}', [BookController::class, 'update']);
    Route::delete('{id}', [BookController::class, 'destroy']);
});

Route::prefix('account')->middleware('jwtAuth')->group(function () {
    Route::get('me', [AuthController::class, 'me']);
});

Route::prefix('taikhoan')->group(function () {
    Route::get('/', [TaiKhoanController::class, 'index']);
    Route::get('{id}', [TaiKhoanController::class, 'show']);
    Route::post('/', [TaiKhoanController::class, 'store']);
    Route::put('{id}', [TaiKhoanController::class, 'update']);
    Route::delete('{id}', [TaiKhoanController::class, 'destroy']);
});

Route::prefix('lop')->group(function () {
    Route::get('/', [LopController::class, 'index']);
    Route::get('{id}', [LopController::class, 'show']);
    Route::post('/', [LopController::class, 'store']);
    Route::put('{id}', [LopController::class, 'update']);
    Route::delete('{id}', [LopController::class, 'destroy']);
});

Route::prefix('cauhinh-muontra')->group(function () {
    Route::get('/', [CauHinhMuonTraController::class, 'index']);
    Route::get('current', [CauHinhMuonTraController::class, 'current']);
    Route::get('{id}', [CauHinhMuonTraController::class, 'show']);
    Route::post('/', [CauHinhMuonTraController::class, 'store']);
    Route::put('{id}', [CauHinhMuonTraController::class, 'update']);
    Route::delete('{id}', [CauHinhMuonTraController::class, 'destroy']);
});
Route::get('/dashboard', [DashboardController::class, 'index']);
Route::prefix('phieu-muon')->group(function () {
    Route::get('/', [PhieuMuonController::class, 'index']);
    Route::get('my-borrows', [PhieuMuonController::class, 'myBorrows'])->middleware('jwtAuth');
    Route::get('user/{id}', [PhieuMuonController::class, 'getByUser']);
    Route::post('{id}/extend', [PhieuMuonController::class, 'extend']);
    Route::post('{id}/approve', [PhieuMuonController::class, 'approve']); 
    Route::get('{id}', [PhieuMuonController::class, 'show']);
    Route::post('/', [PhieuMuonController::class, 'store'])->middleware('jwtAuth');
    Route::put('{id}', [PhieuMuonController::class, 'update']);
    Route::post('{phieuMuonId}/return/{sachId}', [PhieuMuonController::class, 'returnBook']);
    Route::post('{id}/cancel', [PhieuMuonController::class, 'cancel']);
    Route::delete('{id}', [PhieuMuonController::class, 'destroy']);
});
Route::prefix('hoa-don')->group(function () {
    Route::get('/', [HoaDonController::class, 'index']); // Frontend gọi cái này sẽ bị lỗi nếu thiếu dấu /
    Route::get('{id}', [HoaDonController::class, 'show']);
    Route::put('{id}/status', [HoaDonController::class, 'updateStatus']);
    Route::delete('{id}', [HoaDonController::class, 'destroy']);
});
