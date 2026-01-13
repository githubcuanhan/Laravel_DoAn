<?php

namespace App\Repositories;

use App\Models\TaiKhoan;
use App\Models\Sach;
use App\Models\ChiTietPhieuMuon;
use App\Models\PhieuMuon;
use App\Models\HoaDon;
use Illuminate\Support\Facades\DB;

class DashboardRepository
{
    /**
     * KPI chính
     */
    public function getKPI()
    {
        return [
            'totalUsers'        => TaiKhoan::count(),
            'activeUsers'       => TaiKhoan::where('trangThai', 1)->count(),
            'lockedUsers'       => TaiKhoan::where('trangThai', 0)->count(),

            'totalBooks'        => Sach::count(),
            'availableBooks'    => Sach::where('soLuongKhaDung', '>', 0)->count(),
            'borrowingBooks'    => ChiTietPhieuMuon::where('trangThai', 'dang_muon')->count(),
            'overdueBooks'      => ChiTietPhieuMuon::where('soNgayTre', '>', 0)->count(),

            'totalBorrows'      => PhieuMuon::count(),
            'activeBorrows'     => ChiTietPhieuMuon::where('trangThai', 'dang_muon')->count(),
            'overdueBorrows'    => ChiTietPhieuMuon::where('soNgayTre', '>', 0)->count(),

            'totalInvoices'     => HoaDon::count(),
            'unPaidInvoices'    => HoaDon::where('trangThai', 'chua_thanh_toan')->count(),

            'totalIncome'       => HoaDon::sum('tongTien'),
        ];
    }

    /**
     * Số lượt mượn theo tháng
     */
    public function getBorrowStats()
    {
        return PhieuMuon::select(
            DB::raw('MONTH(ngayMuon) as month'),
            DB::raw('COUNT(*) as total')
        )
        ->groupBy('month')
        ->orderBy('month')
        ->get();
    }

    /**
     * Tổng tiền phạt theo tháng
     */
    public function getFineStats()
    {
        return ChiTietPhieuMuon::select(
            DB::raw('MONTH(ngayTraThucTe) as month'),
            DB::raw('SUM(tienPhat) as totalFine')
        )
        ->whereNotNull('ngayTraThucTe')
        ->groupBy('month')
        ->orderBy('month')
        ->get();
    }

    /**
     * Top 10 sách được mượn nhiều nhất
     */
    public function getTopBorrowedBooks()
    {
        return ChiTietPhieuMuon::select(
            'idSach',
            DB::raw('COUNT(*) as totalBorrowed')
        )
        ->groupBy('idSach')
        ->orderByDesc('totalBorrowed')
        ->with('sach')
        ->limit(10)
        ->get();
    }

    /**
     * 10 lượt mượn gần nhất
     */
    public function getRecentBorrows()
    {
        return ChiTietPhieuMuon::with(['sach', 'phieuMuon.nguoiMuon'])
            ->orderByDesc('idCTPhieumuon')
            ->limit(10)
            ->get();
    }

    /**
     * 10 hóa đơn gần nhất
     */
    public function getRecentInvoices()
    {
        return HoaDon::with(['nguoiThu', 'nguoiBiThu'])
            ->orderByDesc('idHoadon')
            ->limit(10)
            ->get();
    }
}
