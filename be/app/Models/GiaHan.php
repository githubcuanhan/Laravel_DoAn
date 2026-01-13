<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GiaHan extends Model
{
    use HasFactory;

    protected $table = 'giahan';
    protected $primaryKey = 'idGiahan';
    protected $fillable = [
        'idCTPhieumuon',
        'ngayGiaHan',
        'hanTraMoi',
        'lyDo'
    ];

    protected $casts = [
        'ngayGiaHan' => 'date',
        'hanTraMoi' => 'date',
    ];

    /**
     * Quan hệ với ChiTietPhieuMuon
     */
    public function chiTietPhieuMuon()
    {
        return $this->belongsTo(ChiTietPhieuMuon::class, 'idCTPhieumuon', 'idCTPhieumuon');
    }
}
