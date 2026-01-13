import { z } from 'zod';
import { emailField, passwordField } from './common.schema';

// đăng ký tài khoản Schema
export const registerBodySchema = z
  .object({
    email: emailField,
    password: passwordField,
    password_confirmation: passwordField,
    hoTen: z
      .string()
      .min(1, { message: 'Họ tên không được để trống' })
      .max(100, { message: 'Họ tên không được quá 100 ký tự' }),
  })
  .strict()
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Xác nhận mật khẩu không khớp',
    path: ['password_confirmation'],
  });

// đăng nhập tài khoản Schema
export const loginBodySchema = z
  .object({
    email: emailField,
    password: z.string().min(1, { message: 'Mật khẩu không được để trống' }),
  })
  .strict();

// làm mới token Schema
export const refreshTokenBodySchema = z
  .object({
    refresh_token: z
      .string()
      .min(1, { message: 'Refresh token không được để trống' }),
  })
  .strict();

// quên mật khẩu Schema
export const forgotPasswordBodySchema = z
  .object({
    email: emailField,
  })
  .strict();

// đặt lại mật khẩu Schema
export const resetPasswordBodySchema = z
  .object({
    token: z.string().min(1, { message: 'Token không được để trống' }),
    email: emailField,
    password: passwordField,
    password_confirmation: passwordField,
  })
  .strict()
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Xác nhận mật khẩu không khớp',
    path: ['password_confirmation'],
  });
