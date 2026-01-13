<?php

namespace App\Services;

use App\Repositories\KhuRepository;

class KhuService
{
    protected $repo;

    public function __construct(KhuRepository $repo)
    {
        $this->repo = $repo;
    }

    public function listKhu($perPage)
    {
        return $this->repo->getAll($perPage);
    }

    public function getKhu(int $id)
    {
        return $this->repo->getById($id);
    }

    public function createKhu(array $data)
    {
        return $this->repo->create($data);
    }

    public function updateKhu(int $id, array $data)
    {
        return $this->repo->update($id, $data);
    }

    public function deleteKhu(int $id)
    {
        return $this->repo->delete($id);
    }
}
