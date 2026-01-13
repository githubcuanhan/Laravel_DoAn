import http from "@/lib/http";
import { ApiResponse, PaginatedResponse } from "@/lib/types/api.types";
import type {
  Khu,
  CreateKhuBody,
  UpdateKhuBody,
} from "@/lib/types/library.types";

const areaService = {
  getAll: (page: number = 1, perPage: number = 10) =>
    http.get<PaginatedResponse<Khu>>(`/khu?page=${page}&per_page=${perPage}`),

  getOne: (id: number) => http.get<ApiResponse<Khu>>(`/khu/${id}`),

  create: (body: CreateKhuBody) => http.post<ApiResponse<Khu>>("/khu", body),

  update: (id: number, body: UpdateKhuBody) =>
    http.put<ApiResponse<Khu>>(`/khu/${id}`, body),

  delete: (id: number) => http.delete<ApiResponse<void>>(`/khu/${id}`, {}),
};

export default areaService;
