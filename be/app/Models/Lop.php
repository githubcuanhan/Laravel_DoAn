<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lop extends Model
{
    use HasFactory;

    protected $table = 'lop';
    protected $primaryKey = 'idLop';
    protected $fillable = ['tenLop'];

    /**
     * Quan hệ với TaiKhoan
     */
    public function taiKhoans()
    {
        return $this->hasMany(TaiKhoan::class, 'idLop', 'idLop');
    }
}
