import { z } from 'zod';
import {
  updateAccountBodySchema,
  updatePasswordBodySchema,
} from '@/lib/schemas/account.schema';
import type { TaiKhoan } from './user.types';
import type { ApiResponse } from './api.types';

export type UpdateAccountBody = z.infer<typeof updateAccountBodySchema>;
export type UpdatePasswordBody = z.infer<typeof updatePasswordBodySchema>;

export type UpdateAccountResponse = ApiResponse<{ hoTen: string }>;
export type UpdatePasswordResponse = ApiResponse<void>;
export type AccountMeResponse = ApiResponse<TaiKhoan>;
