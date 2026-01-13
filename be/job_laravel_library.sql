-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost:3306
-- Thời gian đã tạo: Th10 19, 2025 lúc 04:38 AM
-- Phiên bản máy phục vụ: 8.0.30
-- Phiên bản PHP: 8.3.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `job_laravel_library``
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cauhinh_muontra`
--

CREATE TABLE `cauhinh_muontra` (
  `id` bigint UNSIGNED NOT NULL,
  `soNgayToiDa` int NOT NULL DEFAULT '7',
  `mucPhatMoiNgay` decimal(10,2) NOT NULL DEFAULT '5000.00',
  `apDungTuNgay` date NOT NULL,
  `apDungDenNgay` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `cauhinh_muontra`
--

INSERT INTO `cauhinh_muontra` (`id`, `soNgayToiDa`, `mucPhatMoiNgay`, `apDungTuNgay`, `apDungDenNgay`, `created_at`, `updated_at`) VALUES
(1, 14, 5000.00, '2025-11-18', NULL, '2025-11-17 23:33:04', '2025-11-17 23:33:04');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chitietdanhmuc`
--

CREATE TABLE `chitietdanhmuc` (
  `idSach` bigint UNSIGNED NOT NULL,
  `idDanhmuc` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `chitietdanhmuc`
--

INSERT INTO `chitietdanhmuc` (`idSach`, `idDanhmuc`) VALUES
(2, 1),
(1, 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chitiethoadon`
--

CREATE TABLE `chitiethoadon` (
  `idHoadon` bigint UNSIGNED NOT NULL,
  `idCTPhieumuon` bigint UNSIGNED NOT NULL,
  `soTienPhat` decimal(10,2) NOT NULL DEFAULT '0.00',
  `soNgayTre` int NOT NULL DEFAULT '0',
  `trangThai` enum('ap_dung','huy') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ap_dung',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `chitiethoadon`
--

INSERT INTO `chitiethoadon` (`idHoadon`, `idCTPhieumuon`, `soTienPhat`, `soNgayTre`, `trangThai`, `created_at`, `updated_at`) VALUES
(1, 1, 5000.00, 1, 'ap_dung', '2025-11-18 20:55:10', '2025-11-18 20:55:10');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chitietphieumuon`
--

CREATE TABLE `chitietphieumuon` (
  `idCTPhieumuon` bigint UNSIGNED NOT NULL,
  `idPhieumuon` bigint UNSIGNED NOT NULL,
  `idSach` bigint UNSIGNED NOT NULL,
  `ngayMuon` date DEFAULT NULL,
  `hanTra` date DEFAULT NULL,
  `ngayTraThucTe` date DEFAULT NULL,
  `soNgayTre` int NOT NULL DEFAULT '0',
  `tienPhat` decimal(10,2) NOT NULL DEFAULT '0.00',
  `soLuong` int NOT NULL DEFAULT '1',
  `trangThai` enum('dang_cho','dang_muon','da_tra','mat_sach') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'dang_cho',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `chitietphieumuon`
--

INSERT INTO `chitietphieumuon` (`idCTPhieumuon`, `idPhieumuon`, `idSach`, `ngayMuon`, `hanTra`, `ngayTraThucTe`, `soNgayTre`, `tienPhat`, `soLuong`, `trangThai`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2025-11-17', '2025-11-18', '2025-11-19', 1, 5000.00, 1, 'da_tra', '2025-11-17 23:33:09', '2025-11-18 20:55:10');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `danhmuc`
--

CREATE TABLE `danhmuc` (
  `idDanhmuc` bigint UNSIGNED NOT NULL,
  `tenDanhmuc` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `moTa` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `danhmuc`
--

INSERT INTO `danhmuc` (`idDanhmuc`, `tenDanhmuc`, `moTa`, `created_at`, `updated_at`) VALUES
(1, 'Tâm lý - Kỹ năng', 'Tâm lý - Kỹ năng', '2025-11-17 23:18:50', '2025-11-17 23:18:50'),
(2, 'Khoa Học - Công Nghệ', 'Khoa Học - Công Nghệ', '2025-11-17 23:18:56', '2025-11-17 23:18:56'),
(3, 'Kiến Trúc - Xây Dựng', 'Kiến Trúc - Xây Dựng', '2025-11-17 23:19:00', '2025-11-17 23:19:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `giahan`
--

CREATE TABLE `giahan` (
  `idGiahan` bigint UNSIGNED NOT NULL,
  `idCTPhieumuon` bigint UNSIGNED NOT NULL,
  `ngayGiaHan` date NOT NULL,
  `hanTraMoi` date NOT NULL,
  `lyDo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hinh_anh_sach`
--

CREATE TABLE `hinh_anh_sach` (
  `id` bigint UNSIGNED NOT NULL,
  `idSach` bigint UNSIGNED NOT NULL,
  `duongDan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tieuDe` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_cover` tinyint(1) NOT NULL DEFAULT '0',
  `thuTu` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `hinh_anh_sach`
--

INSERT INTO `hinh_anh_sach` (`id`, `idSach`, `duongDan`, `tieuDe`, `is_cover`, `thuTu`, `created_at`, `updated_at`) VALUES
(1, 1, '/book-images/BOOK-99B393A0/BOOKIMG_1763446899936.jpg', NULL, 1, 0, '2025-11-17 23:21:40', '2025-11-17 23:21:40'),
(2, 2, '/book-images/BOOK-25975897/BOOKIMG_1763447051785.jpg', NULL, 0, 0, '2025-11-17 23:24:12', '2025-11-17 23:24:12');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hoadon`
--

CREATE TABLE `hoadon` (
  `idHoadon` bigint UNSIGNED NOT NULL,
  `idNguoiThu` bigint UNSIGNED NOT NULL,
  `idNguoiBiThu` bigint UNSIGNED NOT NULL,
  `loaiHoadon` enum('phat_tre_hen','khac') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'phat_tre_hen',
  `ngayLap` date NOT NULL,
  `trangThai` enum('chua_thanh_toan','da_thanh_toan') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'chua_thanh_toan',
  `tongTien` decimal(10,2) NOT NULL DEFAULT '0.00',
  `ghiChu` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `hoadon`
--

INSERT INTO `hoadon` (`idHoadon`, `idNguoiThu`, `idNguoiBiThu`, `loaiHoadon`, `ngayLap`, `trangThai`, `tongTien`, `ghiChu`, `created_at`, `updated_at`) VALUES
(1, 2, 2, 'phat_tre_hen', '2025-11-19', 'da_thanh_toan', 5000.00, 'Phạt trả sách trễ - Phiếu mượn #1', '2025-11-18 20:55:10', '2025-11-18 21:01:15');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `kesach`
--

CREATE TABLE `kesach` (
  `idKeSach` bigint UNSIGNED NOT NULL,
  `idKhu` bigint UNSIGNED NOT NULL,
  `tenKe` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `moTa` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `kesach`
--

INSERT INTO `kesach` (`idKeSach`, `idKhu`, `tenKe`, `moTa`, `created_at`, `updated_at`) VALUES
(1, 1, 'Kệ 1', 'Kệ 1', '2025-11-17 23:18:07', '2025-11-17 23:18:07'),
(2, 2, 'Kệ 2', 'Kệ 2', '2025-11-17 23:18:18', '2025-11-17 23:18:18');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `khu`
--

CREATE TABLE `khu` (
  `idKhu` bigint UNSIGNED NOT NULL,
  `tenKhu` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `viTri` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `moTa` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `khu`
--

INSERT INTO `khu` (`idKhu`, `tenKhu`, `viTri`, `moTa`, `created_at`, `updated_at`) VALUES
(1, 'Khu A', 'Khu A', 'Khu A', '2025-11-17 23:17:46', '2025-11-17 23:17:46'),
(2, 'Khu B', 'Khu B', 'Khu B', '2025-11-17 23:17:53', '2025-11-17 23:17:53');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lop`
--

CREATE TABLE `lop` (
  `idLop` bigint UNSIGNED NOT NULL,
  `tenLop` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `lop`
--

INSERT INTO `lop` (`idLop`, `tenLop`, `created_at`, `updated_at`) VALUES
(1, 'Lớp 10', NULL, NULL),
(2, 'Lớp 11', NULL, NULL),
(3, 'Lớp 12', NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2025_11_12_065255_create_danhmuc_table', 1),
(2, '2025_11_12_065256_create_khu_table', 1),
(3, '2025_11_12_065257_create_kesach_table', 1),
(4, '2025_11_12_065301_create_sach_table', 1),
(5, '2025_11_12_065302_create_chitietdanhmuc_table', 1),
(6, '2025_11_12_065310_create_lop_table', 1),
(7, '2025_11_12_065320_create_taikhoan_table', 1),
(8, '2025_11_12_065326_create_phieumuon_table', 1),
(9, '2025_11_12_065327_create_chitietphieumuon_table', 1),
(10, '2025_11_12_065416_create_hoadon_table', 1),
(11, '2025_11_12_065428_create_chitiethoadon_table', 1),
(12, '2025_11_12_065432_create_giahan_table', 1),
(13, '2025_11_12_081326_create_sessions_table', 1),
(14, '2025_11_13_143152_create_cauhinh_muontra_table', 1),
(15, '2025_11_13_143203_create_hinh_anh_sach_table', 1),
(16, '2025_11_13_143212_create_refresh_tokens_table', 1),
(17, '2025_11_13_143222_create_password_reset_tokens_table', 1),
(18, '2025_11_13_143223_create_cache_locks_table', 1),
(19, '2025_11_13_143223_create_cache_table', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `password_reset_tokens`
--

INSERT INTO `password_reset_tokens` (`email`, `token`, `created_at`) VALUES
('vudevweb@gmail.com', '$2y$12$paHhmYNJPRLaxocoeiJdGOmZ5caDTK4yIJuenm6f8eK3GNVQgLFIa', '2025-11-18 00:46:12');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phieumuon`
--

CREATE TABLE `phieumuon` (
  `idPhieumuon` bigint UNSIGNED NOT NULL,
  `idNguoiMuon` bigint UNSIGNED NOT NULL,
  `idNguoiTao` bigint UNSIGNED NOT NULL,
  `ngayMuon` date NOT NULL,
  `hanTra` date NOT NULL,
  `trangThai` enum('dang_muon','da_tra','qua_han','huy','dang_cho') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'dang_cho',
  `ghiChu` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `phieumuon`
--

INSERT INTO `phieumuon` (`idPhieumuon`, `idNguoiMuon`, `idNguoiTao`, `ngayMuon`, `hanTra`, `trangThai`, `ghiChu`, `created_at`, `updated_at`) VALUES
(1, 2, 2, '2025-11-18', '2025-12-02', 'da_tra', NULL, '2025-11-17 23:33:09', '2025-11-18 20:55:10');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `refresh_tokens`
--

CREATE TABLE `refresh_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `idTaiKhoan` bigint UNSIGNED NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` timestamp NOT NULL,
  `revoked` tinyint(1) NOT NULL DEFAULT '0',
  `ip` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `refresh_tokens`
--

INSERT INTO `refresh_tokens` (`id`, `idTaiKhoan`, `token`, `expires_at`, `revoked`, `ip`, `user_agent`, `created_at`, `updated_at`) VALUES
(1, 2, '253638a27b2f17637da72ee7ce8c375c3ab7ff3552f502750ce1fcff93da4c17', '2025-11-27 08:07:23', 0, '127.0.0.1', 'PostmanRuntime/7.50.0', '2025-11-13 08:07:23', '2025-11-13 08:07:23'),
(2, 2, '1ea9e8edd9e7f1afbe25d4896c5994ca30ad9449f3d25096b4618e3819549603', '2025-11-27 08:08:50', 0, '127.0.0.1', 'PostmanRuntime/7.50.0', '2025-11-13 08:08:50', '2025-11-13 08:08:50'),
(3, 2, 'f127b1c951ab276ccb66b07e66876084c6bbc27f433087ece45475e1e07ea16c', '2025-11-27 08:26:07', 0, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-13 08:26:07', '2025-11-13 08:26:07'),
(4, 3, 'd296a98315e2b647238cd5f859439cc47ea525a19f82a02404dc58c0477279db', '2025-11-27 08:28:59', 0, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-13 08:28:59', '2025-11-13 08:28:59'),
(5, 2, '7c685984399931eadcd286dbd24aabd778fb59e0cc7c609495acc20834972e93', '2025-12-01 22:00:33', 0, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-17 22:00:33', '2025-11-17 22:00:33'),
(6, 2, '44c0c33a4178c446cd9cf903fdd413d417c1e196ce899b9e74d834016e6c562c', '2025-12-01 23:15:53', 0, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-17 23:15:53', '2025-11-17 23:15:53'),
(7, 2, '86c3ac313b525fcdebef8dcbc2e9215dcd20d281de96b8fb8623099dbf04bc8c', '2025-12-02 00:48:11', 0, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-18 00:48:11', '2025-11-18 00:48:11'),
(8, 2, '9eeca54e37644e0049e4d8dd8e902e892ea98f5e6cab4ebddb7e7b5c1b9546b8', '2025-12-02 00:49:29', 0, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-18 00:49:29', '2025-11-18 00:49:29'),
(9, 2, '2142340a6881c33e4a1f6e0ddaa2f07f8f2783b9878e0df13ca5d6b1ba709f27', '2025-12-02 20:43:06', 0, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-18 20:43:06', '2025-11-18 20:43:06'),
(10, 2, '55c7a1e7458525198470a40525f69e0a7ee99215927c39692abcf626031d2893', '2025-12-02 20:44:28', 0, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-18 20:44:28', '2025-11-18 20:44:28'),
(11, 2, 'd88a68eee9c28d06456cadc742163ab82ded750fb6067cf06b0aa6c35c19ce07', '2025-12-02 21:25:49', 0, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-18 21:25:49', '2025-11-18 21:25:49'),
(12, 2, 'd2889db6f71af00072ba2d19f8535822db6ed3a7164e73a2dae09234a3fd8137', '2025-12-02 21:33:39', 0, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-18 21:33:39', '2025-11-18 21:33:39'),
(13, 2, 'f083192eb424c316fceaf5beecbf06ecd44e3e890c328a977b5b1f436c72ccc3', '2025-12-02 21:35:31', 0, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-18 21:35:31', '2025-11-18 21:35:31'),
(14, 2, '3ba7dd27606c51dffe3bd20021874ca09d70aa7f930143344ce58e54e31ec95c', '2025-12-02 21:36:28', 0, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-18 21:36:28', '2025-11-18 21:36:28');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sach`
--

CREATE TABLE `sach` (
  `idSach` bigint UNSIGNED NOT NULL,
  `maSach` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `maQR` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tenSach` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tacGia` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nhaXuatBan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `namXuatBan` int DEFAULT NULL,
  `soLuong` int NOT NULL DEFAULT '0',
  `soLuongKhaDung` int NOT NULL DEFAULT '0',
  `trangThai` enum('dang_su_dung','tam_khoa','ngung_phuc_vu') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'dang_su_dung',
  `moTa` text COLLATE utf8mb4_unicode_ci,
  `idKeSach` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `sach`
--

INSERT INTO `sach` (`idSach`, `maSach`, `maQR`, `tenSach`, `tacGia`, `nhaXuatBan`, `namXuatBan`, `soLuong`, `soLuongKhaDung`, `trangThai`, `moTa`, `idKeSach`, `created_at`, `updated_at`) VALUES
(1, 'BOOK-99B393A0', '/qr-codes/BOOK-99B393A0.png', 'Trăm năm cô đơn', 'vudovn', 'vudovn', 2025, 1, 1, 'dang_su_dung', 'Quyển sách tuyệt vời này đến từ tác giả người Columbia – Gabriel García Márquez. Không chỉ hấp dẫn người đọc, cuốn sách này còn ghi dấu ấn với giải Nobel văn học vào năm 1982.\n\nTrăm năm cô đơn là câu chuyện kể về dòng họ Buênđya đã tồn tại trong 7 thế hệ. Người đầu tiên trong số đó bị trói vào gốc cây, người cuối cùng của dòng họ đã bị kiến ăn. Đây là một dòng họ đã tự lưu đày chính họ vào trong cõi cô đơn với mục đích chính là việc trốn tránh tội loạn luân.', 1, '2025-11-17 23:21:40', '2025-11-18 20:55:10'),
(2, 'BOOK-25975897', '/qr-codes/BOOK-25975897.png', 'Odyssêy', 'vudovn', 'vudovn', 2025, 1, 1, 'dang_su_dung', 'Bản anh hùng ca Odyssêy của Homer là một kiệt tác của văn học Hy Lạp cổ đại. Tác phẩm không chỉ là câu chuyện về hành trình 10 năm đầy gian truân của Odyssêy trở về quê hương Ithaca mà còn là bức tranh phản ánh khát vọng chinh phục thiên nhiên và vượt qua số phận của con người.', 2, '2025-11-17 23:22:55', '2025-11-17 23:23:17');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('AoqKJFbaD6rT9I5Nd5Cmu3y5Tk7KEFTxj8nL9KjD', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOVpFOXk1YnhDbjJjb2ZaR3V1dHQwNmlHMTdrVk45SlJWckh6TW5QNSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1763442027),
('chBUBl4wWiU6g33wEixdjdY1xKxvy2ZtZsF3zzTZ', NULL, '127.0.0.1', 'PostmanRuntime/7.50.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYXRvS1ZOQXZCcVJBdVBjWjExZFpuTE1ZVmNuZm5oOENMaHgwWFhhSSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1763046087);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `taikhoan`
--

CREATE TABLE `taikhoan` (
  `id` bigint UNSIGNED NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vaiTro` enum('admin','thuthu','bandoc') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'bandoc',
  `hoTen` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `soDienThoai` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ngaySinh` date DEFAULT NULL,
  `diaChi` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `idLop` bigint UNSIGNED DEFAULT NULL,
  `maSinhVien` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trangThai` enum('hoat_dong','tam_khoa','ngung') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'hoat_dong',
  `last_login_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `taikhoan`
--

INSERT INTO `taikhoan` (`id`, `email`, `password`, `vaiTro`, `hoTen`, `soDienThoai`, `ngaySinh`, `diaChi`, `idLop`, `maSinhVien`, `trangThai`, `last_login_at`, `remember_token`, `created_at`, `updated_at`) VALUES
(2, 'vudevweb@gmail.com', '$2y$12$WOZzNNGDOpm6TVumbxVINeG/MJSSNxX6gzFTtTwDRSZtv5Tn7Typy', 'admin', 'Vũ Đõ', NULL, '2004-05-04', NULL, NULL, NULL, 'hoat_dong', '2025-11-18 21:36:28', NULL, '2025-11-13 08:04:30', '2025-11-18 21:36:28'),
(3, 'vudevweb2@gmail.com', '$2y$12$x5Jhu/fdhRrw/un0znkIZORcDU9raPhKolgsyspomj32CvuwCij0W', 'bandoc', 'Nguyễn Văn A', NULL, NULL, NULL, NULL, NULL, 'hoat_dong', NULL, NULL, '2025-11-13 08:28:58', '2025-11-13 08:28:58'),
(4, 'thuthu@gmail.com', '$2y$12$mN4d/lFtQZNtEJ/1QdQPaeCxOnK.i6H1Y9uGHpU6.XiJgyZzOV1I.', 'thuthu', 'Thủ Thư', NULL, NULL, NULL, NULL, NULL, 'hoat_dong', NULL, NULL, '2025-11-18 21:31:39', '2025-11-18 21:31:39'),
(5, 'admin@gmail.com', '$2y$12$Kz3Ph2gSe34ypO0q6yVFj.0zndP.QmSLMi0PQMGlKXO8Xqjbl9.dG', 'admin', 'Admin', NULL, NULL, NULL, NULL, NULL, 'hoat_dong', NULL, NULL, '2025-11-18 21:32:13', '2025-11-18 21:32:13');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Chỉ mục cho bảng `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Chỉ mục cho bảng `cauhinh_muontra`
--
ALTER TABLE `cauhinh_muontra`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `chitietdanhmuc`
--
ALTER TABLE `chitietdanhmuc`
  ADD PRIMARY KEY (`idSach`,`idDanhmuc`),
  ADD KEY `ctdm_idDanhmuc_index` (`idDanhmuc`);

--
-- Chỉ mục cho bảng `chitiethoadon`
--
ALTER TABLE `chitiethoadon`
  ADD PRIMARY KEY (`idHoadon`,`idCTPhieumuon`),
  ADD KEY `cthd_idCTPhieumuon_index` (`idCTPhieumuon`);

--
-- Chỉ mục cho bảng `chitietphieumuon`
--
ALTER TABLE `chitietphieumuon`
  ADD PRIMARY KEY (`idCTPhieumuon`),
  ADD UNIQUE KEY `ctpm_unique_phieumuon_sach` (`idPhieumuon`,`idSach`),
  ADD KEY `ctpm_idPhieumuon_index` (`idPhieumuon`),
  ADD KEY `ctpm_idSach_index` (`idSach`);

--
-- Chỉ mục cho bảng `danhmuc`
--
ALTER TABLE `danhmuc`
  ADD PRIMARY KEY (`idDanhmuc`);

--
-- Chỉ mục cho bảng `giahan`
--
ALTER TABLE `giahan`
  ADD PRIMARY KEY (`idGiahan`),
  ADD KEY `giahan_idCTPhieumuon_index` (`idCTPhieumuon`);

--
-- Chỉ mục cho bảng `hinh_anh_sach`
--
ALTER TABLE `hinh_anh_sach`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hinh_anh_sach_idSach_index` (`idSach`);

--
-- Chỉ mục cho bảng `hoadon`
--
ALTER TABLE `hoadon`
  ADD PRIMARY KEY (`idHoadon`),
  ADD KEY `hoadon_idNguoiThu_index` (`idNguoiThu`),
  ADD KEY `hoadon_idNguoiBiThu_index` (`idNguoiBiThu`);

--
-- Chỉ mục cho bảng `kesach`
--
ALTER TABLE `kesach`
  ADD PRIMARY KEY (`idKeSach`),
  ADD KEY `kesach_idKhu_index` (`idKhu`);

--
-- Chỉ mục cho bảng `khu`
--
ALTER TABLE `khu`
  ADD PRIMARY KEY (`idKhu`);

--
-- Chỉ mục cho bảng `lop`
--
ALTER TABLE `lop`
  ADD PRIMARY KEY (`idLop`);

--
-- Chỉ mục cho bảng `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Chỉ mục cho bảng `phieumuon`
--
ALTER TABLE `phieumuon`
  ADD PRIMARY KEY (`idPhieumuon`),
  ADD KEY `pm_idNguoiMuon_index` (`idNguoiMuon`),
  ADD KEY `pm_idNguoiTao_index` (`idNguoiTao`);

--
-- Chỉ mục cho bảng `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `refresh_tokens_token_unique` (`token`),
  ADD KEY `refresh_tokens_idTaiKhoan_revoked_index` (`idTaiKhoan`,`revoked`),
  ADD KEY `refresh_tokens_expires_at_index` (`expires_at`);

--
-- Chỉ mục cho bảng `sach`
--
ALTER TABLE `sach`
  ADD PRIMARY KEY (`idSach`),
  ADD UNIQUE KEY `sach_masach_unique` (`maSach`),
  ADD UNIQUE KEY `sach_maqr_unique` (`maQR`),
  ADD KEY `sach_idKeSach_index` (`idKeSach`);
ALTER TABLE `sach` ADD FULLTEXT KEY `sach_search_fulltext` (`tenSach`,`tacGia`,`nhaXuatBan`,`moTa`);

--
-- Chỉ mục cho bảng `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Chỉ mục cho bảng `taikhoan`
--
ALTER TABLE `taikhoan`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `taikhoan_email_unique` (`email`),
  ADD KEY `taikhoan_idLop_index` (`idLop`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `cauhinh_muontra`
--
ALTER TABLE `cauhinh_muontra`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `chitietphieumuon`
--
ALTER TABLE `chitietphieumuon`
  MODIFY `idCTPhieumuon` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `danhmuc`
--
ALTER TABLE `danhmuc`
  MODIFY `idDanhmuc` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `giahan`
--
ALTER TABLE `giahan`
  MODIFY `idGiahan` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `hinh_anh_sach`
--
ALTER TABLE `hinh_anh_sach`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `hoadon`
--
ALTER TABLE `hoadon`
  MODIFY `idHoadon` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `kesach`
--
ALTER TABLE `kesach`
  MODIFY `idKeSach` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `khu`
--
ALTER TABLE `khu`
  MODIFY `idKhu` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `lop`
--
ALTER TABLE `lop`
  MODIFY `idLop` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT cho bảng `phieumuon`
--
ALTER TABLE `phieumuon`
  MODIFY `idPhieumuon` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT cho bảng `sach`
--
ALTER TABLE `sach`
  MODIFY `idSach` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `taikhoan`
--
ALTER TABLE `taikhoan`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Ràng buộc đối với các bảng kết xuất
--

--
-- Ràng buộc cho bảng `chitietdanhmuc`
--
ALTER TABLE `chitietdanhmuc`
  ADD CONSTRAINT `chitietdanhmuc_iddanhmuc_foreign` FOREIGN KEY (`idDanhmuc`) REFERENCES `danhmuc` (`idDanhmuc`) ON DELETE CASCADE,
  ADD CONSTRAINT `chitietdanhmuc_idsach_foreign` FOREIGN KEY (`idSach`) REFERENCES `sach` (`idSach`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `chitiethoadon`
--
ALTER TABLE `chitiethoadon`
  ADD CONSTRAINT `chitiethoadon_idctphieumuon_foreign` FOREIGN KEY (`idCTPhieumuon`) REFERENCES `chitietphieumuon` (`idCTPhieumuon`) ON DELETE CASCADE,
  ADD CONSTRAINT `chitiethoadon_idhoadon_foreign` FOREIGN KEY (`idHoadon`) REFERENCES `hoadon` (`idHoadon`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `chitietphieumuon`
--
ALTER TABLE `chitietphieumuon`
  ADD CONSTRAINT `chitietphieumuon_idphieumuon_foreign` FOREIGN KEY (`idPhieumuon`) REFERENCES `phieumuon` (`idPhieumuon`) ON DELETE CASCADE,
  ADD CONSTRAINT `chitietphieumuon_idsach_foreign` FOREIGN KEY (`idSach`) REFERENCES `sach` (`idSach`) ON DELETE RESTRICT;

--
-- Ràng buộc cho bảng `giahan`
--
ALTER TABLE `giahan`
  ADD CONSTRAINT `giahan_idctphieumuon_foreign` FOREIGN KEY (`idCTPhieumuon`) REFERENCES `chitietphieumuon` (`idCTPhieumuon`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `hinh_anh_sach`
--
ALTER TABLE `hinh_anh_sach`
  ADD CONSTRAINT `hinh_anh_sach_idsach_foreign` FOREIGN KEY (`idSach`) REFERENCES `sach` (`idSach`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `hoadon`
--
ALTER TABLE `hoadon`
  ADD CONSTRAINT `hoadon_idnguoibithu_foreign` FOREIGN KEY (`idNguoiBiThu`) REFERENCES `taikhoan` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `hoadon_idnguoithu_foreign` FOREIGN KEY (`idNguoiThu`) REFERENCES `taikhoan` (`id`) ON DELETE RESTRICT;

--
-- Ràng buộc cho bảng `kesach`
--
ALTER TABLE `kesach`
  ADD CONSTRAINT `kesach_idkhu_foreign` FOREIGN KEY (`idKhu`) REFERENCES `khu` (`idKhu`) ON DELETE RESTRICT;

--
-- Ràng buộc cho bảng `phieumuon`
--
ALTER TABLE `phieumuon`
  ADD CONSTRAINT `phieumuon_idnguoimuon_foreign` FOREIGN KEY (`idNguoiMuon`) REFERENCES `taikhoan` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `phieumuon_idnguoitao_foreign` FOREIGN KEY (`idNguoiTao`) REFERENCES `taikhoan` (`id`) ON DELETE RESTRICT;

--
-- Ràng buộc cho bảng `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `refresh_tokens_idtaikhoan_foreign` FOREIGN KEY (`idTaiKhoan`) REFERENCES `taikhoan` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `sach`
--
ALTER TABLE `sach`
  ADD CONSTRAINT `sach_idkesach_foreign` FOREIGN KEY (`idKeSach`) REFERENCES `kesach` (`idKeSach`) ON DELETE SET NULL;

--
-- Ràng buộc cho bảng `taikhoan`
--
ALTER TABLE `taikhoan`
  ADD CONSTRAINT `taikhoan_idlop_foreign` FOREIGN KEY (`idLop`) REFERENCES `lop` (`idLop`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
