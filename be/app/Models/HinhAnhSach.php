<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HinhAnhSach extends Model
{
    use HasFactory;

    protected $table = 'hinh_anh_sach';
    protected $fillable = [
        'idSach',
        'duongDan',
        'tieuDe',
        'is_cover',
        'thuTu'
    ];

    protected $casts = [
        'is_cover' => 'boolean',
    ];

    /**
     * Quan hệ với Sach
     */
    public function sach()
    {
        return $this->belongsTo(Sach::class, 'idSach', 'idSach');
    }
}
