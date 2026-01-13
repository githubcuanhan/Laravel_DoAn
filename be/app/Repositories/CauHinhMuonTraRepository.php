<?php

namespace App\Repositories;

use App\Models\CauHinhMuonTra;

class CauHinhMuonTraRepository
{
    /**
     * Get all configurations with optional pagination
     */
    public function getAll($perPage = null)
    {
        $query = CauHinhMuonTra::query()->orderBy('apDungTuNgay', 'desc');
        
        if ($perPage) {
            return $query->paginate($perPage);
        }
        
        return $query->get();
    }

    /**
     * Get configuration by ID
     */
    public function getById(int $id)
    {
        return CauHinhMuonTra::findOrFail($id);
    }

    /**
     * Get current active configuration
     */
    public function getCurrentConfig()
    {
        $today = now()->toDateString();
        
        return CauHinhMuonTra::where('apDungTuNgay', '<=', $today)
            ->where(function ($query) use ($today) {
                $query->where('apDungDenNgay', '>=', $today)
                      ->orWhereNull('apDungDenNgay');
            })
            ->orderBy('apDungTuNgay', 'desc')
            ->first();
    }

    /**
     * Create new configuration
     */
    public function create(array $data)
    {
        return CauHinhMuonTra::create($data);
    }

    /**
     * Update configuration
     */
    public function update(int $id, array $data)
    {
        $config = CauHinhMuonTra::findOrFail($id);
        $config->update($data);
        return $config;
    }

    /**
     * Delete configuration
     */
    public function delete(int $id)
    {
        $config = CauHinhMuonTra::findOrFail($id);
        return $config->delete();
    }
}

