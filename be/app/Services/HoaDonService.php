<?php

namespace App\Services;

use App\Repositories\HoaDonRepository;

class HoaDonService
{
    protected HoaDonRepository $repo;

    public function __construct(HoaDonRepository $repo)
    {
        $this->repo = $repo;
    }

    public function list($perPage = 10)
    {
        return $this->repo->getAll($perPage);
    }

    public function get(int $id)
    {
        return $this->repo->getById($id);
    }

    public function updateStatus(int $id, string $trangThai)
    {
        if (!in_array($trangThai, ['chua_thanh_toan', 'da_thanh_toan'])) {
            throw new \Exception('Trạng thái không hợp lệ');
        }

        return $this->repo->updateStatus($id, $trangThai);
    }

    public function delete(int $id)
    {
        return $this->repo->delete($id);
    }
}

