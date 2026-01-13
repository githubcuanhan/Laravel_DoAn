import { z } from 'zod';

// Lop Schema
export const lopSchema = z.object({
  idLop: z.number(),
  tenLop: z.string(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// DanhMuc Schema
export const danhMucSchema = z.object({
  idDanhmuc: z.number(),
  tenDanhmuc: z.string(),
  moTa: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// Khu Schema
export const khuSchema = z.object({
  idKhu: z.number(),
  tenKhu: z.string(),
  viTri: z.string().nullable().optional(),
  moTa: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// KeSach Schema
export const keSachSchema = z.object({
  idKeSach: z.number(),
  idKhu: z.number(),
  tenKe: z.string(),
  moTa: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  // Relationships
  khu: khuSchema.optional(),
});

// CauHinhMuonTra Schema
export const cauHinhMuonTraSchema = z.object({
  id: z.number(),
  soNgayToiDa: z.number().default(7),
  mucPhatMoiNgay: z.number().default(5000),
  apDungTuNgay: z.string(),
  apDungDenNgay: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// Create/Update Schemas

// Lop
export const createLopBodySchema = z.object({
  tenLop: z
    .string()
    .min(1, { message: 'Tên lớp không được để trống' })
    .max(100, { message: 'Tên lớp không được quá 100 ký tự' }),
});

export const updateLopBodySchema = createLopBodySchema.partial();

// DanhMuc
export const createDanhMucBodySchema = z.object({
  tenDanhmuc: z
    .string()
    .min(1, { message: 'Tên danh mục không được để trống' })
    .max(100, { message: 'Tên danh mục không được quá 100 ký tự' }),
  moTa: z.string().max(255).optional(),
});

export const updateDanhMucBodySchema = createDanhMucBodySchema.partial();

// Khu
export const createKhuBodySchema = z.object({
  tenKhu: z
    .string()
    .min(1, { message: 'Tên khu không được để trống' })
    .max(100, { message: 'Tên khu không được quá 100 ký tự' }),
  viTri: z.string().max(255).optional(),
  moTa: z.string().max(255).optional(),
});

export const updateKhuBodySchema = createKhuBodySchema.partial();

// KeSach
export const createKeSachBodySchema = z.object({
  idKhu: z.number().min(1, { message: 'Khu không được để trống' }),
  tenKe: z
    .string()
    .min(1, { message: 'Tên kệ không được để trống' })
    .max(100, { message: 'Tên kệ không được quá 100 ký tự' }),
  moTa: z.string().max(255).optional(),
});

export const updateKeSachBodySchema = createKeSachBodySchema.partial();

// CauHinhMuonTra
export const createCauHinhMuonTraBodySchema = z.object({
  soNgayToiDa: z
    .number()
    .int()
    .min(1, { message: 'Số ngày tối đa phải lớn hơn 0' })
    .max(365, { message: 'Số ngày tối đa không được quá 365' })
    .default(7),
  mucPhatMoiNgay: z
    .number()
    .min(0, { message: 'Mức phạt mỗi ngày phải lớn hơn hoặc bằng 0' })
    .default(5000),
  apDungTuNgay: z
    .string()
    .min(1, { message: 'Áp dụng từ ngày không được để trống' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'Ngày phải theo định dạng YYYY-MM-DD',
    }),
  apDungDenNgay: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'Ngày phải theo định dạng YYYY-MM-DD',
    })
    .optional(),
});

export const updateCauHinhMuonTraBodySchema =
  createCauHinhMuonTraBodySchema.partial();
