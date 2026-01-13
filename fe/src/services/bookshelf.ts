import http from "@/lib/http";
import { ApiResponse, PaginatedResponse } from "@/lib/types/api.types";
import type {
  KeSach,
  CreateKeSachBody,
  UpdateKeSachBody,
} from "@/lib/types/library.types";

const bookshelfService = {
  getAll: (page: number = 1, perPage: number = 10) =>
    http.get<PaginatedResponse<KeSach>>(`/bookshelf?page=${page}&per_page=${perPage}`),

  getOne: (id: number) => http.get<ApiResponse<KeSach>>(`/bookshelf/${id}`),

  create: (body: CreateKeSachBody) => http.post<ApiResponse<KeSach>>("/bookshelf", body),

  update: (id: number, body: UpdateKeSachBody) =>
    http.put<ApiResponse<KeSach>>(`/bookshelf/${id}`, body),

  delete: (id: number) => http.delete<ApiResponse<void>>(`/bookshelf/${id}`, {}),
};

export default bookshelfService;
