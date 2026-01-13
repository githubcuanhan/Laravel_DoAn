import { z } from 'zod';
import {
  userSchema,
  taiKhoanSchema,
  lopSchema,
  vaiTroEnum,
  trangThaiTaiKhoanEnum,
  createUserBodySchema,
  updateUserBodySchema,
} from '@/lib/schemas/user.schema';
import { ApiResponse } from './api.types';

export type User = z.infer<typeof userSchema>;
export type TaiKhoan = z.infer<typeof taiKhoanSchema>;
export type Lop = z.infer<typeof lopSchema>;
export type VaiTro = z.infer<typeof vaiTroEnum>;
export type TrangThaiTaiKhoan = z.infer<typeof trangThaiTaiKhoanEnum>;

// Body types
export type CreateUserBody = z.infer<typeof createUserBodySchema>;
export type UpdateUserBody = z.infer<typeof updateUserBodySchema>;

// Response types
export type UserResponse = ApiResponse<User>;
export type UserListResponse = ApiResponse<User[]>;
