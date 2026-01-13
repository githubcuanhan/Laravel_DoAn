import { z } from 'zod';
import {
  lopSchema,
  createLopBodySchema,
  updateLopBodySchema,
} from '@/lib/schemas/lop.schema';
import { ApiResponse } from './api.types';

// Schema types
export type Lop = z.infer<typeof lopSchema>;

// Body types
export type CreateLopBody = z.infer<typeof createLopBodySchema>;
export type UpdateLopBody = z.infer<typeof updateLopBodySchema>;

// Response types
export type LopResponse = ApiResponse<Lop>;
export type LopListResponse = ApiResponse<Lop[]>;

