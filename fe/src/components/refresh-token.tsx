'use client';
import { clientSessionToken } from '@/lib/http';
import { useEffect } from 'react';
import authApiRequest from '@/services/auth';
import { decodeJWT } from '@/lib/utils/mini';

export default function RefreshToken() {
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const accessToken = clientSessionToken.value;
        const refreshToken = clientSessionToken.refreshToken;
        if (!accessToken || !refreshToken) return;

        const payload = decodeJWT<any>(accessToken);
        if (!payload?.exp) return;

        const now = Date.now(); // ms
        const exp = payload.exp * 1000; // ms
        const tenMinutes = 10 * 60 * 1000; // 10 phút

        if (exp - now <= tenMinutes) {
          const res =
            await authApiRequest.refreshTokenFromNextClientToNextServer({
              refresh_token: refreshToken,
            });

          if (res.payload.success) {
            clientSessionToken.value = res.payload.data.access_token;
            clientSessionToken.refreshToken = res.payload.data.refresh_token;
          } else {
            console.warn('Refresh token thất bại:', res.payload.message);
          }
        } else {
          console.log('Access token chưa chưa hết hạn');
        }
      } catch (error) {
        console.error('Lỗi khi refresh token:', error);
        // Chỉ redirect nếu đã có token trước đó (user đã đăng nhập)
        const hadToken = clientSessionToken.value || clientSessionToken.refreshToken;
        clientSessionToken.value = '';
        clientSessionToken.refreshToken = '';
        
        if (hadToken) {
          // User đã đăng nhập nhưng token hết hạn -> redirect login
          window.location.href = '/auth/login';
        }
        // Nếu không có token từ đầu (khách vãng lai), không redirect
      }
    }, 600 * 1000); // mỗi 10 phút check

    return () => clearInterval(interval);
  }, []);

  return null;
}
