"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginBodySchema } from "@/lib/schemas/auth.schema";
import { LoginBody } from "@/lib/types/auth.types";
import authService from "@/services/auth";
import { clientSessionToken } from "@/lib/http";
import { useUserStore } from "@/store/useUserStore";
import { handleErrorApi } from "@/lib/utils/mini";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const form = useForm<LoginBody>({
    resolver: zodResolver(loginBodySchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginBody) => {
    try {
      const response = await authService.login(data);
      if (response.payload.success) {
        clientSessionToken.value = response.payload.data.access_token;
        clientSessionToken.refreshToken = response.payload.data.refresh_token;
        await authService.auth({
          accessToken: response.payload.data.access_token,
          refreshToken: response.payload.data.refresh_token,
          refreshExpiresAt: response.payload.data.refresh_expires_at,
          role: response.payload.data.user.vaiTro,
        });
        useUserStore.getState().setUser(response.payload.data.user);
        if (response.payload.data.user.vaiTro === 'admin' || response.payload.data.user.vaiTro === 'thuthu') {
          router.push("/admin/dashboard");
        } else {
          router.push("/");
        }
          toast.success('Thành công', {
          description: response.payload.message,
        });
      }
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đăng nhập</CardTitle>
        <CardDescription>
          Nhập thông tin đăng nhập để tiếp tục
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...form.register("email")}
              className={form.formState.errors.email ? "border-destructive" : ""}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mật khẩu</Label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...form.register("password")}
              className={
                form.formState.errors.password ? "border-destructive" : ""
              }
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Chưa có tài khoản?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-primary hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
