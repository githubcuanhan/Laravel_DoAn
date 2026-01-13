<?php

namespace App\Repositories;

use App\Models\Sach;
use Illuminate\Support\Facades\Log;

class BookRepository
{
    public function getAll($perPage = 10)
    {
        return Sach::with([
            'keSach:idKeSach,tenKe',
            'hinhAnhs:id,idSach,duongDan,is_cover,thuTu',
            'anhBia:id,idSach,duongDan,is_cover'
        ])->paginate($perPage);
    }


    public function getById(array $options)
    {
        $query = Sach::with([
            'keSach:idKeSach,tenKe',
            'hinhAnhs:id,idSach,duongDan,is_cover,thuTu',
            'anhBia:id,idSach,duongDan,is_cover',
            'danhMucs:idDanhmuc,tenDanhmuc,moTa'
        ]);

        if (isset($options['idSach'])) {
            return $query->findOrFail($options['idSach']);
        }

        if (isset($options['maSach'])) {
            return $query->where('maSach', $options['maSach'])->firstOrFail();
        }

        throw new \InvalidArgumentException('idSach hoặc maSach phải được truyền');
    }


    public function search(string $keyword)
    {
        return Sach::with([
            'keSach:idKeSach,tenKe',
            'hinhAnhs:id,idSach,duongDan,is_cover,thuTu',
            'anhBia:id,idSach,duongDan,is_cover',
            'danhMucs:idDanhmuc,tenDanhmuc,moTa'
        ])
            ->where('tenSach', 'LIKE', "%$keyword%")
            ->orWhere('tacGia', 'LIKE', "%$keyword%")
            ->orWhereHas('danhMucs', function ($q) use ($keyword) {
                $q->where('tenDanhmuc', 'LIKE', "%$keyword%");
            })
            ->limit(20)
            ->get();
    }


    public function getByCategory(int $categoryId, int $perPage = 10)
    {
        return Sach::with([
            'keSach:idKeSach,tenKe',
            'hinhAnhs:id,idSach,duongDan,is_cover,thuTu',
            'anhBia:id,idSach,duongDan,is_cover',
            'danhMucs:idDanhmuc,tenDanhmuc,moTa'
        ])
            ->whereHas('danhMucs', function ($query) use ($categoryId) {
                $query->where('danhmuc.idDanhmuc', $categoryId);
            })
            ->paginate($perPage);
    }



    public function getHero()
    {
        return Sach::with([
            'keSach:idKeSach,tenKe',
            'hinhAnhs:id,idSach,duongDan,is_cover,thuTu',
            'anhBia:id,idSach,duongDan,is_cover',
            'danhMucs:idDanhmuc,tenDanhmuc,moTa'
        ])
            ->inRandomOrder()
            ->limit(6)
            ->get();
    }


    public function create(array $data)
    {
        $images = $data['images'] ?? [];
        $idDanhMuc = $data['danhMucIds'] ?? null;
        unset($data['images']);

        $sach = Sach::create($data);

        foreach ($images as $index => $imgPath) {
            $sach->hinhAnhs()->create([
                'duongDan' => $imgPath,
                'thuTu' => $index,
                'is_cover' => $index === 0,
            ]);
        }

        if ($idDanhMuc) {
            $sach->danhMucs()->attach($idDanhMuc);
        }


        return $sach->load('hinhAnhs');
    }


    public function update(int $id, array $data)
    {
        $sach = Sach::findOrFail($id);

        $danhMucIds = $data['danhMucIds'] ?? null;
        unset($data['danhMucIds']);
        $images = $data['images'] ?? null;
        unset($data['images']);
        $sach->update($data);

        if ($images !== null) {
            $sach->hinhAnhs()->delete();

            foreach ($images as $index => $img) {
                $sach->hinhAnhs()->create([
                    'duongDan' => $img,
                    'is_cover' => false,
                    'is_cover' => $index === 0,
                ]);
            }
        }
        if ($danhMucIds !== null) {
            $sach->danhMucs()->sync([$danhMucIds]);
        }
        return $sach->load('hinhAnhs');
    }


    public function delete(int $id)
    {
        $sach = Sach::findOrFail($id);
        return $sach->delete();
    }
}
