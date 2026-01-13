"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createKeSachBodySchema } from "@/lib/schemas/library.schema";
import type { CreateKeSachBody, Khu } from "@/lib/types/library.types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import bookshelvesService from "@/services/bookshelf";
import areaService from "@/services/area";
import { BookPlus, ArrowLeft, BookOpen, MapPin, FileText } from "lucide-react";
import Link from "next/link";
import { handleErrorApi } from "@/lib/utils/mini";

export default function AddKeSach() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingKhu, setFetchingKhu] = useState(true);
  const [khuList, setKhuList] = useState<Khu[]>([]);

  const form = useForm<CreateKeSachBody>({
    resolver: zodResolver(createKeSachBodySchema),
    defaultValues: {
      tenKe: "",
      moTa: "",
      idKhu: 0,
    },
  });

  useEffect(() => {
    const fetchKhu = async () => {
      setFetchingKhu(true);
      try {
        const res = await areaService.getAll(1, 100);
        if (res.payload.success) {
          setKhuList(res.payload.data.data);
        }
      } catch (err: any) {
        handleErrorApi({ error: err });
      } finally {
        setFetchingKhu(false);
      }
    };
    fetchKhu();
  }, []);

  const onSubmit = async (data: CreateKeSachBody) => {
    try {
      setLoading(true);
      const response = await bookshelvesService.create({ ...data, idKhu: Number(data.idKhu) });
      if (response.payload.success) {
          toast.success("Thành công", { description: "Kệ sách đã được thêm" });
        router.push("/admin/bookshelves");
      }
    } catch (error: any) {
      handleErrorApi({ error, setError: form.setError });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/admin/bookshelves" className="hover:text-primary transition-colors flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Quản lý kệ sách
        </Link>
        <span>/</span>
        <span className="text-foreground">Thêm mới</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-4 bg-primary/10 rounded-2xl">
          <BookPlus className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Thêm Kệ sách Mới</h1>
          <p className="text-muted-foreground mt-1">
            Điền thông tin để tạo kệ sách mới trong thư viện
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="border rounded-lg p-6 bg-card">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="tenKe" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                Tên Kệ
                <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                id="tenKe"
                placeholder="Nhập tên kệ"
                {...form.register("tenKe")}
                className={cn(form.formState.errors.tenKe && "border-red-500")}
                disabled={loading || fetchingKhu}
              />
              {form.formState.errors.tenKe && (
                <FieldError>{form.formState.errors.tenKe.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="idKhu" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Khu Vực
                <span className="text-red-500">*</span>
              </FieldLabel>
              <Controller
                name="idKhu"
                control={form.control}
                render={({ field }) => (
                  <Select
                    value={field.value?.toString() || ""}
                    onValueChange={(val) => field.onChange(Number(val))}
                    disabled={loading || fetchingKhu}
                  >
                    <SelectTrigger className={cn(
                      form.formState.errors.idKhu && "border-red-500"
                    )}>
                      <SelectValue placeholder="Chọn khu vực" />
                    </SelectTrigger>
                    <SelectContent>
                      {khuList.map((khu) => (
                        <SelectItem key={khu.idKhu} value={khu.idKhu.toString()}>
                          {khu.tenKhu}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.idKhu && (
                <FieldError>{form.formState.errors.idKhu.message}</FieldError>
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
                disabled={loading || fetchingKhu}
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
              onClick={() => router.push("/admin/bookshelves")}
              disabled={loading || fetchingKhu}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading || fetchingKhu}>
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Đang lưu...
                </>
              ) : (
                "Lưu Kệ sách"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
