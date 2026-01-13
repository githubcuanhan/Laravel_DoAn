import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Chỉ kiểm tra với các route admin
  if (pathname.startsWith('/admin')) {
    const accessToken = request.cookies.get('access_token')?.value
    const role = request.cookies.get('role')?.value

    // Nếu chưa đăng nhập (không có access token)
    if (!accessToken) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Nếu không có role, xóa token và redirect về login
    if (!role) {
      const response = NextResponse.redirect(new URL('/auth/login', request.url))
      response.cookies.delete('access_token')
      response.cookies.delete('refresh_token')
      response.cookies.delete('role')
      return response
    }

    // Kiểm tra role: chỉ cho phép 'admin' và 'thuthu'
    const allowedRoles = ['admin', 'thuthu']
    if (!allowedRoles.includes(role)) {
      // Nếu là 'bandoc' hoặc role khác, redirect về home
      return NextResponse.redirect(new URL('/?error_role=Không có quyền truy cập', request.url))
    }
  }

  // Cho phép request tiếp tục nếu đủ quyền
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Áp dụng cho tất cả route admin
    '/admin/:path*',
  ],
}