"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createKhuBodySchema } from "@/lib/schemas/library.schema";
import type { CreateKhuBody } from "@/lib/types/library.types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import areaService from "@/services/area";
import { Edit, ArrowLeft, MapPin, LocateFixed, FileText } from "lucide-react";
import Link from "next/link";
import { handleErrorApi } from "@/lib/utils/mini";

export default function EditKhu() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const form = useForm<CreateKhuBody>({
    resolver: zodResolver(createKhuBodySchema),
    defaultValues: {
      tenKhu: "",
      viTri: "",
      moTa: "",
    },
  });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await areaService.getOne(id);
        if (res.payload.success) {
          form.reset({
            tenKhu: res.payload.data.tenKhu,
            viTri: res.payload.data.viTri ?? "",
            moTa: res.payload.data.moTa ?? "",
          });
        }
      } catch (err: any) {
        handleErrorApi({ error: err });
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) {
      fetchDetail();
    }
  }, [id, form]);

  const onSubmit = async (data: CreateKhuBody) => {
    try {
      setLoading(true);
      const res = await areaService.update(id, data);

      if (res.payload.success) {
          toast.success("Thành công", {
          description: "Khu vực đã được cập nhật",
        });

        router.push("/admin/area");
      }
    } catch (error: any) {
      handleErrorApi({ error, setError: form.setError });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-t-primary border-b-primary/30 border-l-transparent border-r-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/admin/area" className="hover:text-primary transition-colors flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Quản lý khu vực
        </Link>
        <span>/</span>
        <span className="text-foreground">Chỉnh sửa</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-4 bg-primary/10 rounded-2xl">
          <Edit className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Chỉnh sửa Khu vực</h1>
          <p className="text-muted-foreground mt-1">
            Cập nhật thông tin khu vực trong thư viện
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="border rounded-lg p-6 bg-card">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="tenKhu" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Tên Khu
                <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                id="tenKhu"
                placeholder="Nhập tên khu"
                {...form.register("tenKhu")}
                className={cn(
                  form.formState.errors.tenKhu && "border-red-500"
                )}
              />
              {form.formState.errors.tenKhu && (
                <FieldError>
                  {form.formState.errors.tenKhu.message}
                </FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="viTri" className="flex items-center gap-2">
                <LocateFixed className="w-4 h-4 text-primary" />
                Vị Trí
                <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                id="viTri"
                placeholder="Nhập vị trí"
                {...form.register("viTri")}
                className={cn(
                  form.formState.errors.viTri && "border-red-500"
                )}
              />
              {form.formState.errors.viTri && (
                <FieldError>{form.formState.errors.viTri.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="moTa" className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Mô Tả
              </FieldLabel>
              <Textarea
                id="moTa"
                placeholder="Nhập mô tả (tùy chọn)"
                rows={3}
                {...form.register("moTa")}
                className={cn(form.formState.errors.moTa && "border-red-500", "resize-none")}
              />
              {form.formState.errors.moTa && (
                <FieldError>{form.formState.errors.moTa.message}</FieldError>
              )}
            </Field>
          </FieldGroup>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/area")}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Đang lưu...
                </>
              ) : (
                "Cập nhật Khu vực"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
