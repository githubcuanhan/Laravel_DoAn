// src/services/phieuMuon.ts

import http from "@/lib/http";
import { ApiResponse, PaginatedResponse } from "@/lib/types/api.types";
import {
    PhieuMuon,
    ChiTietPhieuMuon,
    CreatePhieuMuonBody,
    UpdatePhieuMuonBody,
    ReturnBookBody
} from "@/lib/types/library.types";

const phieuMuonService = {
    // Lấy danh sách tất cả phiếu mượn (cho Admin)
    getAll: (page: number = 1, perPage: number = 10) =>
        http.get<PaginatedResponse<PhieuMuon>>(
            `/phieu-muon?page=${page}&per_page=${perPage}`
        ),

    // Lấy danh sách phiếu mượn của người dùng đang đăng nhập
    getMyBorrows: (page: number = 1, perPage: number = 10) =>
        http.get<PaginatedResponse<PhieuMuon>>(
            `/phieu-muon/my-borrows?page=${page}&per_page=${perPage}`
        ),

    // Lấy chi tiết một phiếu mượn
    getOne: (id: number) =>
        http.get<ApiResponse<PhieuMuon>>(`/phieu-muon/${id}`),

    // Lấy lịch sử mượn của một User cụ thể (cho Admin xem)
    getByUserId: (userId: number | string) =>
        http.get<ApiResponse<PhieuMuon[]>>(`/phieu-muon/user/${userId}`),
   // Gia hạn thiếu mượn
   // Trong file services/phieuMuon.ts
   extend: (id: number, data: { soNgay: number, lyDo: string }) => 
   	http.post(`/phieu-muon/${id}/extend`, data),

    // ==================================================================
    // HÀM MỚI: Duyệt phiếu mượn và Thu tiền (Dành cho Thủ thư)
    approve: (id: number) =>
        http.post<ApiResponse<PhieuMuon>>(`/phieu-muon/${id}/approve`, {}),
    // ==================================================================

    // Tạo phiếu mượn mới
    create: (body: CreatePhieuMuonBody) =>
        http.post<ApiResponse<PhieuMuon>>("/phieu-muon", body),

    // Cập nhật phiếu mượn
    update: (id: number, body: UpdatePhieuMuonBody) =>
        http.put<ApiResponse<PhieuMuon>>(`/phieu-muon/${id}`, body),

    // Trả sách
    returnBook: (phieuMuonId: number, sachId: number, body: ReturnBookBody) =>
        http.post<ApiResponse<ChiTietPhieuMuon>>(
            `/phieu-muon/${phieuMuonId}/return/${sachId}`,
            body
        ),

    // Hủy phiếu mượn
    cancel: (id: number, ghiChu?: string) =>
        http.post<ApiResponse<PhieuMuon>>(`/phieu-muon/${id}/cancel`, { ghiChu }),

    // Xóa phiếu mượn
    delete: (id: number) =>
        http.delete<ApiResponse<void>>(`/phieu-muon/${id}`, {}),
};

export default phieuMuonService;