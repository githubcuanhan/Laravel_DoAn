"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, Users, Clock, Shield, Search, Heart } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

export default function AboutPage() {
  const user = useUserStore((s) => s.user);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="border-primary/50 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="pt-6">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Về Thư viện</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Hệ thống quản lý thư viện hiện đại, giúp bạn dễ dàng tìm kiếm và mượn sách trực tuyến
            </p>
            <div className="flex gap-3 justify-center">
              {user ? (
                <>
                  <Button asChild size="lg">
                    <Link href="/sach">Khám phá sách</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/cart">Giỏ mượn sách</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild size="lg">
                    <Link href="/auth/register">Đăng ký ngay</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/sach">Khám phá sách</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-lg">Tìm kiếm dễ dàng</CardTitle>
            <CardDescription>
              Tra cứu sách theo tên, tác giả, danh mục với công cụ tìm kiếm mạnh mẽ
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-lg">Kho sách phong phú</CardTitle>
            <CardDescription>
              Hàng ngàn đầu sách từ nhiều lĩnh vực khác nhau, cập nhật liên tục
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-lg">Mượn trả nhanh chóng</CardTitle>
            <CardDescription>
              Quy trình mượn/trả sách đơn giản, theo dõi lịch sử dễ dàng
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-lg">Hỗ trợ tận tâm</CardTitle>
            <CardDescription>
              Đội ngũ thủ thư chuyên nghiệp, sẵn sàng hỗ trợ bạn mọi lúc
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-lg">An toàn & Bảo mật</CardTitle>
            <CardDescription>
              Thông tin cá nhân được bảo vệ tuyệt đối với công nghệ mã hóa hiện đại
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-lg">Miễn phí sử dụng</CardTitle>
            <CardDescription>
              Hoàn toàn miễn phí cho sinh viên và độc giả đăng ký
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* How it works */}
      <Card>
        <CardHeader>
          <CardTitle>Cách sử dụng</CardTitle>
          <CardDescription>Chỉ với 4 bước đơn giản</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-3">
                1
              </div>
              <h3 className="font-semibold mb-2">Đăng ký tài khoản</h3>
              <p className="text-sm text-muted-foreground">
                Tạo tài khoản miễn phí chỉ trong vài phút
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-3">
                2
              </div>
              <h3 className="font-semibold mb-2">Tìm sách yêu thích</h3>
              <p className="text-sm text-muted-foreground">
                Duyệt và tìm kiếm sách trong kho
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-3">
                3
              </div>
              <h3 className="font-semibold mb-2">Tạo phiếu mượn</h3>
              <p className="text-sm text-muted-foreground">
                Thêm sách vào giỏ và tạo phiếu mượn
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-3">
                4
              </div>
              <h3 className="font-semibold mb-2">Nhận sách</h3>
              <p className="text-sm text-muted-foreground">
                Đến thư viện nhận sách sau khi được duyệt
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="border-primary/50 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="pt-6">
          <div className="text-center">
            {user ? (
              <>
                <h2 className="text-2xl font-bold mb-2">Bắt đầu mượn sách ngay!</h2>
                <p className="text-muted-foreground mb-4">
                  Khám phá hàng nghìn đầu sách trong thư viện
                </p>
                <Button asChild size="lg">
                  <Link href="/sach">Xem danh sách sách</Link>
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-2">Sẵn sàng bắt đầu?</h2>
                <p className="text-muted-foreground mb-4">
                  Tham gia cùng hàng nghìn độc giả khác ngay hôm nay
                </p>
                <Button asChild size="lg">
                  <Link href="/auth/register">Đăng ký miễn phí</Link>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
