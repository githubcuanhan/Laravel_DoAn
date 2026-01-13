import { z } from "zod";

/**
 * Schema for CauHinhMuonTra (Borrow/Return Configuration)
 */
export const cauHinhMuonTraSchema = z.object({
    id: z.number(),
    soNgayToiDa: z.number().int().positive(),
    mucPhatMoiNgay: z.number().nonnegative(),
    apDungTuNgay: z.string(),
    apDungDenNgay: z.string().nullable(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

/**
 * Schema for creating CauHinhMuonTra
 */
export const createCauHinhMuonTraBodySchema = z.object({
    soNgayToiDa: z
        .number({
            required_error: "Số ngày tối đa là bắt buộc",
            invalid_type_error: "Số ngày tối đa phải là số",
        })
        .int({ message: "Số ngày tối đa phải là số nguyên" })
        .min(1, { message: "Số ngày tối đa phải ít nhất là 1" })
        .max(365, { message: "Số ngày tối đa không được vượt quá 365" }),
    
    mucPhatMoiNgay: z
        .number({
            required_error: "Mức phạt mỗi ngày là bắt buộc",
            invalid_type_error: "Mức phạt mỗi ngày phải là số",
        })
        .nonnegative({ message: "Mức phạt mỗi ngày không được âm" }),
    
    apDungTuNgay: z
        .string({
            required_error: "Ngày áp dụng là bắt buộc",
        })
        .min(1, { message: "Ngày áp dụng là bắt buộc" }),
    
    apDungDenNgay: z
        .string()
        .nullable()
        .optional(),
}).refine(
    (data) => {
        if (data.apDungDenNgay) {
            const fromDate = new Date(data.apDungTuNgay);
            const toDate = new Date(data.apDungDenNgay);
            return toDate >= fromDate;
        }
        return true;
    },
    {
        message: "Ngày kết thúc phải sau hoặc bằng ngày áp dụng",
        path: ["apDungDenNgay"],
    }
);

/**
 * Schema for updating CauHinhMuonTra
 */
export const updateCauHinhMuonTraBodySchema = createCauHinhMuonTraBodySchema;

