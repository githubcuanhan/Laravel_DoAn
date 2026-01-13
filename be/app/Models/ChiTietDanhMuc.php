<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChiTietDanhMuc extends Model
{
    use HasFactory;

    protected $table = 'chitietdanhmuc';
    public $incrementing = false;
    public $timestamps = false;

    protected $primaryKey = ['idSach', 'idDanhmuc'];
    protected $fillable = ['idSach', 'idDanhmuc'];

    public function sach()
    {
        return $this->belongsTo(Sach::class, 'idSach', 'idSach');
    }

    public function danhMuc()
    {
        return $this->belongsTo(DanhMuc::class, 'idDanhmuc', 'idDanhmuc');
    }
}
