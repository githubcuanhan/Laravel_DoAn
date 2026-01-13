import { z } from 'zod';
import { taiKhoanSchema } from './user.schema';
import { sachSchema } from './book.schema';

// Enum cho trạng thái phiếu mượn
export const trangThaiPhieuMuonEnum = z.enum([
  'dang_muon',
  'da_tra',
  'qua_han',
  'huy',
]);

// Enum cho trạng thái chi tiết phiếu mượn
export const trangThaiChiTietPhieuMuonEnum = z.enum([
  'dang_muon',
  'da_tra',
  'mat_sach',
]);

// GiaHan Schema
export const giaHanSchema = z.object({
  idGiahan: z.number(),
  idCTPhieumuon: z.number(),
  ngayGiaHan: z.string(),
  hanTraMoi: z.string(),
  lyDo: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// ChiTietPhieuMuon Schema
export const chiTietPhieuMuonSchema = z.object({
  idCTPhieumuon: z.number(),
  idPhieumuon: z.number(),
  idSach: z.number(),
  ngayMuon: z.string().nullable().optional(),
  hanTra: z.string().nullable().optional(),
  ngayTraThucTe: z.string().nullable().optional(),
  soNgayTre: z.number().default(0),
  tienPhat: z.number().default(0),
  soLuong: z.number().default(1),
  trangThai: trangThaiChiTietPhieuMuonEnum,
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  // Relationships
  sach: sachSchema.optional(),
  giaHans: z.array(giaHanSchema).optional(),
});

// PhieuMuon Schema
export const phieuMuonSchema = z.object({
  idPhieumuon: z.number(),
  idNguoiMuon: z.number(),
  idNguoiTao: z.number(),
  ngayMuon: z.string(),
  hanTra: z.string(),
  trangThai: trangThaiPhieuMuonEnum,
  ghiChu: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  // Relationships
  nguoiMuon: taiKhoanSchema.optional(),
  nguoiTao: taiKhoanSchema.optional(),
  chiTietPhieuMuons: z.array(chiTietPhieuMuonSchema).optional(),
});

// Create PhieuMuon Schema
export const createPhieuMuonBodySchema = z.object({
  idNguoiMuon: z.number().min(1, { message: 'Người mượn không được để trống' }),
  ngayMuon: z
    .string()
    .min(1, { message: 'Ngày mượn không được để trống' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'Ngày mượn phải theo định dạng YYYY-MM-DD',
    }),
  hanTra: z
    .string()
    .min(1, { message: 'Hạn trả không được để trống' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'Hạn trả phải theo định dạng YYYY-MM-DD',
    }),
  ghiChu: z.string().max(255).optional(),
  chiTietSach: z
    .array(
      z.object({
        idSach: z.number(),
        soLuong: z.number().int().min(1).default(1),
      })
    )
    .min(1, { message: 'Phải có ít nhất 1 sách' }),
});

// Update PhieuMuon Schema
export const updatePhieuMuonBodySchema = z.object({
  trangThai: trangThaiPhieuMuonEnum.optional(),
  ghiChu: z.string().max(255).optional(),
});

// Trả sách Schema
export const traSachBodySchema = z.object({
  idCTPhieumuon: z.number(),
  ngayTraThucTe: z
    .string()
    .min(1, { message: 'Ngày trả thực tế không được để trống' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'Ngày trả phải theo định dạng YYYY-MM-DD',
    }),
  trangThai: trangThaiChiTietPhieuMuonEnum,
});

// Gia hạn Schema
export const giaHanPhieuMuonBodySchema = z.object({
  idCTPhieumuon: z
    .number()
    .min(1, { message: 'ID chi tiết phiếu mượn không được để trống' }),
  ngayGiaHan: z
    .string()
    .min(1, { message: 'Ngày gia hạn không được để trống' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'Ngày gia hạn phải theo định dạng YYYY-MM-DD',
    }),
  hanTraMoi: z
    .string()
    .min(1, { message: 'Hạn trả mới không được để trống' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'Hạn trả mới phải theo định dạng YYYY-MM-DD',
    }),
  lyDo: z.string().max(255).optional(),
});
