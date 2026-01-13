import { z } from 'zod';
import { taiKhoanSchema } from './user.schema';
import { chiTietPhieuMuonSchema } from './borrow.schema';

// Enum cho loại hóa đơn
export const loaiHoaDonEnum = z.enum(['phat_tre_hen', 'khac']);

// Enum cho trạng thái hóa đơn
export const trangThaiHoaDonEnum = z.enum(['chua_thanh_toan', 'da_thanh_toan']);

// Enum cho trạng thái chi tiết hóa đơn
export const trangThaiChiTietHoaDonEnum = z.enum(['ap_dung', 'huy']);

// ChiTietHoaDon Schema
export const chiTietHoaDonSchema = z.object({
  idHoadon: z.number(),
  idCTPhieumuon: z.number(),
  soTienPhat: z.number().default(0),
  soNgayTre: z.number().default(0),
  trangThai: trangThaiChiTietHoaDonEnum,
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  // Relationships
  chiTietPhieuMuon: chiTietPhieuMuonSchema.optional(),
});

// HoaDon Schema
export const hoaDonSchema = z.object({
  idHoadon: z.number(),
  idNguoiThu: z.number(),
  idNguoiBiThu: z.number(),
  loaiHoadon: loaiHoaDonEnum,
  ngayLap: z.string(),
  trangThai: trangThaiHoaDonEnum,
  tongTien: z.number().default(0),
  ghiChu: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  // Relationships
  nguoiThu: taiKhoanSchema.optional(),
  nguoiBiThu: taiKhoanSchema.optional(),
  chiTietHoaDons: z.array(chiTietHoaDonSchema).optional(),
});

// Create HoaDon Schema
export const createHoaDonBodySchema = z.object({
  idNguoiBiThu: z
    .number()
    .min(1, { message: 'Người bị thu không được để trống' }),
  loaiHoadon: loaiHoaDonEnum.default('phat_tre_hen'),
  ngayLap: z
    .string()
    .min(1, { message: 'Ngày lập không được để trống' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Ngày lập phải theo định dạng YYYY-MM-DD' }),
  tongTien: z.number().min(0).default(0),
  ghiChu: z.string().max(255).optional(),
  chiTiet: z
    .array(
      z.object({
        idCTPhieumuon: z.number(),
        soTienPhat: z.number().min(0),
        soNgayTre: z.number().min(0).default(0),
      })
    )
    .min(1, { message: 'Phải có ít nhất 1 chi tiết hóa đơn' }),
});

// Update HoaDon Schema
export const updateHoaDonBodySchema = z.object({
  trangThai: trangThaiHoaDonEnum.optional(),
  ghiChu: z.string().max(255).optional(),
});

// Thanh toán HoaDon Schema
export const thanhToanHoaDonBodySchema = z.object({
  idHoadon: z.number().min(1, { message: 'ID hóa đơn không được để trống' }),
  phuongThucThanhToan: z.string().optional(),
  ghiChu: z.string().max(255).optional(),
});

