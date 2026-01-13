import http from "@/lib/http";
import { ApiResponse, PaginatedResponse } from "@/lib/types/api.types";

export interface ChiTietHoaDon {
  idHoadon: number;
  idCTPhieumuon: number;
  soTienPhat: number;
  soNgayTre: number;
  trangThai: "ap_dung" | "huy";
  chi_tiet_phieu_muon?: {
    idCTPhieumuon: number;
    idSach: number;
    soNgayTre: number;
    tienPhat: number;
    sach?: {
      idSach: number;
      tenSach: string;
      maSach: string;
      tacGia?: string;
    };
    phieu_muon?: {
      idPhieumuon: number;
      ngayMuon: string;
      hanTra: string;
    };
  };
}

export interface HoaDon {
  idHoadon: number;
  idNguoiThu: number;
  idNguoiBiThu: number;
  loaiHoadon: "phat_tre_hen" | "mat_sach" | "khac";
  ngayLap: string;
  trangThai: "chua_thanh_toan" | "da_thanh_toan";
  tongTien: number;
  ghiChu?: string;
  created_at?: string;
  updated_at?: string;
  nguoi_thu?: {
    id: number;
    hoTen: string;
    email: string;
    soDienThoai?: string;
  };
  nguoi_bi_thu?: {
    id: number;
    hoTen: string;
    email: string;
    maSinhVien?: string;
    soDienThoai?: string;
  };
  chi_tiet_hoa_dons?: ChiTietHoaDon[];
}

const hoaDonService = {
  getAll: (page: number = 1, perPage: number = 10) =>
    http.get<PaginatedResponse<HoaDon>>(
      `/hoa-don?page=${page}&per_page=${perPage}`
    ),

  getOne: (id: number) => http.get<ApiResponse<HoaDon>>(`/hoa-don/${id}`),

  updateStatus: (id: number, trangThai: "chua_thanh_toan" | "da_thanh_toan") =>
    http.put<ApiResponse<HoaDon>>(`/hoa-don/${id}/status`, { trangThai }),

  delete: (id: number) =>
    http.delete<ApiResponse<void>>(`/hoa-don/${id}`, {}),
};

export default hoaDonService;

