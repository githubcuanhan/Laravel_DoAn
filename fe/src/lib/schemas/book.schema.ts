import { z } from 'zod';

// Enum cho trạng thái sách
export const trangThaiSachEnum = z.enum([
  'dang_su_dung',
  'tam_khoa',
  'ngung_phuc_vu',
]);

// HinhAnhSach Schema
export const hinhAnhSachSchema = z.object({
  id: z.number(),
  idSach: z.number(),
  duongDan: z.string(),
  tieuDe: z.string().nullable().optional(),
  is_cover: z.boolean(),
  thuTu: z.number(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// KeSach Schema (rút gọn)
export const keSachRefSchema = z.object({
  idKeSach: z.number(),
  tenKe: z.string(),
  moTa: z.string().nullable().optional(),
});

// DanhMuc Schema (rút gọn)
export const danhMucRefSchema = z.object({
  idDanhmuc: z.number(),
  tenDanhmuc: z.string(),
  moTa: z.string().nullable().optional(),
});

// Sach Schema
export const sachSchema = z.object({
  idSach: z.number(),
  maSach: z.string(),
  maQR: z.string().nullable().optional(),
  tenSach: z.string(),
  tacGia: z.string().nullable().optional(),
  nhaXuatBan: z.string().nullable().optional(),
  namXuatBan: z.number().nullable().optional(),
  soLuong: z.number(),
  soLuongKhaDung: z.number(),
  sizesach: z.string().nullable().optional(), 
  trangThai: trangThaiSachEnum,
  moTa: z.string().nullable().optional(),
  idKeSach: z.number().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  // Relationships
  keSach: keSachRefSchema.nullable().optional(),
  danhMucs: z.number().nullable().optional(),
  hinhAnhs: z.array(hinhAnhSachSchema).optional(),
  anhBia: hinhAnhSachSchema.nullable().optional(),
});

// Create/Update Sach Schemas
export const createSachBodySchema = z.object({
  maSach: z
    .string()
    .min(1, { message: 'Mã sách không được để trống' })
    .max(50, { message: 'Mã sách không được quá 50 ký tự' }),
  maQR: z.string().max(5000).optional(),
  tenSach: z
    .string()
    .min(1, { message: 'Tên sách không được để trống' })
    .max(255, { message: 'Tên sách không được quá 255 ký tự' }),
  tacGia: z.string().max(255).optional(),
  nhaXuatBan: z.string().max(255).optional(),
  namXuatBan: z.number().int().min(1000).max(9999).optional(),
  soLuong: z.number().int().min(0).default(0),
  soLuongKhaDung: z.number().int().min(0).default(0),
  sizesach: z.string().optional(), 
  trangThai: trangThaiSachEnum.default('dang_su_dung'),
  moTa: z.string().optional(),
  
  // SỬA TẠI ĐÂY: Thay đổi logic để không chặn form khi giá trị khởi tạo là undefined/null
  idKeSach: z
    .number({ invalid_type_error: "Vui lòng chọn kệ sách" })
    .int()
    .min(1, { message: "Bạn phải chọn kệ sách" })
    .optional()
    .nullable(),
    
  danhMucIds: z
    .number({ invalid_type_error: "Vui lòng chọn danh mục" })
    .int()
    .min(1, { message: "Bạn phải chọn danh mục" })
    .optional()
    .nullable(),
});

export const updateSachBodySchema = createSachBodySchema.partial();

// Create HinhAnhSach Schema
export const createHinhAnhSachBodySchema = z.object({
  idSach: z.number(),
  duongDan: z
    .string()
    .min(1, { message: 'Đường dẫn hình ảnh không được để trống' })
    .max(255),
  tieuDe: z.string().max(255).optional(),
  is_cover: z.boolean().default(false),
  thuTu: z.number().int().min(0).default(0),
});

export const updateHinhAnhSachBodySchema = createHinhAnhSachBodySchema
  .omit({ idSach: true })
  .partial();