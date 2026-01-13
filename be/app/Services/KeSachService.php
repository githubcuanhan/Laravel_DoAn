<?php

namespace App\Services;

use App\Repositories\KeSachRepository;

class KeSachService
{
    protected $repo;

    public function __construct(KeSachRepository $repo)
    {
        $this->repo = $repo;
    }

    public function listKeSach($perPage)
    {
        return $this->repo->getAll($perPage);
    }

    public function getKeSach(int $id)
    {
        return $this->repo->getById($id);
    }

    public function createKeSach(array $data)
    {
        return $this->repo->create($data);
    }

    public function updateKeSach(int $id, array $data)
    {
        return $this->repo->update($id, $data);
    }

    public function deleteKeSach(int $id)
    {
        return $this->repo->delete($id);
    }
}
