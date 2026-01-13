import http from '@/lib/http';
import {
  UpdateAccountBody,
  UpdatePasswordBody,
  AccountMeResponse,
  UpdateAccountResponse,
  UpdatePasswordResponse,
} from '@/lib/types/account.types';
import { ApiResponse, PaginatedResponse } from '@/lib/types/api.types';
import type { User, CreateUserBody, UpdateUserBody, UserDetailData } from '@/lib/types/user.types';

const userService = {
  // Account endpoints (existing)
  me: () => http.get<AccountMeResponse>('/account/me'),

  meServer: (clientSessionToken: string) =>
    http.get<AccountMeResponse>('/account/me', {
      headers: {
        Authorization: `Bearer ${clientSessionToken}`,
      },
    }),

  update: (body: UpdateAccountBody) => {
    return http.put<UpdateAccountResponse>('/account/update', body);
  },

  updatePassword: (body: UpdatePasswordBody) =>
    http.put<UpdatePasswordResponse>('/account/update-password', body),

  // User management endpoints (new)
  getAll: (page: number = 1, perPage: number = 10) =>
    http.get<PaginatedResponse<User>>(`/taikhoan?page=${page}&per_page=${perPage}`),

  getOne: (id: number) => http.get<ApiResponse<User>>(`/taikhoan/${id}`),

  create: (body: CreateUserBody) => http.post<ApiResponse<User>>('/taikhoan', body),

  updateUser: (id: number, body: UpdateUserBody) =>
    http.put<ApiResponse<User>>(`/taikhoan/${id}`, body),

  delete: (id: number) => http.delete<ApiResponse<void>>(`/taikhoan/${id}`, {}),
    getById: (id: number | string) =>
    http.get<ApiResponse<UserDetailData>>(`/taikhoan/${id}`),
};
export default userService;

