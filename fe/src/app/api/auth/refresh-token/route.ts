import { decodeJWT } from '@/lib/utils/mini';
import authApiRequest from '@/services/auth';

type PayLoadJWT = {
  iat: number;
  exp: number;
  token_type: string;
  userId: string;
};

export async function POST(request: Request) {
  const body = await request.json();
  const refreshToken = body.refresh_token;
  if (!refreshToken) {
    return Response.json(
      {
        success: false,
        message: 'Không nhận được refresh token',
      },
      { status: 400 }
    );
  }
  try {
    const res = await authApiRequest.refreshTokenFromNextServerToServer({
      refresh_token: refreshToken,
    });
    const payLoad = decodeJWT<PayLoadJWT>(res.payload.data.access_token);
    const expresDateAccessToken = new Date(payLoad.exp * 1000).toUTCString();
    const expresDateRefreshToken = new Date(
      res.payload.data.refresh_expires_at
    ).toUTCString();
    const response = Response.json(
      {
        success: true,
        data: res.payload.data ?? null,
      },
      {
        status: 200,
      }
    );

    // Set cookies properly using Response.headers.set
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = `Path=/; HttpOnly; SameSite=Lax${
      isProduction ? '; Secure' : ''
    }`;

    response.headers.set(
      'Set-Cookie',
      `access_token=${res.payload.data.access_token}; ${cookieOptions}; Expires=${expresDateAccessToken}`
    );
    response.headers.append(
      'Set-Cookie',
      `refresh_token=${res.payload.data.refresh_token}; ${cookieOptions}; Expires=${expresDateRefreshToken}`
    );

    return response;
  } catch (err) {
    console.log('Refresh token error:', err);

    return Response.json(
      {
        success: false,
        message: 'Refresh token hết hạn hoặc không hợp lệ',
      },
      { status: 401 }
    );
  }
}
