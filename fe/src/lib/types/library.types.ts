import { z } from 'zod';
import {
    lopSchema,
    danhMucSchema,
    khuSchema,
    keSachSchema,
    cauHinhMuonTraSchema,
    createLopBodySchema,
    updateLopBodySchema,
    createDanhMucBodySchema,
    updateDanhMucBodySchema,
    createKhuBodySchema,
    updateKhuBodySchema,
    createKeSachBodySchema,
    updateKeSachBodySchema,
    createCauHinhMuonTraBodySchema,
    updateCauHinhMuonTraBodySchema,
} from '@/lib/schemas/library.schema';
import type { ApiResponse } from './api.types';

// Schema types
export type Lop = z.infer<typeof lopSchema>;
export type DanhMuc = z.infer<typeof danhMucSchema>;
export type Khu = z.infer<typeof khuSchema>;
export type KeSach = z.infer<typeof keSachSchema>;
export type CauHinhMuonTra = z.infer<typeof cauHinhMuonTraSchema>;

// Body types - Lop
export type CreateLopBody = z.infer<typeof createLopBodySchema>;
export type UpdateLopBody = z.infer<typeof updateLopBodySchema>;

// Body types - DanhMuc
export type CreateDanhMucBody = z.infer<typeof createDanhMucBodySchema>;
export type UpdateDanhMucBody = z.infer<typeof updateDanhMucBodySchema>;

// Body types - Khu
export type CreateKhuBody = z.infer<typeof createKhuBodySchema>;
export type UpdateKhuBody = z.infer<typeof updateKhuBodySchema>;

// Body types - KeSach
export type CreateKeSachBody = z.infer<typeof createKeSachBodySchema>;
export type UpdateKeSachBody = z.infer<typeof updateKeSachBodySchema>;

// Body types - CauHinhMuonTra
export type CreateCauHinhMuonTraBody = z.infer<
    typeof createCauHinhMuonTraBodySchema
>;
export type UpdateCauHinhMuonTraBody = z.infer<
    typeof updateCauHinhMuonTraBodySchema
>;

// Response types
export type LopResponse = ApiResponse<Lop>;
export type LopListResponse = ApiResponse<Lop[]>;
export type DanhMucResponse = ApiResponse<DanhMuc>;
export type DanhMucListResponse = ApiResponse<DanhMuc[]>;
export type KhuResponse = ApiResponse<Khu>;
export type KhuListResponse = ApiResponse<Khu[]>;
export type KeSachResponse = ApiResponse<KeSach>;
export type KeSachListResponse = ApiResponse<KeSach[]>;
export type CauHinhMuonTraResponse = ApiResponse<CauHinhMuonTra>;
export type CauHinhMuonTraListResponse = ApiResponse<CauHinhMuonTra[]>;

// --- GIỮ NGUYÊN PhieuMuonChiTiet CỦA BẠN ---
export interface PhieuMuonChiTiet {
    id: number;
    idPhieumuon?: number; // Bổ sung để tương thích với DB
    maPhieu: string;
    ngayMuon: string;
    hanTra: string;
    ngayTraThucTe?: string | null;
    trangThai: 'dang_muon' | 'da_tra' | 'qua_han' | 'cho_duyet' | 'da_huy' | 'qua_han_chua_tra' | 'dang_cho';
    ghiChu?: string | null;
    phiMuon?: number;
    tongPhiMuon?: number;
    sach: {
        id: number;
        tenSach: string;
        maSach: string;
    };
    soNgayQuaHan?: number;
    phiPhat?: number;
}

// --- THÊM CÁC TYPE ĐỂ KHỚP VỚI PHIEUMUONSERVICE ---

// Định nghĩa Alias để file phieuMuon.ts không báo lỗi khi tìm "PhieuMuon"
export type PhieuMuon = PhieuMuonChiTiet;

export interface CreatePhieuMuonBody {
    saches: {
        idSach: number;
        soLuong: number;
    }[];
    ngayMuon: string;
    hanTra: string;
    ghiChu?: string;
    phiMuon?: number;
    tongPhiMuon?: number;
}

export interface UpdatePhieuMuonBody {
    trangThai?: string;
    ghiChu?: string;
}

export interface ReturnBookBody {
    ngayTraThucTe?: string;
    mucPhat?: number;
    trangThai?: string;
    idNguoiThu?: number;
}

// 2. Type cho thông tin chi tiết người dùng
export interface UserDetailData {
    id: number;
    hoTen: string;
    email: string;
    soDienThoai?: string | null;
    vaiTro: string;
    lop?: {
        id: number;
        tenLop: string;
    } | null;
}