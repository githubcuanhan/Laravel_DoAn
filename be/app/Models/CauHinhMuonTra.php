<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CauHinhMuonTra extends Model
{
    use HasFactory;

    protected $table = 'cauhinh_muontra';
    protected $fillable = [
        'soNgayToiDa',
        'mucPhatMoiNgay',
        'apDungTuNgay',
        'apDungDenNgay'
    ];

    protected $casts = [
        'apDungTuNgay' => 'date',
        'apDungDenNgay' => 'date',
        'mucPhatMoiNgay' => 'decimal:0',
    ];
}
