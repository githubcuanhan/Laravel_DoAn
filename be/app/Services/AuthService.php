<?php

namespace App\Services;

use App\Repositories\TaiKhoanRepository;
use Illuminate\Support\Facades\Hash;
use App\Models\TaiKhoan;
use App\Models\ThuThu;
use App\Models\BanDoc;

class AuthService
{
    protected $taiKhoanRepo;

    public function __construct(TaiKhoanRepository $repo)
    {
        $this->taiKhoanRepo = $repo;
    }

    public function register(array $data): TaiKhoan
    {
        $user = $this->taiKhoanRepo->create($data);

        if ($user->vaiTro === 'thuthu') {
            ThuThu::create([
                'idTaikhoan' => $user->idTaikhoan,
                'hoTen' => $data['hoTen'] ?? $user->tenDangNhap,
                'email' => $user->email
            ]);
        } elseif ($user->vaiTro === 'bandoc') {
            BanDoc::create([
                'idTaiKhoan' => $user->idTaikhoan,
                'maSinhVien' => $data['maSinhVien'] ?? 'SV' . rand(1000, 9999)
            ]);
        }

        return $user;
    }
    public function login(string $email, string $password): ?TaiKhoan
    {
        $user = $this->taiKhoanRepo->findByEmail($email);

        if (!$user || !Hash::check($password, $user->matKhau)) {
            return null;
        }

        return $user;
    }

    public function createToken(TaiKhoan $user, string $type = 'access'): string
    {
        $tokenName = $type === 'refresh' ? 'refresh_token' : 'auth_token';
        $abilities = $type === 'refresh' ? ['refresh'] : ['*'];
        return $user->createToken($tokenName, $abilities)->plainTextToken;
    }

    public function refreshToken(TaiKhoan $user): array
    {
        $user->tokens()->where('name', 'refresh_token')->delete();

        $accessToken = $this->createToken($user, 'access');

        $refreshToken = $this->createToken($user, 'refresh');

        return [
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
            'token_type' => 'Bearer'
        ];
    }
}
