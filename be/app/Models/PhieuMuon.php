<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhieuMuon extends Model
{
    use HasFactory;

    protected $table = 'phieumuon';
    protected $primaryKey = 'idPhieumuon';
    protected $fillable = [
        'idNguoiMuon',
        'idNguoiTao',
        'ngayMuon',
        'hanTra',
        'trangThai',
        'ghiChu',
    ];

    protected $casts = [
        'ngayMuon' => 'date',
        'hanTra' => 'date',
    ];

    /**
     * Quan hệ với TaiKhoan (người mượn)
     */
    public function nguoiMuon()
    {
        return $this->belongsTo(TaiKhoan::class, 'idNguoiMuon', 'id');
    }

    /**
     * Quan hệ với TaiKhoan (người tạo)
     */
    public function nguoiTao()
    {
        return $this->belongsTo(TaiKhoan::class, 'idNguoiTao', 'id');
    }

    /**
     * Quan hệ với ChiTietPhieuMuon
     */
    public function chiTietPhieuMuons()
    {
        // idPhieumuon là khóa chính trong bảng phieumuon của bạn
        return $this->hasMany(ChiTietPhieuMuon::class, 'idPhieumuon', 'idPhieumuon');
    }
// app/Models/PhieuMuon.php
    public function giaHans() {
        return $this->hasManyThrough(
            \App\Models\GiaHan::class, 
            \App\Models\ChiTietPhieuMuon::class, 
            'idPhieumuon',    // Khóa ngoại trên bảng chi tiết
            'idCTPhieumuon',  // Khóa ngoại trên bảng gia hạn
            'idPhieumuon',    // Khóa chính trên bảng phiếu mượn
            'idCTPhieumuon'   // Khóa chính trên bảng chi tiết
        );
    }
}
