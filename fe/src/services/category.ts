import http from "@/lib/http";
import { ApiResponse, PaginatedResponse } from "@/lib/types/api.types";
import type {
  DanhMuc,
  CreateDanhMucBody,
  UpdateDanhMucBody,
} from "@/lib/types/library.types";

const categoryService = {
  getAll: (page: number = 1, perPage: number = 10) =>
    http.get<PaginatedResponse<DanhMuc>>(`/danhmuc?page=${page}&per_page=${perPage}`),

  getOne: (id: number) => http.get<ApiResponse<DanhMuc>>(`/danhmuc/${id}`),

  create: (body: CreateDanhMucBody) => http.post<ApiResponse<DanhMuc>>("/danhmuc", body),

  update: (id: number, body: UpdateDanhMucBody) =>
    http.put<ApiResponse<DanhMuc>>(`/danhmuc/${id}`, body),

  delete: (id: number) => http.delete<ApiResponse<void>>(`/danhmuc/${id}`, {}),
};

export default categoryService;
