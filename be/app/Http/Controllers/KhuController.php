<?php

namespace App\Http\Controllers;

use App\Http\Requests\Area\KhuRequest;
use App\Services\KhuService;
use App\Helpers\ApiResponse;
use Exception;
use Illuminate\Http\Request;

class KhuController extends Controller
{
  protected KhuService $service;

  public function __construct(KhuService $service)
  {
    $this->service = $service;
  }

  public function index(Request $request)
{
    $perPage = $request->query('per_page', 10);
    try {
        $data = $this->service->listKhu($perPage);
        return ApiResponse::success($data, 'Danh sách khu');
    } catch (\Exception $e) {
        return ApiResponse::error($e->getMessage(), 500);
    }
}


  public function show(int $id)
  {
    try {
      $data = $this->service->getKhu($id);
      if (!$data) {
        return ApiResponse::error('Không tìm thấy khu', 404);
      }
      return ApiResponse::success($data, 'Chi tiết khu');
    } catch (Exception $e) {
      return ApiResponse::error($e->getMessage(), 500);
    }
  }

  public function store(KhuRequest $request)
  {
    try {
      $data = $this->service->createKhu($request->validated());
      return ApiResponse::success($data, 'Tạo khu thành công', 201);
    } catch (Exception $e) {
      return ApiResponse::error($e->getMessage(), 500);
    }
  }

  public function update(KhuRequest $request, int $id)
  {
    try {
      $data = $this->service->updateKhu($id, $request->validated());
      if (!$data) {
        return ApiResponse::error('Không tìm thấy khu để cập nhật', 404);
      }
      return ApiResponse::success($data, 'Cập nhật khu thành công');
    } catch (Exception $e) {
      return ApiResponse::error($e->getMessage(), 500);
    }
  }

  public function destroy(int $id)
  {
    try {
      $deleted = $this->service->deleteKhu($id);
      if (!$deleted) {
        return ApiResponse::error('Không tìm thấy khu để xóa', 404);
      }
      return ApiResponse::success(null, 'Xóa khu thành công');
    } catch (Exception $e) {
      return ApiResponse::error($e->getMessage(), 500);
    }
  }
}
