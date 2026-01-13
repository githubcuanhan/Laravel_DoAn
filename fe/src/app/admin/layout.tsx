import AdminLayout from '@/components/layouts/admin';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quản Lý Thư Viện',
  description: 'Thư viện online',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
