<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Services\HoaDonService;
use Illuminate\Http\Request;

class HoaDonController extends Controller
{
    protected HoaDonService $service;

    public function __construct(HoaDonService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 10);
        try {
            $data = $this->service->list($perPage);
            return ApiResponse::success($data, 'Danh sách hóa đơn');
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 500);
        }
    }

    public function show(int $id)
    {
        try {
            $data = $this->service->get($id);
            return ApiResponse::success($data, 'Chi tiết hóa đơn');
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 404);
        }
    }

    public function updateStatus(Request $request, int $id)
    {
        $request->validate([
            'trangThai' => 'required|in:chua_thanh_toan,da_thanh_toan'
        ]);

        try {
            $data = $this->service->updateStatus($id, $request->trangThai);
            return ApiResponse::success($data, 'Cập nhật trạng thái hóa đơn thành công');
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 500);
        }
    }

    public function destroy(int $id)
    {
        try {
            $this->service->delete($id);
            return ApiResponse::success(null, 'Xóa hóa đơn thành công');
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 500);
        }
    }
}

