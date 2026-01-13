import { decodeJWT } from '@/lib/utils/mini';

type PayLoadJWT = {
  iat: number;
  exp: number;
  token_type: string;
  userId: string;
};

export async function POST(request: Request) {
  try {
    const res = await request.json();
    const accessToken = res.accessToken;
    const refreshToken = res.refreshToken;
    const refreshExpiresAt = res.refreshExpiresAt;
    const role = res.role;
    if (!accessToken || !refreshToken || !refreshExpiresAt || !role) {
      return Response.json(
        {
          success: false,
          message: 'Không nhận được access token hoặc refresh token hoặc role',
        },
        { status: 400 }
      );
    }
    const payLoad = decodeJWT<PayLoadJWT>(accessToken);
    const expresDateAccessToken = new Date(payLoad.exp * 1000).toUTCString();
    const expresDateRefreshToken = new Date(refreshExpiresAt).toUTCString();
    return Response.json(
      {
        success: true,
        data: res.payload ?? null,
      },
      {
        status: 200,
        headers: <any>{
          'Set-Cookie': [
            `access_token=${accessToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=${expresDateAccessToken}`,
            `refresh_token=${refreshToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=${expresDateRefreshToken}`,
            `role=${role}; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=${expresDateRefreshToken}`,
          ],
        },
      }
    );
  } catch {
    return Response.json(
      {
        success: false,
        message: 'Lỗi khi nhận được access token hoặc refresh token',
      },
      { status: 400 }
    );
  }
}
