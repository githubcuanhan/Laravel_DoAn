import SystemLayout from '@/components/layouts/system';

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SystemLayout>{children}</SystemLayout>;
}
