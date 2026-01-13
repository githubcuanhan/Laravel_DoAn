'use client';
import { useEffect } from 'react';
import authApiRequest from '@/services/auth';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { clientSessionToken } from '@/lib/http';

export default function LogoutPage() {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const sessionToken = searchParams.get('sessionToken');
  useEffect(() => {
    if (sessionToken === clientSessionToken.value) {
      authApiRequest.logoutFromNextClientToNextServer(true).then(() => {
        router.push(`/auth?redirectFrom=${pathName}`);
      });
    }
  }, [sessionToken, router, pathName]);

  return (
    <>
      <p>Bạn đã bị đăng xuất khỏi hệ thống...</p>
    </>
  );
}
