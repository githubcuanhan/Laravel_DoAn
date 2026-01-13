import { z } from 'zod';
import {
  phieuMuonSchema,
  chiTietPhieuMuonSchema,
  giaHanSchema,
  trangThaiPhieuMuonEnum,
  trangThaiChiTietPhieuMuonEnum,
  createPhieuMuonBodySchema,
  updatePhieuMuonBodySchema,
  traSachBodySchema,
  giaHanPhieuMuonBodySchema,
} from '@/lib/schemas/borrow.schema';
import type { ApiResponse } from './api.types';

// Schema types
export type PhieuMuon = z.infer<typeof phieuMuonSchema>;
export type ChiTietPhieuMuon = z.infer<typeof chiTietPhieuMuonSchema>;
export type GiaHan = z.infer<typeof giaHanSchema>;
export type TrangThaiPhieuMuon = z.infer<typeof trangThaiPhieuMuonEnum>;
export type TrangThaiChiTietPhieuMuon = z.infer<
  typeof trangThaiChiTietPhieuMuonEnum
>;

// Body types
export type CreatePhieuMuonBody = z.infer<typeof createPhieuMuonBodySchema>;
export type UpdatePhieuMuonBody = z.infer<typeof updatePhieuMuonBodySchema>;
export type TraSachBody = z.infer<typeof traSachBodySchema>;
export type GiaHanPhieuMuonBody = z.infer<typeof giaHanPhieuMuonBodySchema>;

// Response types
export type PhieuMuonResponse = ApiResponse<PhieuMuon>;
export type PhieuMuonListResponse = ApiResponse<PhieuMuon[]>;
export type ChiTietPhieuMuonResponse = ApiResponse<ChiTietPhieuMuon>;
export type GiaHanResponse = ApiResponse<GiaHan>;

