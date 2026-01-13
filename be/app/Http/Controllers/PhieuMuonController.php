<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Requests\PhieuMuon\CreatePhieuMuonRequest;
use App\Http\Requests\PhieuMuon\UpdatePhieuMuonRequest;
use App\Http\Requests\PhieuMuon\ReturnBookRequest;
use App\Services\PhieuMuonService;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class PhieuMuonController extends Controller
{
    protected PhieuMuonService $service;

    public function __construct(PhieuMuonService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 10);
        try {
            $data = $this->service->list($perPage);
            return ApiResponse::success($data, 'Danh sách phiếu mượn');
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 500);
        }
    }

    public function show(int $id)
    {
        try {
            $data = $this->service->get($id);
            return ApiResponse::success($data, 'Chi tiết phiếu mượn');
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 404);
        }
    }
    public function extend(Request $request, $id)
    {
        try {
            // Validate dữ liệu từ Pop-up
            $data = $request->validate([
                'soNgay' => 'required|integer|min:1',
                'lyDo' => 'nullable|string'
            ]);
            
            // Gọi Service xử lý logic chia nhỏ vào bảng giahan
            $result = $this->service->extendAll((int)$id, $data);
            
            return response()->json([
                'success' => true,
                'message' => 'Gia hạn toàn bộ sách trong phiếu thành công',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi gia hạn: ' . $e->getMessage()
            ], 500);
        }
    }

    public function myBorrows(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $perPage = $request->query('per_page', 10);
            $data = $this->service->getByUser($user->id, $perPage);
            return ApiResponse::success($data, 'Danh sách phiếu mượn của tôi');
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 500);
        }
    }

    public function store(CreatePhieuMuonRequest $request)
    {
        try {
            $user = auth()->user();
            $data = $request->validated();
            $data['idNguoiTao'] = $user->id;

            // Nếu không có idNguoiMuon, mặc định là người tạo
            if (!isset($data['idNguoiMuon'])) {
                $data['idNguoiMuon'] = $user->id;
            }

            $phieuMuon = $this->service->create($data);
            return ApiResponse::success($phieuMuon, 'Tạo phiếu mượn thành công', 201);
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 500);
        }
    }

    public function update(UpdatePhieuMuonRequest $request, int $id)
    {
        try {
            $data = $this->service->update($id, $request->validated());
            return ApiResponse::success($data, 'Cập nhật phiếu mượn thành công');
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 500);
        }
    }

    public function returnBook(ReturnBookRequest $request, int $phieuMuonId, int $sachId)
    {
        try {
            $data = $this->service->returnBook($phieuMuonId, $sachId, $request->validated());
            return ApiResponse::success($data, 'Trả sách thành công');
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 500);
        }
    }

    public function cancel(Request $request, int $id)
    {
        try {
            $ghiChu = $request->input('ghiChu');
            $data = $this->service->cancel($id, $ghiChu);
            return ApiResponse::success($data, 'Hủy phiếu mượn thành công');
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 500);
        }
    }

    public function destroy(int $id)
    {
        try {
            $this->service->delete($id);
            return ApiResponse::success(null, 'Xóa phiếu mượn thành công');
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 500);
        }
    }
    public function getByUser($id)
    {
        try {
            $data = $this->service->getByUser((int)$id); 
        
            // Trả về theo cấu trúc chuẩn mà Pagination của Laravel cung cấp
            return response()->json([
                'success' => true,
                'data' => $data->items(), // Lấy đúng mảng danh sách phiếu mượn
                'meta' => [
                    'current_page' => $data->currentPage(),
                    'last_page' => $data->lastPage(),
                    'total' => $data->total()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
}
    public function approve($id)
    {
        try {
            // Gọi hàm approve trong Service đã có logic Transaction và tạo HoaDon
            $result = $this->service->approve($id);
        
            return response()->json([
                'success' => true,
                'message' => 'Xác nhận thành công, hóa đơn đã được xuất.',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi SQL: ' . $e->getMessage() // Nó sẽ báo thiếu cột hay sai tên bảng ở đây
            ], 500);
        }
    }
}

