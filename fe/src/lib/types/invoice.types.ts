import { z } from 'zod';
import {
  hoaDonSchema,
  chiTietHoaDonSchema,
  loaiHoaDonEnum,
  trangThaiHoaDonEnum,
  trangThaiChiTietHoaDonEnum,
  createHoaDonBodySchema,
  updateHoaDonBodySchema,
  thanhToanHoaDonBodySchema,
} from '@/lib/schemas/invoice.schema';
import type { ApiResponse } from './api.types';

// Schema types
export type HoaDon = z.infer<typeof hoaDonSchema>;
export type ChiTietHoaDon = z.infer<typeof chiTietHoaDonSchema>;
export type LoaiHoaDon = z.infer<typeof loaiHoaDonEnum>;
export type TrangThaiHoaDon = z.infer<typeof trangThaiHoaDonEnum>;
export type TrangThaiChiTietHoaDon = z.infer<typeof trangThaiChiTietHoaDonEnum>;

// Body types
export type CreateHoaDonBody = z.infer<typeof createHoaDonBodySchema>;
export type UpdateHoaDonBody = z.infer<typeof updateHoaDonBodySchema>;
export type ThanhToanHoaDonBody = z.infer<typeof thanhToanHoaDonBodySchema>;

// Response types
export type HoaDonResponse = ApiResponse<HoaDon>;
export type HoaDonListResponse = ApiResponse<HoaDon[]>;
export type ChiTietHoaDonResponse = ApiResponse<ChiTietHoaDon>;

