<?php

namespace App\Services;

use App\Repositories\CauHinhMuonTraRepository;

class CauHinhMuonTraService
{
    protected $cauHinhMuonTraRepository;

    public function __construct(CauHinhMuonTraRepository $cauHinhMuonTraRepository)
    {
        $this->cauHinhMuonTraRepository = $cauHinhMuonTraRepository;
    }

    /**
     * Get all configurations
     */
    public function getAll($perPage = null)
    {
        return $this->cauHinhMuonTraRepository->getAll($perPage);
    }

    /**
     * Get configuration by ID
     */
    public function getById(int $id)
    {
        return $this->cauHinhMuonTraRepository->getById($id);
    }

    /**
     * Get current active configuration
     */
    public function getCurrentConfig()
    {
        return $this->cauHinhMuonTraRepository->getCurrentConfig();
    }

    /**
     * Create new configuration
     */
    public function create(array $data)
    {
        return $this->cauHinhMuonTraRepository->create($data);
    }

    /**
     * Update configuration
     */
    public function update(int $id, array $data)
    {
        return $this->cauHinhMuonTraRepository->update($id, $data);
    }

    /**
     * Delete configuration
     */
    public function delete(int $id)
    {
        return $this->cauHinhMuonTraRepository->delete($id);
    }
}

