import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import AppProvider from './providers';
import { cookies } from 'next/headers';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
});

export const metadata: Metadata = {
  title: 'Thư viện online',
  description: 'Thư viện online',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${roboto.className} antialiased`}>
        <AppProvider
          token={{
            accessToken: accessToken ?? '',
            refreshToken: refreshToken ?? '',
          }}
        >
          {children}
        </AppProvider>
        <Toaster />
      </body>
    </html>
  );
}
