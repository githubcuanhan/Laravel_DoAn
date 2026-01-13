<?php

namespace App\Repositories;

use App\Models\DanhMuc;
use App\Models\Sach;
use Illuminate\Support\Facades\Log;

class DanhMucRepository
{
  public function getAll($perPage)
  {
    return DanhMuc::paginate($perPage);
  }


  public function getById(int $id)
  {
    return DanhMuc::findOrFail($id);
  }

  public function create(array $data)
  {
    return DanhMuc::create($data);
  }


  public function update(int $id, array $data)
  {
    $danhMuc = DanhMuc::findOrFail($id);
    $danhMuc->update($data);
    return $danhMuc;
  }

  public function delete(int $id)
  {
    $danhMuc = DanhMuc::findOrFail($id);
    return $danhMuc->delete();
  }
}
