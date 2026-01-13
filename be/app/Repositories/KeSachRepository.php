<?php

namespace App\Repositories;

use App\Models\KeSach;

class KeSachRepository
{
  public function getAll($perPage)
  {
    return KeSach::with(['khu:idKhu,tenKhu'])
      ->paginate($perPage);
  }


  public function getById(int $id)
  {
    return KeSach::findOrFail($id);
  }

  public function create(array $data)
  {
    return KeSach::create($data);
  }

  public function update(int $id, array $data)
  {
    $keSach = KeSach::findOrFail($id);
    $keSach->update(attributes: $data);
    return $keSach;
  }

  public function delete(int $id)
  {
    $keSach = KeSach::findOrFail($id);
    return $keSach->delete();
  }
}
