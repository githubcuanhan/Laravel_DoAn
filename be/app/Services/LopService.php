<?php

namespace App\Services;

use App\Repositories\LopRepository;

class LopService
{
    protected LopRepository $repo;

    public function __construct(LopRepository $repo)
    {
        $this->repo = $repo;
    }

    public function list($perPage = null)
    {
        return $this->repo->getAll($perPage);
    }

    public function get(int $id)
    {
        return $this->repo->getById($id);
    }

    public function create(array $data)
    {
        return $this->repo->create($data);
    }

    public function update(int $id, array $data)
    {
        return $this->repo->update($id, $data);
    }

    public function delete(int $id)
    {
        return $this->repo->delete($id);
    }
}

