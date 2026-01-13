<?php

namespace App\Repositories;

use App\Models\Khu;

class KhuRepository
{
    public function getAll($perPage)
    {
        return Khu::paginate($perPage);
    }

    public function getById(int $id)
    {
        return Khu::findOrFail($id);
    }

    public function create(array $data)
    {
        return Khu::create($data);
    }

    public function update(int $id, array $data)
    {
        $khu = Khu::findOrFail($id);
        $khu->update($data);
        return $khu;
    }

    public function delete(int $id)
    {
        $khu = Khu::findOrFail($id);
        $khu->keSaches()->delete();
        return $khu->delete();
    }
}
