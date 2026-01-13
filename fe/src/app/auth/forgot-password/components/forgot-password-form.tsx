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
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordBodySchema } from "@/lib/schemas/auth.schema";
import { ForgotPasswordBody } from "@/lib/types/auth.types";
import authService from "@/services/auth";
import { handleErrorApi } from "@/lib/utils/mini";
import { useState } from "react";

export function ForgotPasswordForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const form = useForm<ForgotPasswordBody>({
    resolver: zodResolver(forgotPasswordBodySchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordBody) => {
    try {
      const response = await authService.forgotPassword(data);
      if (response.payload.success) {
        setIsSuccess(true);
          toast.success('Thành công', {
          description:
            response.payload.message ||
            "Vui lòng kiểm tra email để đặt lại mật khẩu",
        });
        form.reset();
      }
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Quên mật khẩu?</CardTitle>
        <CardDescription>
          Nhập email và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu cho bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSuccess && (
          <Alert className="mb-4 border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              <p className="font-semibold">Email đã được gửi!</p>
              <p className="text-sm mt-1">
                Vui lòng kiểm tra hộp thư đến của bạn và làm theo hướng dẫn để
                đặt lại mật khẩu.
              </p>
            </AlertDescription>
          </Alert>
        )}

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

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Đang gửi..."
              : "Gửi link đặt lại mật khẩu"}
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
