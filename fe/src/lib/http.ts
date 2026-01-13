import { LoginResponse } from '@/lib/types/auth.types';
import { normalizePath } from '@/lib/utils/mini';
import { redirect } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';

const ENTITY_ERROR_STATUS = 422;
const AUTHENTICATION_ERROR_STATUS = 401;

type CustomOptions = RequestInit & {
  baseUrl?: string | undefined;
};

type HttpErrorPayload = {
  success: boolean;
  message: string;
  errors: {
    [key: string]: string[];
  };
};

export class HttpError extends Error {
  status: number;
  payload: {
    message: string;
    [key: string]: unknown;
  };
  constructor(data: { status: number; payload: HttpErrorPayload }) {
    super('HTTP Error');
    this.status = data.status;
    this.payload = data.payload;

    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export class EntityError extends HttpError {
  status: 422;
  payload: HttpErrorPayload;
  constructor(data: { status: 422; payload: HttpErrorPayload }) {
    super(data);
    this.status = 422;
    this.payload = data.payload;

    Object.setPrototypeOf(this, EntityError.prototype);
  }
}

class SessionToken {
  private token: string = '';
  private _refreshToken: string = '';
  get value() {
    return this.token;
  }
  set value(token: string) {
    if (typeof window === 'undefined') {
      throw new Error('Không thể set session token trên server side');
    }
    this.token = token;
  }

  get refreshToken() {
    return this._refreshToken;
  }
  set refreshToken(refreshToken: string) {
    if (typeof window === 'undefined') {
      throw new Error('Không thể set refresh token trên server side');
    }
    this._refreshToken = refreshToken;
  }
}

export const clientSessionToken = new SessionToken();

const request = async <Response>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  options?: CustomOptions | undefined
) => {
  // Kiểm tra xem body có phải là FormData không
  const isFormData = options?.body instanceof FormData;

  // Nếu là FormData thì không stringify, nếu không thì stringify
  const body = options?.body
    ? isFormData
      ? options.body
      : JSON.stringify(options.body)
    : undefined;

  const baseHeaders: Record<string, string> = {
    Accept: 'application/json',
    Authorization: clientSessionToken.value
      ? `Bearer ${clientSessionToken.value}`
      : '',
  };

  // Chỉ set Content-Type nếu không phải FormData
  // FormData sẽ tự động set Content-Type với boundary
  if (!isFormData) {
    baseHeaders['Content-Type'] = 'application/json';
  }

  // Nếu không truyền baseUrl (hoặc baseUrl là undefined) thì sử dụng NEXT_PUBLIC_API_URL
  // Nếu truyền baseUrl thì sử dụng baseUrl đó nhưng nếu baseUrl là " " thì đồng nghĩa chúng ta gọi API đến Next.js server
  const baseUrl =
    options?.baseUrl === undefined
      ? process.env.NEXT_PUBLIC_API_URL
      : options.baseUrl;

  let fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;

  // Cache busting cho GET để tránh cache trình duyệt / proxy
  if (method === 'GET') {
    const sep = fullUrl.includes('?') ? '&' : '?';
    fullUrl = `${fullUrl}${sep}_ts=${Date.now()}`;
  }

  // Merge headers, nhưng loại bỏ Content-Type từ options nếu là FormData
  const headers = { ...baseHeaders };
  if (options?.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      // Bỏ qua Content-Type nếu là FormData
      if (isFormData && key.toLowerCase() === 'content-type') {
        return;
      }
      headers[key] = value as string;
    });
  }

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      ...headers,
    },
    body,
    method,
    cache: 'no-store',
  });
  const payload: Response = await res.json();
  const data = {
    status: res.status,
    payload,
  };
  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(data as { status: 422; payload: HttpErrorPayload });
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      // Kiểm tra nếu không phải endpoint login/register thì mới redirect
      const isAuthEndpoint = ['auth/login', 'auth/register'].some(
        (item) => item === normalizePath(url)
      );

      if (!isAuthEndpoint) {
        if (typeof window !== 'undefined') {
          // Chỉ logout và redirect nếu user đã có token (đã đăng nhập trước đó)
          const hadToken = clientSessionToken.value || clientSessionToken.refreshToken;
          
          if (hadToken) {
            await fetch('/api/auth/logout', {
              method: 'POST',
              body: JSON.stringify({ force: true }),
              headers: baseHeaders,
            });
            clientSessionToken.value = '';
            clientSessionToken.refreshToken = '';
            useUserStore.getState().setUser(null);
            location.href = '/auth/login';
          }
          // Nếu không có token từ đầu (khách vãng lai), không làm gì cả
        } else {
          const sessionToken = (
            options?.headers as Record<string, string>
          )?.Authorization?.split('Bearer ')[1];
          if (sessionToken) {
            redirect(`/auth/logout?sessionToken=${sessionToken}`);
          }
        }
      } else {
        // Nếu là endpoint login/register thì throw error để form bắt lỗi
        throw new HttpError(
          data as { status: number; payload: HttpErrorPayload }
        );
      }
    } else {
      throw new HttpError(
        data as { status: number; payload: HttpErrorPayload }
      );
    }
  }

  if (typeof window !== 'undefined') {
    if (
      ['auth/login', 'auth/register'].some((item) => item == normalizePath(url))
    ) {
      clientSessionToken.value = (payload as LoginResponse).data.access_token;
      clientSessionToken.refreshToken = (
        payload as LoginResponse
      ).data.refresh_token;
    } else if (['/auth/logout'].some((item) => item === normalizePath(url))) {
      clientSessionToken.value = '';
      clientSessionToken.refreshToken = '';
      useUserStore.getState().setUser(null);
    }
  }
  return data;
};

const http = {
  get<Response>(url: string, options?: CustomOptions | undefined) {
    return request<Response>('GET', url, options);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post<Response>(url: string, body: any, options?: CustomOptions | undefined) {
    return request<Response>('POST', url, { ...options, body });
  },
  put<Response>(
    url: string,
    body: unknown,
    options?: CustomOptions | undefined
  ) {
    return request<Response>('PUT', url, {
      ...options,
      body: body as BodyInit,
    });
  },
  delete<Response>(
    url: string,
    body: unknown,
    options?: CustomOptions | undefined
  ) {
    return request<Response>('DELETE', url, {
      ...options,
      body: body as BodyInit,
    });
  },
};

export default http;
