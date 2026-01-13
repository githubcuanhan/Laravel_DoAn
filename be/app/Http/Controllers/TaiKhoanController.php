<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Requests\TaiKhoan\TaiKhoanRequest;
use App\Services\TaiKhoanService;
use Illuminate\Http\Request;

class TaiKhoanController extends Controller
{
    protected TaiKhoanService $service;

    public function __construct(TaiKhoanService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 10);
        try {
            $data = $this->service->list($perPage);
            return ApiResponse::success($data, 'Danh sách tài khoản');
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 500);
        }
    }

    public function show(int $id)
    {
        try {
            $data = $this->service->get($id);
            return ApiResponse::success($data, 'Chi tiết tài khoản');
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 404);
        }
    }

    public function store(TaiKhoanRequest $request)
    {
        try {
            $data = $this->service->create($request->validated());
            return ApiResponse::success($data, 'Tạo tài khoản thành công', 201);
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 500);
        }
    }

    public function update(TaiKhoanRequest $request, int $id)
    {
        try {
            $data = $this->service->update($id, $request->validated());
            return ApiResponse::success($data, 'Cập nhật tài khoản thành công');
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 500);
        }
    }

    public function destroy(int $id)
    {
        try {
            $deleted = $this->service->delete($id);
            return ApiResponse::success(null, 'Xóa tài khoản thành công');
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 500);
        }
    }
}

