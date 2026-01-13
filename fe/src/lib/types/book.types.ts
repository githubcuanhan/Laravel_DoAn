import { z } from 'zod';
import {
  sachSchema,
  hinhAnhSachSchema,
  keSachRefSchema,
  danhMucRefSchema,
  trangThaiSachEnum,
  createSachBodySchema,
  updateSachBodySchema,
  createHinhAnhSachBodySchema,
  updateHinhAnhSachBodySchema,
} from '@/lib/schemas/book.schema';
import type { ApiResponse } from './api.types';

// Schema types
export type Sach = z.infer<typeof sachSchema>;
export type HinhAnhSach = z.infer<typeof hinhAnhSachSchema>;
export type KeSachRef = z.infer<typeof keSachRefSchema>;
export type DanhMucRef = z.infer<typeof danhMucRefSchema>;
export type TrangThaiSach = z.infer<typeof trangThaiSachEnum>;

// Body types
export type CreateSachBody = z.infer<typeof createSachBodySchema>;
export type UpdateSachBody = z.infer<typeof updateSachBodySchema>;
export type CreateHinhAnhSachBody = z.infer<typeof createHinhAnhSachBodySchema>;
export type UpdateHinhAnhSachBody = z.infer<typeof updateHinhAnhSachBodySchema>;

// Response types
export type SachResponse = ApiResponse<Sach>;
export type SachListResponse = ApiResponse<Sach[]>;
export type HinhAnhSachResponse = ApiResponse<HinhAnhSach>;
export type HinhAnhSachListResponse = ApiResponse<HinhAnhSach[]>;

