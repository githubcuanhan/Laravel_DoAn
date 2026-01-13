<?php

namespace App\Services;

use App\Repositories\DanhMucRepository;

class DanhMucService
{
    protected DanhMucRepository $repo;

    public function __construct(DanhMucRepository $repo)
    {
        $this->repo = $repo;
    }

    public function list($perPage)
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

