'use client';
import { useState } from 'react';
import { clientSessionToken } from '@/lib/http';
import { Toaster } from '@/components/ui/sonner';
import RefreshToken from '@/components/refresh-token';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import accountService from '@/services/user';
import { useUserStore } from '@/store/useUserStore';

export default function AppProvider({
  children,
  token,
}: {
  children: React.ReactNode;
  token: {
    accessToken: string;
    refreshToken: string;
  };
}) {
  useState(async () => {
    if (typeof window !== 'undefined') {
      clientSessionToken.value = token.accessToken;
      clientSessionToken.refreshToken = token.refreshToken;

      // Chỉ gọi API me() khi có token (user đã đăng nhập)
      if (token.accessToken) {
        if (useUserStore.getState().user == null) {
          try {
            const response = await accountService.me();
            if (response.payload.success) {
              useUserStore.getState().setUser(response.payload.data);
            } else {
              useUserStore.getState().setUser(null);
            }
          } catch (error) {
            // Nếu lỗi (token hết hạn, etc), set user = null
            console.log('Không thể lấy thông tin user:', error);
            useUserStore.getState().setUser(null);
          }
        }
      } else {
        // Không có token = khách vãng lai
        useUserStore.getState().setUser(null);
      }
    }
  });
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <RefreshToken />
      <Toaster expand visibleToasts={4} position="bottom-right" />
      {children}
    </NextThemesProvider>
  );
}
