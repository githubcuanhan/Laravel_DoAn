import { z } from 'zod';

// Enum cho vai trò
export const vaiTroEnum = z.enum(['admin', 'thuthu', 'bandoc']);

// Enum cho trạng thái tài khoản
export const trangThaiTaiKhoanEnum = z.enum(['hoat_dong', 'tam_khoa', 'ngung']);

// Lop Schema
export const lopSchema = z.object({
  idLop: z.number(),
  tenLop: z.string(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// TaiKhoan Schema (User)
export const taiKhoanSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  vaiTro: vaiTroEnum,
  hoTen: z.string(),
  soDienThoai: z.string().nullable().optional(),
  ngaySinh: z.string().nullable().optional(),
  diaChi: z.string().nullable().optional(),
  idLop: z.number().nullable().optional(),
  maSinhVien: z.string().nullable().optional(),
  trangThai: trangThaiTaiKhoanEnum,
  last_login_at: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  lop: lopSchema.nullable().optional(),
});

// Alias cho User
export const userSchema = taiKhoanSchema;

// API Response Schemas
export const baseApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const apiResponseWithDataSchema = <T extends z.ZodTypeAny>(
  dataSchema: T
) =>
  baseApiResponseSchema.extend({
    data: dataSchema,
  });

export const apiResponseWithOptionalDataSchema = baseApiResponseSchema.extend({
  data: z.unknown().optional(),
});

// Create User Body Schema
export const createUserBodySchema = z.object({
  hoTen: z.string().min(1, 'Họ tên là bắt buộc'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  vaiTro: vaiTroEnum,
  trangThai: trangThaiTaiKhoanEnum,
  soDienThoai: z.string().nullable().optional(),
  ngaySinh: z.string().nullable().optional(),
  diaChi: z.string().nullable().optional(),
  idLop: z.number().nullable().optional(),
  maSinhVien: z.string().nullable().optional(),
});

// Update User Body Schema (password optional)
export const updateUserBodySchema = z
  .object({
    hoTen: z.string().min(1, "Họ tên là bắt buộc"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").optional().or(z.literal("")),
    password_confirmation: z.string().optional(),
    vaiTro: vaiTroEnum,
    trangThai: trangThaiTaiKhoanEnum,
    soDienThoai: z.string().nullable().optional(),
    ngaySinh: z.string().nullable().optional(),
    diaChi: z.string().nullable().optional(),
    idLop: z.number().nullable().optional(),
    maSinhVien: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.password && data.password.trim() !== "") {
        return data.password === data.password_confirmation;
      }
      return true;
    },
    {
      message: "Mật khẩu nhập lại không khớp",
      path: ["password_confirmation"],
    }
  );