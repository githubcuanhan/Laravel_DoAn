<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Requests\Lop\LopRequest;
use App\Services\LopService;
use Illuminate\Http\Request;

class LopController extends Controller
{
    protected LopService $service;

    public function __construct(LopService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $perPage = $request->query('per_page');
        try {
            $data = $this->service->list($perPage);
            return ApiResponse::success($data, 'Danh sách lớp');
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 500);
        }
    }

    public function show(int $id)
    {
        try {
            $data = $this->service->get($id);
            return ApiResponse::success($data, 'Chi tiết lớp');
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 404);
        }
    }

    public function store(LopRequest $request)
    {
        try {
            $data = $this->service->create($request->validated());
            return ApiResponse::success($data, 'Tạo lớp thành công', 201);
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 500);
        }
    }

    public function update(LopRequest $request, int $id)
    {
        try {
            $data = $this->service->update($id, $request->validated());
            return ApiResponse::success($data, 'Cập nhật lớp thành công');
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 500);
        }
    }

    public function destroy(int $id)
    {
        try {
            $deleted = $this->service->delete($id);
            return ApiResponse::success(null, 'Xóa lớp thành công');
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 500);
        }
    }
}

