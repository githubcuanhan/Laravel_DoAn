<?php

namespace App\Services;

use App\Repositories\DashboardRepository;

class DashboardService
{
    protected DashboardRepository $repo;

    public function __construct(DashboardRepository $repo)
    {
        $this->repo = $repo;
    }

    public function getDashboardData()
    {
        return [
            'kpi'          => $this->repo->getKPI(),
            'borrowStats'  => $this->repo->getBorrowStats(),
            'fineStats'    => $this->repo->getFineStats(),
            'topBooks'     => $this->repo->getTopBorrowedBooks(),
            'recentBorrows'=> $this->repo->getRecentBorrows(),
            'recentInvoices'=> $this->repo->getRecentInvoices(),
        ];
    }
}
