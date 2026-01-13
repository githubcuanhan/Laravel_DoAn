<?php

namespace App\Http\Controllers;

use App\Services\KeSachService;
use App\Helpers\ApiResponse;
use App\Http\Requests\BookShelf\KeSachRequest;
use Exception;
use Illuminate\Http\Request;

class KeSachController extends Controller
{
  protected KeSachService $service;

  public function __construct(KeSachService $service)
  {
    $this->service = $service;
  }

  public function index(Request $request)
{
    $perPage = $request->query('per_page', 10);
    try {
        $data = $this->service->listKeSach($perPage);
        return ApiResponse::success($data, 'Danh sách Kệ Sách');
    } catch (\Exception $e) {
        return ApiResponse::error($e->getMessage(), 500);
    }
}


  public function show(int $id)
  {
    try {
      $data = $this->service->getKeSach($id);
      if (!$data) {
        return ApiResponse::error('Không tìm thấy Kệ Sách', 404);
      }
      return ApiResponse::success($data, 'Chi tiết Kệ Sách');
    } catch (Exception $e) {
      return ApiResponse::error($e->getMessage(), 500);
    }
  }

  public function store(KeSachRequest $request)
  {
    try {
      $data = $this->service->createKeSach($request->validated());
      return ApiResponse::success($data, 'Tạo Kệ Sách thành công', 201);
    } catch (Exception $e) {
      return ApiResponse::error($e->getMessage(), 500);
    }
  }

  public function update(KeSachRequest $request, int $id)
  {
    try {
      $data = $this->service->updateKeSach($id, $request->validated());
      if (!$data) {
        return ApiResponse::error('Không tìm thấy Kệ Sách để cập nhật', 404);
      }
      return ApiResponse::success($data, 'Cập nhật Kệ Sách thành công');
    } catch (Exception $e) {
      return ApiResponse::error($e->getMessage(), 500);
    }
  }

  public function destroy(int $id)
  {
    try {
      $deleted = $this->service->deleteKeSach($id);
      if (!$deleted) {
        return ApiResponse::error('Không tìm thấy Kệ Sách để xóa', 404);
      }
      return ApiResponse::success(null, 'Xóa Kệ Sách thành công');
    } catch (Exception $e) {
      return ApiResponse::error($e->getMessage(), 500);
    }
  }
}
