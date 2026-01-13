'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createKhuBodySchema } from '@/lib/schemas/library.schema';
import type { CreateKhuBody } from '@/lib/types/library.types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel, FieldError, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner";
import areaService from '@/services/area';
import { MapPinPlus, ArrowLeft, MapPin, FileText, LocateFixed } from 'lucide-react';
import Link from 'next/link';
import { handleErrorApi } from '@/lib/utils/mini';

export default function AddKhu() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateKhuBody>({
    resolver: zodResolver(createKhuBodySchema),
    defaultValues: {
      tenKhu: '',
      viTri: '',
      moTa: '',
    },
  });

  const onSubmit = async (data: CreateKhuBody) => {
    try {
      setLoading(true);
      const response = await areaService.create(data);
      if (response.payload.success) {
          toast.success('Thành công', {
          description: 'Khu vực đã được thêm',
        });
        router.push('/admin/area');
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
        <Link href="/admin/area" className="hover:text-primary transition-colors flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Quản lý khu vực
        </Link>
        <span>/</span>
        <span className="text-foreground">Thêm mới</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-4 bg-primary/10 rounded-2xl">
          <MapPinPlus className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Thêm Khu vực Mới</h1>
          <p className="text-muted-foreground mt-1">
            Điền thông tin để tạo khu vực mới trong thư viện
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
                {...form.register('tenKhu')}
                className={cn(form.formState.errors.tenKhu && 'border-red-500')}
              />
              {form.formState.errors.tenKhu && (
                <FieldError>{form.formState.errors.tenKhu.message}</FieldError>
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
                {...form.register('viTri')}
                className={cn(form.formState.errors.viTri && 'border-red-500')}
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
                {...form.register('moTa')}
                className={cn(form.formState.errors.moTa && 'border-red-500', 'resize-none')}
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
              onClick={() => router.push('/admin/area')}
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
                'Lưu Khu vực'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
