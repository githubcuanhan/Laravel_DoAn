import { z } from 'zod';
import {
  registerBodySchema,
  loginBodySchema,
  refreshTokenBodySchema,
  forgotPasswordBodySchema,
  resetPasswordBodySchema,
} from '@/lib/schemas/auth.schema';
import type { User } from './user.types';
import type { ApiResponse } from './api.types';

// form types (inferred from schemas)
export type RegisterBody = z.infer<typeof registerBodySchema>;
export type LoginBody = z.infer<typeof loginBodySchema>;
export type RefreshTokenBody = z.infer<typeof refreshTokenBodySchema>;
export type ForgotPasswordBody = z.infer<typeof forgotPasswordBodySchema>;
export type ResetPasswordBody = z.infer<typeof resetPasswordBodySchema>;

// response data types
export interface AuthData {
  access_token: string;
  refresh_token: string;
  refresh_expires_at: string;
  user: User;
}

export interface RefreshData {
  access_token: string;
  refresh_token: string;
  refresh_expires_at: string;
}

// response types
export type RegisterResponse = ApiResponse<AuthData>;
export type LoginResponse = ApiResponse<AuthData>;
export type RefreshResponse = ApiResponse<RefreshData>;
export type LogoutResponse = ApiResponse<void>;
export type ForgotPasswordResponse = ApiResponse<void>;
export type ResetPasswordResponse = ApiResponse<void>;
