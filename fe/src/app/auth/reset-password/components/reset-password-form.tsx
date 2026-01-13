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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordBodySchema } from "@/lib/schemas/auth.schema";
import { ResetPasswordBody } from "@/lib/types/auth.types";
import authService from "@/services/auth";
import { handleErrorApi } from "@/lib/utils/mini";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const form = useForm<ResetPasswordBody>({
    resolver: zodResolver(resetPasswordBodySchema),
    defaultValues: {
      token: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  // Set token và email từ URL vào form
  useEffect(() => {
    if (token) {
      form.setValue("token", token);
    }
    if (email) {
      form.setValue("email", email);
    }
  }, [token, email, form]);

  const onSubmit = async (data: ResetPasswordBody) => {
    try {
      const response = await authService.resetPassword(data);
      if (response.payload.success) {
          toast.success('Thành công', {
          description:
            response.payload.message || "Đặt lại mật khẩu thành công",
        });
        // Chuyển về trang đăng nhập sau 2 giây
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      }
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
    }
  };

  // Kiểm tra có token và email không
  if (!token || !email) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-destructive">Link không hợp lệ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu
              cầu link mới để tiếp tục.
            </AlertDescription>
          </Alert>
          <Button asChild className="w-full">
            <Link href="/auth/forgot-password">
              Quay lại trang quên mật khẩu
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Đặt lại mật khẩu</CardTitle>
        <CardDescription>
          Nhập mật khẩu mới để tiếp tục sử dụng tài khoản của bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              disabled
              {...form.register("email")}
              className="cursor-not-allowed opacity-60"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu mới</Label>
            <Input
              id="password"
              type="password"
              placeholder="Nhập mật khẩu mới"
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
            <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Nhập lại mật khẩu mới"
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
              ? "Đang đặt lại mật khẩu..."
              : "Đặt lại mật khẩu"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Nhớ mật khẩu?{" "}
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
