<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Requests\DanhMuc\DanhMucRequest;
use App\Services\DanhMucService;
use Illuminate\Http\Request;

class DanhMucController extends Controller
{
    protected DanhMucService $service;

    public function __construct(DanhMucService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $perPage = $request->query('per_page');
        try {
            $data = $this->service->list($perPage);
            return ApiResponse::success($data, 'Danh sách danh mục');
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 500);
        }
    }

    public function show(int $id)
    {
        try {
            $data = $this->service->get($id);
            return ApiResponse::success($data, 'Chi tiết danh mục');
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 404);
        }
    }

    public function store(DanhMucRequest $request)
    {
        try {
            $data = $this->service->create($request->validated());
            return ApiResponse::success($data, 'Tạo danh mục thành công', 201);
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 500);
        }
    }

    public function update(DanhMucRequest $request, int $id)
    {
        try {
            $data = $this->service->update($id, $request->validated());
            return ApiResponse::success($data, 'Cập nhật danh mục thành công');
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 500);
        }
    }

    public function destroy(int $id)
    {
        try {
            $deleted = $this->service->delete($id);
            return ApiResponse::success(null, 'Xóa danh mục thành công');
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 500);
        }
    }
}

