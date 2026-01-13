import http from "@/lib/http";
import { ApiResponse } from "@/lib/types/api.types";

export interface DashboardData {
  kpi: {
    totalUsers: number;
    activeUsers: number;
    lockedUsers: number;

    totalBooks: number;
    availableBooks: number;
    borrowingBooks: number;
    overdueBooks: number;

    totalBorrows: number;
    activeBorrows: number;
    overdueBorrows: number;

    totalInvoices: number;
    unPaidInvoices: number;

    totalIncome: number;
  };

  borrowStats: {
    month: number;
    total: number;
  }[];

  fineStats: {
    month: number;
    totalFine: number;
  }[];

  topBooks: {
    idSach: number;
    totalBorrowed: number;
    sach: {
      tenSach: string;
      tacGia: string;
      hinh_anhs?: { duongDan: string }[];
    };
  }[];

  recentBorrows: any[];
  recentInvoices: any[];
}

const dashboardService = {
  getAll: () => http.get<ApiResponse<DashboardData>>("/dashboard"),
};

export default dashboardService;
