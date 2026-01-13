<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sach extends Model
{
    use HasFactory;

    protected $table = 'sach';
    protected $primaryKey = 'idSach';
    protected $fillable = [
        'maSach',
        'maQR',
        'tenSach',
        'tacGia',
        'idTheLoai',
        'idNhaXuatBan',
        'namXuatBan',
        'soLuong',
        'soLuongKhaDung', //
        'sizesach',
        'trangThai',
        'moTa',
        'hinhAnh',
        'idKeSach'
];

    /**
     * Quan hệ với KeSach
     */
    public function keSach()
    {
        return $this->belongsTo(KeSach::class, 'idKeSach', 'idKeSach');
    }

    /**
     * Quan hệ với ChiTietDanhMuc
     */
    public function chiTietDanhMucs()
    {
        return $this->hasMany(ChiTietDanhMuc::class, 'idSach', 'idSach');
    }

    /**
     * Quan hệ với DanhMuc qua ChiTietDanhMuc
     */
    public function danhMucs()
    {
        return $this->belongsToMany(DanhMuc::class, 'chitietdanhmuc', 'idSach', 'idDanhmuc');
    }

    /**
     * Quan hệ với ChiTietPhieuMuon
     */
    public function chiTietPhieuMuons()
    {
        return $this->hasMany(ChiTietPhieuMuon::class, 'idSach', 'idSach');
    }

    /**
     * Quan hệ với HinhAnhSach
     */
    public function hinhAnhs()
    {
        return $this->hasMany(HinhAnhSach::class, 'idSach', 'idSach');
    }

    /**
     * Lấy ảnh bìa
     */
    public function anhBia()
    {
        return $this->hasOne(HinhAnhSach::class, 'idSach', 'idSach')->where('is_cover', true);
    }
}
