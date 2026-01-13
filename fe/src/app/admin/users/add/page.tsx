"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createUserBodySchema } from "@/lib/schemas/user.schema";
import type { CreateUserBody } from "@/lib/types/user.types";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldLabel,
    FieldError,
    FieldGroup,
} from "@/components/ui/field";
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
import { UserPlus, ArrowLeft, Mail, Lock, Phone, Calendar, MapPin, GraduationCap, School, Shield, Activity } from "lucide-react";
import userService from "@/services/user";
import lopService from "@/services/lop";
import type { Lop } from "@/lib/types/lop.types";
import Link from "next/link";
import { handleErrorApi } from "@/lib/utils/mini";

export default function AddUser() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [lopList, setLopList] = useState<Lop[]>([]);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<CreateUserBody>({
        resolver: zodResolver(createUserBodySchema),
        defaultValues: {
            hoTen: "",
            email: "",
            password: "",
            vaiTro: "bandoc",
            trangThai: "hoat_dong",
            soDienThoai: "",
            ngaySinh: "",
            diaChi: "",
            idLop: null,
            maSinhVien: "",
        },
    });

    // Fetch lop list from API
    useEffect(() => {
        const fetchLopList = async () => {
            try {
                const res = await lopService.getAll();
                if (res.payload.success) {
                    // Check if data is array or paginated
                    const data = Array.isArray(res.payload.data)
                        ? res.payload.data
                        : res.payload.data.data;
                    setLopList(data);
                }
            } catch (err) {
                console.error("Failed to fetch lop list:", err);
            }
        };
        fetchLopList();
    }, []);

    const onSubmit = async (data: CreateUserBody) => {
        try {
            setLoading(true);

            const payload = {
                ...data,
                soDienThoai: data.soDienThoai || null,
                ngaySinh: data.ngaySinh || null,
                diaChi: data.diaChi || null,
                idLop: data.idLop || null,
                maSinhVien: data.maSinhVien || null,
            };

            const response = await userService.create(payload);

            if (response.payload.success) {
                toast.success("Thành công", {
                    description: "Người dùng đã được thêm",
                });
                router.push("/admin/users");
            }
        } catch (err: any) {
            handleErrorApi({ error: err, setError: form.setError });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6 ">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/admin/users" className="hover:text-primary transition-colors flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Quản lý người dùng
                </Link>
                <span>/</span>
                <span className="text-foreground">Thêm mới</span>
            </div>

            {/* Header */}
            <div className="flex items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Thêm Người dùng Mới</h1>
                    <p className="text-muted-foreground mt-1">
                        Điền thông tin để tạo tài khoản mới
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="border rounded-lg p-6 bg-card">
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Thông tin cơ bản */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b">
                            <UserPlus className="w-5 h-5 text-primary" />
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
                                    {...form.register("hoTen")}
                                    placeholder="Nhập họ tên"
                                    className={cn(
                                        form.formState.errors.hoTen && "border-red-500"
                                    )}
                                />
                                {form.formState.errors.hoTen && (
                                    <FieldError>{form.formState.errors.hoTen.message}</FieldError>
                                )}
                            </Field>

                            {/* Email & Password */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel htmlFor="email" className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        Email <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <Input
                                        id="email"
                                        type="email"
                                        {...form.register("email")}
                                        placeholder="user@example.com"
                                        className={cn(
                                            form.formState.errors.email && "border-red-500"
                                        )}
                                    />
                                    {form.formState.errors.email && (
                                        <FieldError>
                                            {form.formState.errors.email.message}
                                        </FieldError>
                                    )}
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="password" className="flex items-center gap-2">
                                        <Lock className="w-4 h-4" />
                                        Mật khẩu <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <Input
                                        id="password"
                                        type="password"
                                        {...form.register("password")}
                                        placeholder="••••••••"
                                        className={cn(
                                            form.formState.errors.password && "border-red-500"
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
                                    <FieldLabel htmlFor="vaiTro" className="flex items-center gap-2">
                                        <Shield className="w-4 h-4" />
                                        Vai trò <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <Controller
                                        name="vaiTro"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger className={cn(
                                                    "w-full",
                                                    form.formState.errors.vaiTro && "border-red-500"
                                                )}>
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
                                    <FieldLabel htmlFor="trangThai" className="flex items-center gap-2">
                                        <Activity className="w-4 h-4" />
                                        Trạng thái <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <Controller
                                        name="trangThai"
                                        control={form.control}
                                        render={({ field: { value, onChange } }) => (
                                            <Select
                                                value={value}
                                                onValueChange={onChange}
                                            >
                                                <SelectTrigger className={cn(
                                                    "w-full",
                                                    form.formState.errors.trangThai && "border-red-500"
                                                )}>
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
                                    <FieldLabel htmlFor="soDienThoai" className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Số điện thoại
                                    </FieldLabel>
                                    <Input
                                        id="soDienThoai"
                                        {...form.register("soDienThoai")}
                                        placeholder="0912345678"
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="ngaySinh" className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Ngày sinh
                                    </FieldLabel>
                                    <Input
                                        id="ngaySinh"
                                        type="date"
                                        {...form.register("ngaySinh")}
                                    />
                                </Field>
                            </div>

                            {/* Địa chỉ */}
                            <Field>
                                <FieldLabel htmlFor="diaChi" className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Địa chỉ
                                </FieldLabel>
                                <Textarea
                                    id="diaChi"
                                    {...form.register("diaChi")}
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
                                    <FieldLabel htmlFor="maSinhVien" className="flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4" />
                                        Mã sinh viên
                                    </FieldLabel>
                                    <Input
                                        id="maSinhVien"
                                        {...form.register("maSinhVien")}
                                        placeholder="SV001"
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="idLop" className="flex items-center gap-2">
                                        <School className="w-4 h-4" />
                                        Lớp
                                    </FieldLabel>
                                    <Controller
                                        name="idLop"
                                        control={form.control}
                                        render={({ field: { value, onChange } }) => (
                                            <Select
                                                value={value?.toString() || "null"}
                                                onValueChange={(val) => onChange(val === "null" ? null : Number(val))}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="-- Chọn lớp --" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="null">-- Không chọn --</SelectItem>
                                                    {lopList.map((lop) => (
                                                        <SelectItem key={lop.idLop} value={lop.idLop.toString()}>
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
                            onClick={() => router.push("/admin/users")}
                            disabled={loading}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                    Đang lưu...
                                </>
                            ) : (
                                "Lưu Người dùng"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

