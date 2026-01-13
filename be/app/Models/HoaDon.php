<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class HoaDon extends Model
{
    use HasFactory;

    protected $table = 'hoadon';
    protected $primaryKey = 'idHoadon'; // Đảm bảo chỉ có 1 dòng này ở đầu class

    protected $fillable = [
        'idNguoiThu',
        'idNguoiBiThu',
        'loaiHoadon',
        'ngayLap',
        'trangThai',
        'tongTien',
        'ghiChu'
    ];

    public function nguoiThu()
    {
        return $this->belongsTo(TaiKhoan::class, 'idNguoiThu', 'id');
    }

    public function nguoiBiThu()
    {
        return $this->belongsTo(TaiKhoan::class, 'idNguoiBiThu', 'id');
    }

    public function chiTietHoaDons()
    {
        return $this->hasMany(ChiTietHoaDon::class, 'idHoadon', 'idHoadon');
    }
}
