<?php

namespace App\Repositories;

use App\Models\Lop;

class LopRepository
{
    public function getAll($perPage = null)
    {
        $query = Lop::query()->orderBy('tenLop', 'asc');
        
        if ($perPage) {
            return $query->paginate($perPage);
        }
        
        return $query->get();
    }

    public function getById(int $id)
    {
        return Lop::findOrFail($id);
    }

    public function create(array $data)
    {
        return Lop::create($data);
    }

    public function update(int $id, array $data)
    {
        $lop = Lop::findOrFail($id);
        $lop->update($data);
        return $lop;
    }

    public function delete(int $id)
    {
        $lop = Lop::findOrFail($id);
        return $lop->delete();
    }
}

