import http from '@/lib/http';
import {
  LoginBody,
  RegisterBody,
  RefreshTokenBody,
  ForgotPasswordBody,
  ResetPasswordBody,
  LoginResponse,
  RegisterResponse,
  LogoutResponse,
  RefreshResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
} from '@/lib/types/auth.types';
import { ApiResponse } from '@/lib/types/api.types';

const authService = {
  auth: (body: {
    accessToken: string;
    refreshToken: string;
    refreshExpiresAt: string;
    role: string;
  }) => http.post<ApiResponse>('/api/auth', body, { baseUrl: '' }),

  login: (body: LoginBody) => http.post<LoginResponse>('/auth/login', body),

  register: (body: RegisterBody) =>
    http.post<RegisterResponse>('/auth/register', body),

  logout: () =>
    http.post<LogoutResponse>('/api/auth/logout', {}, { baseUrl: '' }),

  logoutFromNextServer: (clientSessionToken: string) =>
    http.post<LogoutResponse>(
      '/auth/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${clientSessionToken}`,
        },
      }
    ),

  logoutFromNextClientToNextServer: (force: boolean | undefined) =>
    http.post<LogoutResponse>(
      '/api/auth/logout',
      { force: force },
      {
        baseUrl: '',
      }
    ),

  refreshTokenFromNextClientToNextServer: (body: RefreshTokenBody) =>
    http.post<RefreshResponse>('/api/auth/refresh-token', body, {
      baseUrl: '',
    }),

  refreshTokenFromNextServerToServer: (body: RefreshTokenBody) =>
    http.post<RefreshResponse>('/auth/refresh-token', body),

  forgotPassword: (body: ForgotPasswordBody) =>
    http.post<ForgotPasswordResponse>('/auth/forgot-password', body),

  resetPassword: (body: ResetPasswordBody) =>
    http.post<ResetPasswordResponse>('/auth/reset-password', body),

  provider: (provider: string) => http.get<any>(`/auth/provider/${provider}`),
};

export default authService;
