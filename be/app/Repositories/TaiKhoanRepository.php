<?php

namespace App\Repositories;

use App\Models\TaiKhoan;
use Illuminate\Support\Facades\Hash;

class TaiKhoanRepository
{
    public function getAll($perPage = 10)
    {
        return TaiKhoan::with('lop:idLop,tenLop')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function getById(int $id)
    {
        return TaiKhoan::with('lop:idLop,tenLop')->findOrFail($id);
    }

    public function create(array $data): TaiKhoan
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        return TaiKhoan::create($data);
    }

    public function update(int $id, array $data)
    {
        $taiKhoan = TaiKhoan::findOrFail($id);

        // Nếu có password mới thì hash, không thì bỏ qua
        if (isset($data['password']) && !empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $taiKhoan->update($data);
        return $taiKhoan->load('lop:idLop,tenLop');
    }

    public function delete(int $id)
    {
        $taiKhoan = TaiKhoan::findOrFail($id);
        return $taiKhoan->delete();
    }

    public function findByEmail(string $email): ?TaiKhoan
    {
        return TaiKhoan::where('email', $email)->first();
    }

    public function findByUsername(string $username): ?TaiKhoan
    {
        return TaiKhoan::where('tenDangNhap', $username)->first();
    }
}
