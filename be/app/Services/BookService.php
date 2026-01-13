<?php

namespace App\Services;

use App\Repositories\BookRepository;

class BookService
{
    protected BookRepository $repo;

    public function __construct(BookRepository $repo)
    {
        $this->repo = $repo;
    }

    public function list($perPage = 10)
    {
        return $this->repo->getAll($perPage);
    }
    public function search(string $keyword)
    {
        return $this->repo->search($keyword);
    }

    public function get(array $options)
    {
        return $this->repo->getById($options);
    }

    public function category(int $id, $perPage)
    {
        return $this->repo->getByCategory($id, $perPage);
    }

    public function hero()
    {
        return $this->repo->getHero();
    }

    public function create(array $data)
    {
        return $this->repo->create($data);
    }

    public function update(int $id, array $data)
    {
        return $this->repo->update($id, $data);
    }

    public function delete(int $id)
    {
        return $this->repo->delete($id);
    }
}
