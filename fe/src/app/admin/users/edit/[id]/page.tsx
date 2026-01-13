'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { updateUserBodySchema } from '@/lib/schemas/user.schema';
import type { UpdateUserBody, User } from '@/lib/types/user.types';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  UserCog,
  ArrowLeft,
  Mail,
  Lock,
  Phone,
  Calendar,
  MapPin,
  GraduationCap,
  School,
  Shield,
  Activity,
} from 'lucide-react';
import userService from '@/services/user';
import lopService from '@/services/lop';
import type { Lop } from '@/lib/types/lop.types';
import Link from 'next/link';
import { handleErrorApi } from '@/lib/utils/mini';

export default function EditUser() {
  const router = useRouter();
  const params = useParams();
  const userId = Number(params.id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [lopList, setLopList] = useState<Lop[]>([]);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UpdateUserBody>({
    resolver: zodResolver(updateUserBodySchema),
    defaultValues: {
      hoTen: '',
      email: '',
      password: '',
      vaiTro: 'bandoc',
      trangThai: 'hoat_dong',
      soDienThoai: '',
      ngaySinh: '',
      diaChi: '',
      idLop: null,
      maSinhVien: '',
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      setFetching(true);
      setError(null);
      try {
        const res = await userService.getOne(userId);
        if (res.payload.success) {
          const user = res.payload.data;
          form.reset({
            hoTen: user.hoTen,
            email: user.email,
            password: '',
            vaiTro: user.vaiTro,
            trangThai: user.trangThai,
            soDienThoai: user.soDienThoai || '',
            ngaySinh: user.ngaySinh || '',
            diaChi: user.diaChi || '',
            idLop: user.idLop || null,
            maSinhVien: user.maSinhVien || '',
          });
        } else {
          setError(res.payload.message || 'Không tải được dữ liệu');
        }
      } catch (err: any) {
        handleErrorApi({ error: err, setError: setError });
      } finally {
        setFetching(false);
      }
    };

    fetchUser();
  }, [userId, form]);

  useEffect(() => {
    const fetchLopList = async () => {
      try {
        const res = await lopService.getAll();
        if (res.payload.success) {
          const data = Array.isArray(res.payload.data)
            ? res.payload.data
            : res.payload.data.data;
          setLopList(data);
        }
      } catch (err) {
        handleErrorApi({ error: err, setError: setError });
      }
    };
    fetchLopList();
  }, []);

  const onSubmit = async (data: UpdateUserBody) => {
    try {
      setLoading(true);
      const payload = {
        ...data,
        password: data.password || undefined,
        soDienThoai: data.soDienThoai || null,
        ngaySinh: data.ngaySinh || null,
        diaChi: data.diaChi || null,
        idLop: data.idLop || null,
        maSinhVien: data.maSinhVien || null,
      };

      const response = await userService.updateUser(userId, payload);

      if (response.payload.success) {
          toast.success('Thành công', {
          description: 'Người dùng đã được cập nhật',
        });
        router.push('/admin/users');
      }
    } catch (err: any) {
      handleErrorApi({ error: err, setError: form.setError });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-t-primary border-b-primary/30 border-l-transparent border-r-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 ">
        <div className="p-10 text-center border rounded-lg">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => router.push('/admin/users')}>
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 ">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/admin/users"
          className="hover:text-primary transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Quản lý người dùng
        </Link>
        <span>/</span>
        <span className="text-foreground">Chỉnh sửa</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Chỉnh sửa Người dùng</h1>
          <p className="text-muted-foreground mt-1">
            Cập nhật thông tin tài khoản
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="border rounded-lg p-6 bg-card">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Thông tin cơ bản */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b">
              <UserCog className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Thông tin cơ bản</h2>
            </div>

            <FieldGroup>
              {/* Họ tên */}
              <Field>
                <FieldLabel htmlFor="hoTen">
                  Họ tên <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  id="hoTen"
                  {...form.register('hoTen')}
                  placeholder="Nhập họ tên"
                  className={cn(
                    form.formState.errors.hoTen && 'border-red-500'
                  )}
                />
                {form.formState.errors.hoTen && (
                  <FieldError>{form.formState.errors.hoTen.message}</FieldError>
                )}
              </Field>

              {/* Email & Password */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel
                    htmlFor="email"
                    className="flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    {...form.register('email')}
                    placeholder="user@example.com"
                    className={cn(
                      form.formState.errors.email && 'border-red-500'
                    )}
                  />
                  {form.formState.errors.email && (
                    <FieldError>
                      {form.formState.errors.email.message}
                    </FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel
                    htmlFor="password"
                    className="flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Mật khẩu mới (để trống nếu không đổi)
                  </FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    {...form.register('password')}
                    placeholder="••••••••"
                    className={cn(
                      form.formState.errors.password && 'border-red-500'
                    )}
                  />
                  {form.formState.errors.password && (
                    <FieldError>
                      {form.formState.errors.password.message}
                    </FieldError>
                  )}
                </Field>
              </div>
            </FieldGroup>
          </div>

          {/* Phân quyền */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Phân quyền & Trạng thái</h2>
            </div>

            <FieldGroup>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel
                    htmlFor="vaiTro"
                    className="flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    Vai trò <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Controller
                    name="vaiTro"
                    control={form.control}
                    render={({ field: { value, onChange } }) => (
                      <Select value={value} onValueChange={onChange}>
                        <SelectTrigger
                          className={cn(
                            'w-full',
                            form.formState.errors.vaiTro && 'border-red-500'
                          )}
                        >
                          <SelectValue placeholder="Chọn vai trò" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bandoc">Bạn đọc</SelectItem>
                          <SelectItem value="thuthu">Thủ thư</SelectItem>
                          <SelectItem value="admin">Quản trị viên</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.vaiTro && (
                    <FieldError>
                      {form.formState.errors.vaiTro.message}
                    </FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel
                    htmlFor="trangThai"
                    className="flex items-center gap-2"
                  >
                    <Activity className="w-4 h-4" />
                    Trạng thái <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Controller
                    name="trangThai"
                    control={form.control}
                    render={({ field: { value, onChange } }) => (
                      <Select value={value} onValueChange={onChange}>
                        <SelectTrigger
                          className={cn(
                            'w-full',
                            form.formState.errors.trangThai && 'border-red-500'
                          )}
                        >
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hoat_dong">Hoạt động</SelectItem>
                          <SelectItem value="tam_khoa">Tạm khóa</SelectItem>
                          <SelectItem value="ngung">Ngừng</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.trangThai && (
                    <FieldError>
                      {form.formState.errors.trangThai.message}
                    </FieldError>
                  )}
                </Field>
              </div>
            </FieldGroup>
          </div>

          {/* Thông tin liên hệ */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Phone className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Thông tin liên hệ</h2>
            </div>

            <FieldGroup>
              {/* SĐT & Ngày sinh */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel
                    htmlFor="soDienThoai"
                    className="flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Số điện thoại
                  </FieldLabel>
                  <Input
                    id="soDienThoai"
                    {...form.register('soDienThoai')}
                    placeholder="0912345678"
                  />
                </Field>

                <Field>
                  <FieldLabel
                    htmlFor="ngaySinh"
                    className="flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Ngày sinh
                  </FieldLabel>
                  <Input
                    id="ngaySinh"
                    type="date"
                    {...form.register('ngaySinh')}
                  />
                </Field>
              </div>

              {/* Địa chỉ */}
              <Field>
                <FieldLabel
                  htmlFor="diaChi"
                  className="flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  Địa chỉ
                </FieldLabel>
                <Textarea
                  id="diaChi"
                  {...form.register('diaChi')}
                  placeholder="Nhập địa chỉ..."
                  rows={3}
                  className="resize-none"
                />
              </Field>
            </FieldGroup>
          </div>

          {/* Thông tin sinh viên */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b">
              <GraduationCap className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Thông tin sinh viên</h2>
            </div>

            <FieldGroup>
              {/* Mã SV & Lớp */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel
                    htmlFor="maSinhVien"
                    className="flex items-center gap-2"
                  >
                    <GraduationCap className="w-4 h-4" />
                    Mã sinh viên
                  </FieldLabel>
                  <Input
                    id="maSinhVien"
                    {...form.register('maSinhVien')}
                    placeholder="SV001"
                  />
                </Field>

                <Field>
                  <FieldLabel
                    htmlFor="idLop"
                    className="flex items-center gap-2"
                  >
                    <School className="w-4 h-4" />
                    Lớp
                  </FieldLabel>
                  <Controller
                    name="idLop"
                    control={form.control}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        value={value?.toString() || 'null'}
                        onValueChange={(val) =>
                          onChange(val === 'null' ? null : Number(val))
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="-- Chọn lớp --" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="null">-- Không chọn --</SelectItem>
                          {lopList.map((lop) => (
                            <SelectItem
                              key={lop.idLop}
                              value={lop.idLop.toString()}
                            >
                              {lop.tenLop}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
              </div>
            </FieldGroup>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/users')}
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
                'Cập nhật Người dùng'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
