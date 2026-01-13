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
import { registerBodySchema } from "@/lib/schemas/auth.schema";
import { RegisterBody } from "@/lib/types/auth.types";
import authService from "@/services/auth";
import { clientSessionToken } from "@/lib/http";
import { useUserStore } from "@/store/useUserStore";
import { handleErrorApi } from "@/lib/utils/mini";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const router = useRouter();
  const form = useForm<RegisterBody>({
    resolver: zodResolver(registerBodySchema),
    defaultValues: {
      email: "",
      password: "",
      password_confirmation: "",
      hoTen: "",
    },
  });

  const onSubmit = async (data: RegisterBody) => {
    try {
      const registerResponse = await authService.register(data);
      if (registerResponse.payload.success) {
        // Tự động đăng nhập sau khi đăng ký thành công
        const loginResponse = await authService.login({
          email: data.email,
          password: data.password,
        });

        if (loginResponse.payload.success) {
          clientSessionToken.value = loginResponse.payload.data.access_token;
          clientSessionToken.refreshToken =
            loginResponse.payload.data.refresh_token;
          await authService.auth({
            accessToken: loginResponse.payload.data.access_token,
            refreshToken: loginResponse.payload.data.refresh_token,
            refreshExpiresAt: loginResponse.payload.data.refresh_expires_at,
            role: loginResponse.payload.data.user.vaiTro,
          });
          useUserStore.getState().setUser(loginResponse.payload.data.user);
          router.push("/");
            toast.success('Thành công', {
            description: "Đăng ký tài khoản thành công",
          });
        }
      }
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đăng ký</CardTitle>
        <CardDescription>Tạo tài khoản mới để bắt đầu</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hoTen">
              Họ và tên <span className="text-destructive">*</span>
            </Label>
            <Input
              id="hoTen"
              type="text"
              placeholder="Nguyễn Văn A"
              {...form.register("hoTen")}
              className={form.formState.errors.hoTen ? "border-destructive" : ""}
            />
            {form.formState.errors.hoTen && (
              <p className="text-sm text-destructive">
                {form.formState.errors.hoTen.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
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
            <Label htmlFor="password">
              Mật khẩu <span className="text-destructive">*</span>
            </Label>
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

          <div className="space-y-2">
            <Label htmlFor="confirm-password">
              Xác nhận mật khẩu <span className="text-destructive">*</span>
            </Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Nhập lại mật khẩu"
              {...form.register("password_confirmation")}
              className={
                form.formState.errors.password_confirmation
                  ? "border-destructive"
                  : ""
              }
            />
            {form.formState.errors.password_confirmation && (
              <p className="text-sm text-destructive">
                {form.formState.errors.password_confirmation.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Đang tạo tài khoản..."
              : "Tạo tài khoản"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Đã có tài khoản?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-primary hover:underline"
            >
              Đăng nhập
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
