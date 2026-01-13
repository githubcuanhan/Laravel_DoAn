'use client';

import * as React from 'react';
import {
  BookOpen,
  Home,
  Command,
  Users,
  Locate,
  Library,
  School,
  Settings,
  Type,
  FileText,
  Receipt,
  Shield,
  BarChart3,
  type LucideIcon,
} from 'lucide-react';

import { NavMain } from '@/components/layouts/admin/partial/nav-main';
import { NavUser } from '@/components/layouts/admin/partial/nav-user';
import { useUserStore } from '@/store/useUserStore';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive: boolean;
  roles: ('admin' | 'thuthu')[];
}

// Định nghĩa menu theo role
const allMenuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: Home,
    isActive: false,
    roles: ['thuthu', 'admin'],
  },
  {
    title: 'Báo Cáo & Thống Kê',
    url: '/admin/thong-ke', // Link này trỏ đến folder src/app/admin/thong-ke bạn vừa tạo
    icon: BarChart3,
    isActive: false,
    roles: ['thuthu', 'admin'], // Cho phép cả Thủ thư và Admin xem
  },
  {
    title: 'Quản Lý Lớp',
    url: '/admin/class',
    icon: School,
    isActive: false,
    roles: ['thuthu'],
  },
  {
    title: 'Quản Lý Cấu Hình Mượn Trả',
    url: '/admin/cau-hinh-muon-tra',
    icon: Settings,
    isActive: false,
    roles: ['thuthu'],
  },
  {
    title: 'Quản Lý Người Dùng',
    url: '/admin/users',
    icon: Users,
    isActive: false,
    roles: ['thuthu', 'admin'],
  },
  {
    title: 'Quản Lý Khu Vực',
    url: '/admin/area',
    icon: Locate,
    isActive: false,
    roles: ['thuthu'],
  },
  {
    title: 'Quản Lý Kệ Sách',
    url: '/admin/bookshelves',
    icon: Library,
    isActive: false,
    roles: ['thuthu'],
  },
  {
    title: 'Quản Lý Sách',
    url: '/admin/books',
    icon: BookOpen,
    isActive: false,
    roles: ['thuthu'],
  },
  {
    title: 'Quản Lý Danh Mục',
    url: '/admin/categories',
    icon: Type,
    isActive: false,
    roles: ['thuthu'],
  },
  {
    title: 'Quản Lý Phiếu Mượn',
    url: '/admin/phieu-muon',
    icon: FileText,
    isActive: false,
    roles: ['thuthu'],
  },
  {
    title: 'Quản Lý Hóa Đơn',
    url: '/admin/hoa-don',
    icon: Receipt,
    isActive: false,
    roles: ['thuthu'],
  },
];

const getRoleLabel = (role: string | undefined) => {
  switch (role) {
    case 'admin':
      return 'Quản trị viên';
    case 'thuthu':
      return 'Thủ thư';
    default:
      return 'Người dùng';
  }
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUserStore((state) => state.user);
  const userRole = user?.vaiTro as 'admin' | 'thuthu' | undefined;

  // Lọc menu theo role
  const filteredMenuItems = React.useMemo(() => {
    if (!userRole) return [];
    return allMenuItems.filter((item) => item.roles.includes(userRole));
  }, [userRole]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Command className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Quản Lý Thư Viện</span>
                <span className="truncate text-xs">
                  {getRoleLabel(userRole)}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredMenuItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.hoTen || 'Người dùng',
            email: user?.email || '',
            avatar: '',
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
