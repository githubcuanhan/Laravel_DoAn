import authService from '@/services/auth';
import { useUserStore } from '@/store/useUserStore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
export function LogoutBtn({ className }: { className?: string }) {
  const router = useRouter();
  const handleLogout = async () => {
    const response = await authService.logoutFromNextClientToNextServer(true);
    if (response.payload.success) {
      useUserStore.getState().setUser(null);
        toast.success('Thành công', {
        description: response.payload.message,
      });
      router.push('/auth/login');
    }
  };
  return (
    <Button variant="outline" onClick={handleLogout} className={className}>
      Đăng xuất
    </Button>
  );
}
