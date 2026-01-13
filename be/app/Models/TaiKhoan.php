<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Notifications\Notifiable;

class TaiKhoan extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $table = 'taikhoan';
    protected $primaryKey = 'id';
    protected $fillable = [
        'email',
        'password',
        'vaiTro',
        'hoTen',
        'soDienThoai',
        'ngaySinh',
        'diaChi',
        'idLop',
        'maSinhVien',
        'trangThai',
        'last_login_at'
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'ngaySinh' => 'date',
        'last_login_at' => 'datetime',
    ];

    /**
     * Quan hệ với Lop
     */
    public function lop()
    {
        return $this->belongsTo(Lop::class, 'idLop', 'idLop');
    }

    /**
     * Quan hệ với PhieuMuon (người mượn)
     */
    public function phieuMuonNguoiMuon()
    {
        return $this->hasMany(PhieuMuon::class, 'idNguoiMuon', 'id');
    }

    /**
     * Quan hệ với PhieuMuon (người tạo)
     */
    public function phieuMuonNguoiTao()
    {
        return $this->hasMany(PhieuMuon::class, 'idNguoiTao', 'id');
    }

    /**
     * Quan hệ với HoaDon (người thu)
     */
    public function hoaDonNguoiThu()
    {
        return $this->hasMany(HoaDon::class, 'idNguoiThu', 'id');
    }

    /**
     * Quan hệ với HoaDon (người bị thu)
     */
    public function hoaDonNguoiBiThu()
    {
        return $this->hasMany(HoaDon::class, 'idNguoiBiThu', 'id');
    }

    /**
     * Quan hệ với RefreshToken
     */
    public function refreshTokens()
    {
        return $this->hasMany(RefreshToken::class, 'idTaiKhoan', 'id');
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}
