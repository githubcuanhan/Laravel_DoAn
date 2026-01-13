<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class ChiTietHoaDon extends Model
{
    use HasFactory;
    protected $table = 'chitiethoadon';

    // BẮT BUỘC: Laravel không hỗ trợ mảng làm Primary Key, hãy để null
    protected $primaryKey = null; 
    public $incrementing = false;
    public $timestamps = true; 

    protected $fillable = [
        'idHoadon',
        'idCTPhieumuon',
        'soTienPhat',
        'soNgayTre',
        'trangThai'
    ];

    public function chiTietPhieuMuon()
    {
        return $this->belongsTo(ChiTietPhieuMuon::class, 'idCTPhieumuon', 'idCTPhieumuon');
    }
    // app/Models/ChiTietHoaDon.php

    public function hoaDon()
    {
        // idHoadon là khóa ngoại trong bảng chitiethoadon kết nối với bảng hoadon
        return $this->belongsTo(HoaDon::class, 'idHoadon', 'idHoadon');
    }
}