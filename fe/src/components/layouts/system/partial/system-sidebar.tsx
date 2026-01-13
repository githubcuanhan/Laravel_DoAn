'use client';

import * as React from 'react';

import { Home, User, BookOpen, List, Command, Clock, Info } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { NavUser } from '@/components/layouts/admin/partial/nav-user';
import { NavMain } from '@/components/layouts/admin/partial/nav-main';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';


export default function SystemSidebar(
  props: React.ComponentProps<typeof Sidebar>
) {
  const user = useUserStore((s) => s.user);
  const pathname = usePathname();

  const items = React.useMemo(
    () => {
      // Menu cơ bản cho tất cả (kể cả khách vãng lai)
      const baseItems = [
        { title: 'Trang chủ', url: '/', icon: Home },
        { title: 'Danh sách sách', url: '/sach', icon: BookOpen },
        { title: 'Giới thiệu', url: '/about', icon: Info },
      ];

      // Menu chỉ dành cho người dùng đã đăng nhập
      const authItems = [
        { title: 'Lịch sử mượn', url: '/phieu-muon', icon: Clock },
        { title: 'Giỏ mượn sách', url: '/cart', icon: List },
        { title: 'Hồ sơ', url: '/profile', icon: User },
      ];

      return user ? [...baseItems, ...authItems] : baseItems;
    },
    [user]
  );

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
                <span className="truncate font-medium">Thư viện</span>
                <span className="truncate text-xs">
                  {user?.hoTen ?? 'Khách vãng lai'}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>
      <SidebarFooter>
        {user ? (
          <NavUser
            user={{ name: user.hoTen || 'Người dùng', email: user.email || '', avatar: '' }}
          />
        ) : (
          <div className="p-2">
            <a
              href="/auth/login"
              className="flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Đăng nhập
            </a>
          </div>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

