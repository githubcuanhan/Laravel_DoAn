import { z } from 'zod';

export const emailField = z
  .string()
  .min(1, { message: 'Email không được để trống' })
  .email({ message: 'Email phải là một địa chỉ email hợp lệ' })
  .max(255, { message: 'Email không được vượt quá 255 ký tự' });

export const passwordField = z
  .string()
  .min(1, { message: 'Mật khẩu không được để trống' })
  .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  .max(255, { message: 'Mật khẩu không được vượt quá 255 ký tự' });

export const nameField = z
  .string()
  .min(1, { message: 'Tên không được để trống' })
  .max(255, { message: 'Tên không được vượt quá 255 ký tự' });

export const createPasswordConfirmationSchema = <
  T extends { password: string; password_confirmation: string }
>(
  baseSchema: z.ZodType<T>
) =>
  baseSchema.refine((data) => data.password === data.password_confirmation, {
    message: 'Xác nhận mật khẩu không khớp',
    path: ['password_confirmation'],
  });
