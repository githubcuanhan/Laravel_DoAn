"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import categoryService from "@/services/category";
import { Edit, ArrowLeft, Tags, FileText } from "lucide-react";
import { CreateDanhMucBody, UpdateDanhMucBody } from "@/lib/types";
import { updateDanhMucBodySchema } from "@/lib/schemas";
import Link from "next/link";
import { handleErrorApi } from "@/lib/utils/mini";

export default function EditCategory() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const form = useForm<UpdateDanhMucBody>({
    resolver: zodResolver(updateDanhMucBodySchema),
    defaultValues: {
      tenDanhmuc: "",
      moTa: "",
    },
  });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await categoryService.getOne(id);
        if (res.payload.success) {
          form.reset({
            tenDanhmuc: res.payload.data.tenDanhmuc,
            moTa: res.payload.data.moTa ?? "",
          });
        }
      } catch (err: any) {
        handleErrorApi({ error: err });
      } finally {
        setInitialLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const onSubmit = async (data: UpdateDanhMucBody) => {
    try {
      setLoading(true);

      const res = await categoryService.update(id, data);

      if (res.payload.success) {
          toast.success("Thành công", {
          description: "Danh mục đã được cập nhật",
        });

        router.push("/admin/categories");
      }
    } catch (error: any) {
      handleErrorApi({ error });
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
        <Link href="/admin/categories" className="hover:text-primary transition-colors flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Quản lý danh mục
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
          <h1 className="text-3xl font-bold">Chỉnh sửa Danh mục</h1>
          <p className="text-muted-foreground mt-1">
            Cập nhật thông tin danh mục sách
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="border rounded-lg p-6 bg-card">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="tenDanhMuc" className="flex items-center gap-2">
                <Tags className="w-4 h-4 text-primary" />
                Tên Danh mục
                <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                id="tenDanhMuc"
                placeholder="Nhập tên danh mục"
                {...form.register("tenDanhmuc")}
                className={cn(
                  form.formState.errors.tenDanhmuc && "border-red-500"
                )}
                disabled={loading}
              />
              {form.formState.errors.tenDanhmuc && (
                <FieldError>
                  {form.formState.errors.tenDanhmuc.message}
                </FieldError>
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
                className={cn(
                  form.formState.errors.moTa && "border-red-500",
                  "resize-none"
                )}
                disabled={loading}
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
              onClick={() => router.push("/admin/categories")}
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
                "Cập nhật Danh mục"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
