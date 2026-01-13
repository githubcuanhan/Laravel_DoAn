import { z } from "zod";
import {
    cauHinhMuonTraSchema,
    createCauHinhMuonTraBodySchema,
    updateCauHinhMuonTraBodySchema,
} from "@/lib/schemas/cauHinhMuonTra.schema";

/**
 * CauHinhMuonTra type
 */
export type CauHinhMuonTra = z.infer<typeof cauHinhMuonTraSchema>;

/**
 * Create CauHinhMuonTra body type
 */
export type CreateCauHinhMuonTraBody = z.infer<typeof createCauHinhMuonTraBodySchema>;

/**
 * Update CauHinhMuonTra body type
 */
export type UpdateCauHinhMuonTraBody = z.infer<typeof updateCauHinhMuonTraBodySchema>;

