<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DanhMuc extends Model
{
    use HasFactory;

    protected $table = 'danhmuc';
    protected $primaryKey = 'idDanhmuc';
    protected $fillable = ['tenDanhmuc', 'moTa'];

    /**
     * Quan hệ với ChiTietDanhMuc
     */
    public function chiTietDanhMucs()
    {
        return $this->hasMany(ChiTietDanhMuc::class, 'idDanhmuc', 'idDanhmuc');
    }

    /**
     * Quan hệ với Sach qua ChiTietDanhMuc
     */
    public function saches()
    {
        return $this->belongsToMany(Sach::class, 'chitietdanhmuc', 'idDanhmuc', 'idSach');
    }
}
