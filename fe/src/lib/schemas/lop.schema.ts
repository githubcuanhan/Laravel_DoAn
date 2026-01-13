import { z } from 'zod';

// Lop Schema
export const lopSchema = z.object({
  idLop: z.number(),
  tenLop: z.string(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// Create Lop Body Schema
export const createLopBodySchema = z.object({
  tenLop: z.string().min(1, 'Tên lớp là bắt buộc').max(255, 'Tên lớp không được quá 255 ký tự'),
});

// Update Lop Body Schema
export const updateLopBodySchema = z.object({
  tenLop: z.string().min(1, 'Tên lớp là bắt buộc').max(255, 'Tên lớp không được quá 255 ký tự'),
});

