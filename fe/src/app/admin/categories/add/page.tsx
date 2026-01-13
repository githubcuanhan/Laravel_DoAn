"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import categoryService from "@/services/category";
import { FolderPlus, ArrowLeft, Tags, FileText } from "lucide-react";
import { CreateDanhMucBody } from "@/lib/types";
import { createDanhMucBodySchema } from "@/lib/schemas";
import Link from "next/link";
import { handleErrorApi } from "@/lib/utils/mini";

export default function AddCategory() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateDanhMucBody>({
    resolver: zodResolver(createDanhMucBodySchema),
    defaultValues: {
      tenDanhmuc: "",
      moTa: "",
    },
  });

  const onSubmit = async (data: CreateDanhMucBody) => {
    try {
      setLoading(true);
      const response = await categoryService.create(data);

      if (response.payload.success) {
          toast.success("Thành công", {
          description: "Danh mục đã được thêm",
        });
        router.push("/admin/categories");
      }
    } catch (error: any) {
      handleErrorApi({ error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/admin/categories" className="hover:text-primary transition-colors flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Quản lý danh mục
        </Link>
        <span>/</span>
        <span className="text-foreground">Thêm mới</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-4 bg-primary/10 rounded-2xl">
          <FolderPlus className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Thêm Danh mục</h1>
          <p className="text-muted-foreground mt-1">
            Thêm danh mục sách mới vào hệ thống
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
                <FieldError>
                  {form.formState.errors.moTa.message}
                </FieldError>
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
                "Lưu Danh mục"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
