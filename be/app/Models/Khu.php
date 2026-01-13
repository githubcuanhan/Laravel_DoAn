<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Khu extends Model
{
    use HasFactory;

    protected $table = 'khu';
    protected $primaryKey = 'idKhu';
    protected $fillable = ['tenKhu', 'viTri', 'moTa'];

    public function keSaches()
    {
        return $this->hasMany(KeSach::class, 'idKhu', 'idKhu');
    }
}
