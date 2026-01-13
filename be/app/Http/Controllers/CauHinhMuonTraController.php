<?php

namespace App\Http\Controllers;

use App\Http\Requests\CauHinhMuonTra\CauHinhMuonTraRequest;
use App\Services\CauHinhMuonTraService;
use App\Helpers\ApiResponse;
use Illuminate\Http\Request;

class CauHinhMuonTraController extends Controller
{
    protected $cauHinhMuonTraService;

    public function __construct(CauHinhMuonTraService $cauHinhMuonTraService)
    {
        $this->cauHinhMuonTraService = $cauHinhMuonTraService;
    }

    /**
     * Get all configurations
     */
    public function index(Request $request)
    {
        try {
            $perPage = $request->query('per_page', null);
            $configs = $this->cauHinhMuonTraService->getAll($perPage);
            return ApiResponse::success($configs, 'Lấy danh sách cấu hình mượn trả thành công');
        } catch (\Exception $e) {
            return ApiResponse::error('Lỗi khi lấy danh sách cấu hình: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get configuration by ID
     */
    public function show($id)
    {
        try {
            $config = $this->cauHinhMuonTraService->getById($id);

            return ApiResponse::success($config, 'Lấy cấu hình thành công');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return ApiResponse::error('Không tìm thấy cấu hình', 404);
        } catch (\Exception $e) {
            return ApiResponse::error('Lỗi khi lấy cấu hình: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get current active configuration
     */
    public function current()
    {
        try {
            $config = $this->cauHinhMuonTraService->getCurrentConfig();

            if (!$config) {
                return ApiResponse::error('Không có cấu hình nào đang hoạt động', 404);
            }

            return ApiResponse::success($config, 'Lấy cấu hình hiện tại thành công');
        } catch (\Exception $e) {
            return ApiResponse::error('Lỗi khi lấy cấu hình hiện tại: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Create new configuration
     */
    public function store(CauHinhMuonTraRequest $request)
    {
        try {
            $config = $this->cauHinhMuonTraService->create($request->validated());

            return ApiResponse::success($config, 'Tạo cấu hình mượn trả thành công', 201);
        } catch (\Exception $e) {
            return ApiResponse::error('Lỗi khi tạo cấu hình: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update configuration
     */
    public function update(CauHinhMuonTraRequest $request, $id)
    {
        try {
            $config = $this->cauHinhMuonTraService->update($id, $request->validated());

            return ApiResponse::success($config, 'Cập nhật cấu hình thành công');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return ApiResponse::error('Không tìm thấy cấu hình', 404);
        } catch (\Exception $e) {
            return ApiResponse::error('Lỗi khi cập nhật cấu hình: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Delete configuration
     */
    public function destroy($id)
    {
        try {
            $this->cauHinhMuonTraService->delete($id);

            return ApiResponse::success(null, 'Xóa cấu hình thành công');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return ApiResponse::error('Không tìm thấy cấu hình', 404);
        } catch (\Exception $e) {
            return ApiResponse::error('Lỗi khi xóa cấu hình: ' . $e->getMessage(), 500);
        }
    }
}

