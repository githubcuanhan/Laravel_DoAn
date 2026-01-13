import { z } from 'zod';
import { nameField, passwordField } from './common.schema';

// Update Account Schema
export const updateAccountBodySchema = z
  .object({
    hoTen: nameField.optional(),
    soDienThoai: z
      .string()
      .max(20, { message: 'Số điện thoại không được quá 20 ký tự' })
      .optional(),
    ngaySinh: z.string().optional(),
    diaChi: z
      .string()
      .max(255, { message: 'Địa chỉ không được quá 255 ký tự' })
      .optional(),
    idLop: z.number().optional(),
    maSinhVien: z
      .string()
      .max(50, { message: 'Mã sinh viên không được quá 50 ký tự' })
      .optional(),
  })
  .strict();

// Update Password Schema
export const updatePasswordBodySchema = z
  .object({
    password_old: passwordField,
    password_new: passwordField,
    password_new_confirmation: passwordField,
  })
  .strict()
  .refine((data) => data.password_new === data.password_new_confirmation, {
    message: 'Xác nhận mật khẩu mới không khớp',
    path: ['password_new_confirmation'],
  });
