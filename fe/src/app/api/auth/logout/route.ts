import authApiRequest from '@/services/auth';
import { cookies } from 'next/headers';
import { HttpError } from '@/lib/http';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token');
  const resBody = await request.json();
  const force = resBody.force as boolean | undefined;
  if (force) {
    return Response.json(
      {
        success: true,
        message: 'Buộc đăng xuất thành công',
      },
      {
        status: 200,
        headers: <any>{
          'Set-Cookie': [
            'access_token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0',
            'refresh_token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0', 
            'role=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0',
          ],
        },
      }
    );
  }
  if (!accessToken) {
    return Response.json(
      {
        success: false,
        message: 'Không nhận được access token',
      },
      { status: 400 }
    );
  }

  try {
    const res = await authApiRequest.logoutFromNextServer(accessToken.value);
    return Response.json(res.payload, {
      status: 200,
      headers: <any>{
        'Set-Cookie': [
          'access_token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0',
          'refresh_token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0',
          'role=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0',
        ],
      },
    });
  } catch (error: unknown) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      });
    }

    return Response.json(
      {
        success: false,
        message: 'Lỗi khi đăng xuất',
      },
      { status: 400 }
    );
  }
}
