import http from '@/lib/http';
import { ApiResponse, PaginatedResponse } from '@/lib/types/api.types';
import type {
    CauHinhMuonTra,
    CreateCauHinhMuonTraBody,
    UpdateCauHinhMuonTraBody,
} from '@/lib/types/cauHinhMuonTra.types';

const cauHinhMuonTraService = {
    /**
     * Get all configurations (with or without pagination)
     */
    getAll: (page?: number, perPage?: number) => {
        if (page && perPage) {
            return http.get<PaginatedResponse<CauHinhMuonTra>>(
                `/cauhinh-muontra?page=${page}&per_page=${perPage}`
            );
        }
        // No pagination - get all
        return http.get<ApiResponse<CauHinhMuonTra[]>>('/cauhinh-muontra');
    },

    /**
     * Get configuration by ID
     */
    getOne: (id: number) =>
        http.get<ApiResponse<CauHinhMuonTra>>(`/cauhinh-muontra/${id}`),

    /**
     * Get current active configuration
     */
    getCurrent: () =>
        http.get<ApiResponse<CauHinhMuonTra>>('/cauhinh-muontra/current'),

    /**
     * Create new configuration
     */
    create: (body: CreateCauHinhMuonTraBody) =>
        http.post<ApiResponse<CauHinhMuonTra>>('/cauhinh-muontra', body),

    /**
     * Update configuration
     */
    update: (id: number, body: UpdateCauHinhMuonTraBody) =>
        http.put<ApiResponse<CauHinhMuonTra>>(`/cauhinh-muontra/${id}`, body),

    /**
     * Delete configuration
     */
    delete: (id: number) =>
        http.delete<ApiResponse<void>>(`/cauhinh-muontra/${id}`, {}),
};

export default cauHinhMuonTraService;

