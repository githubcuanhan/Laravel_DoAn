import http from '@/lib/http';
import { ApiResponse, PaginatedResponse } from '@/lib/types/api.types';
import type { Lop, CreateLopBody, UpdateLopBody } from '@/lib/types/lop.types';

const lopService = {
  // Get all (với hoặc không pagination)
  getAll: (page?: number, perPage?: number) => {
    if (page && perPage) {
      return http.get<PaginatedResponse<Lop>>(`/lop?page=${page}&per_page=${perPage}`);
    }
    // Không pagination - lấy tất cả
    return http.get<ApiResponse<Lop[]>>('/lop');
  },

  getOne: (id: number) => http.get<ApiResponse<Lop>>(`/lop/${id}`),

  create: (body: CreateLopBody) => http.post<ApiResponse<Lop>>('/lop', body),

  update: (id: number, body: UpdateLopBody) =>
    http.put<ApiResponse<Lop>>(`/lop/${id}`, body),

  delete: (id: number) => http.delete<ApiResponse<void>>(`/lop/${id}`, {}),
};

export default lopService;

