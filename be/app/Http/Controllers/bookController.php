<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Requests\Book\BookRequest;
use App\Services\BookService;
use Illuminate\Http\Request;

class BookController extends Controller
{
    protected BookService $service;

    public function __construct(BookService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 10);
        try {
            $data = $this->service->list($perPage);
            return ApiResponse::success($data, 'Danh sách sách');
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 500);
        }
    }

    public function category(int $id, Request $request)
    {
        $perPage = $request->query('per_page', 10);
        try {
            $data = $this->service->category($id, $perPage);
            return ApiResponse::success($data, 'Danh sách sách');
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 500);
        }
    }

    public function search(Request $request)
    {
        $keyword = $request->query('query');

        if (!$keyword) {
            return ApiResponse::error("Thiếu từ khóa tìm kiếm", 400);
        }

        try {
            $data = $this->service->search($keyword);
            return ApiResponse::success($data, 'Kết quả tìm kiếm');
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 500);
        }
    }


    public function show($param)
{
    try {
        if (is_numeric($param)) {
            $data = $this->service->get(['idSach' => (int)$param]);
        } else {
            $data = $this->service->get(['maSach' => $param]);
        }

        return ApiResponse::success($data, 'Chi tiết sách');
    } catch (\Exception $e) {
        return ApiResponse::error($e->getMessage(), 404);
    }
}


    public function hero()
    {
        try {
            $data = $this->service->hero();
            return ApiResponse::success($data, 'Chi tiết sách');
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 404);
        }
    }

    public function store(BookRequest $request)
    {
        try {
            $data = $this->service->create($request->validated());
            return ApiResponse::success($data, 'Tạo sách thành công', 201);
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 500);
        }
    }

    public function update(BookRequest $request, int $id)
    {
        try {
            $data = $this->service->update($id, $request->validated());
            return ApiResponse::success($data, 'Cập nhật sách thành công');
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 500);
        }
    }

    public function destroy(int $id)
    {
        try {
            $deleted = $this->service->delete($id);
            return ApiResponse::success(null, 'Xóa sách thành công');
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 500);
        }
    }
}
