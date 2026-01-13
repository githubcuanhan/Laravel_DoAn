import http from "@/lib/http";
import { ApiResponse, PaginatedResponse } from "@/lib/types/api.types";
import type {
  Sach,
  CreateSachBody,
  UpdateSachBody,
} from "@/lib/types/book.types";

const bookService = {
  getAll: (page: number = 1, perPage: number = 10) =>
    http.get<PaginatedResponse<Sach>>(`/sach?page=${page}&per_page=${perPage}`),

  getOne: (id: string | number) => http.get<ApiResponse<Sach>>(`/sach/${id}`),

  getHero:() => http.get<ApiResponse<Sach>>(`/sach/hero`),

  searchBooks: (query: string) =>
    http.get<ApiResponse<Sach[]>>(`/sach/search?query=${query}`),

  getByCategory:(id: number,page: number = 1, perPage: number = 10) =>
    http.get<PaginatedResponse<Sach>>(`/sach/category/${id}?page=${page}&per_page=${perPage}`),

  create: (body: CreateSachBody) => http.post<ApiResponse<Sach>>("/sach", body),

  update: (id: number, body: UpdateSachBody) =>
    http.put<ApiResponse<Sach>>(`/sach/${id}`, body),

  delete: (id: number) => http.delete<ApiResponse<void>>(`/sach/${id}`, {}),
};

export default bookService;
