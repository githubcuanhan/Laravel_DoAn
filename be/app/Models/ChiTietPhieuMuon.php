<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChiTietPhieuMuon extends Model
{
    use HasFactory;

    protected $table = 'chitietphieumuon';
    protected $primaryKey = 'idCTPhieumuon';
    protected $fillable = [
        'idPhieumuon',
        'idSach',
        'ngayMuon',
        'hanTra',
        'ngayTraThucTe',
        'soNgayTre',
        'tienPhat',
        'soLuong',
        'trangThai'
    ];

    protected $casts = [
        'ngayMuon' => 'date',
        'hanTra' => 'date',
        'ngayTraThucTe' => 'date',
        'tienPhat' => 'decimal:2',
    ];

    /**
     * Quan hệ với PhieuMuon
     */
    public function phieuMuon()
    {
        return $this->belongsTo(PhieuMuon::class, 'idPhieumuon', 'idPhieumuon');
    }

    /**
     * Quan hệ với Sach
     */
    public function sach()
    {
        return $this->belongsTo(Sach::class, 'idSach', 'idSach');
    }

    /**
     * Quan hệ với GiaHan
     */
    public function giaHans()
    {
        return $this->hasMany(GiaHan::class, 'idCTPhieumuon', 'idCTPhieumuon');
    }

    /**
     * Quan hệ với ChiTietHoaDon
     */
    public function chiTietHoaDons()
    {
        return $this->hasMany(ChiTietHoaDon::class, 'idCTPhieumuon', 'idCTPhieumuon');
    }
}
