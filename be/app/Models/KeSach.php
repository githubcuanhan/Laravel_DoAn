<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KeSach extends Model
{
    use HasFactory;

    protected $table = 'kesach';
    protected $primaryKey = 'idKeSach';
    protected $fillable = ['idKhu', 'tenKe', 'moTa'];

    /**
     * Quan hệ với Khu
     */
    public function khu()
    {
        return $this->belongsTo(Khu::class, 'idKhu', 'idKhu');
    }

    /**
     * Quan hệ với Sach
     */
    public function saches()
    {
        return $this->hasMany(Sach::class, 'idKeSach', 'idKeSach');
    }
}
