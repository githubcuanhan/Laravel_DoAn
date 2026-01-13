"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useUserStore } from "@/store/useUserStore";
import userService from "@/services/user";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  IdCard,
  Lock,
  Key,
  Edit,
  Save,
  X,
} from "lucide-react";
import { updateUserBodySchema } from "@/lib/schemas/user.schema";
import { UpdateUserBody } from "./types";
import lopService from "@/services/lop";
import type { Lop } from "@/lib/types/lop.types";
import { LogoutBtn } from "@/components/logout-btn";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ProfilePage() {
  const user = useUserStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<Lop[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const updateForm = useForm<UpdateUserBody>({
    resolver: zodResolver(updateUserBodySchema),
    defaultValues: {
      hoTen: user?.hoTen ?? "",
      email: user?.email ?? "",
      soDienThoai: user?.soDienThoai ?? "",
      vaiTro: user?.vaiTro ?? "bandoc",
      trangThai: user?.trangThai ?? "hoat_dong",
      ngaySinh: user?.ngaySinh ?? null,
      diaChi: user?.diaChi ?? null,
      idLop: user?.idLop ?? null,
      maSinhVien: user?.maSinhVien ?? null,
      password: "",
      password_confirmation: "",
    },
  });

  useEffect(() => {
    updateForm.reset({
      hoTen: user?.hoTen ?? "",
      email: user?.email ?? "",
      soDienThoai: user?.soDienThoai ?? "",
      vaiTro: user?.vaiTro ?? "bandoc",
      trangThai: user?.trangThai ?? "hoat_dong",
      ngaySinh: user?.ngaySinh ?? null,
      diaChi: user?.diaChi ?? null,
      idLop: user?.idLop ?? null,
      maSinhVien: user?.maSinhVien ?? null,
      password: "",
      password_confirmation: "",
    });
  }, [user, updateForm]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await lopService.getAll();
        const data = res.payload.data;
        if (Array.isArray(data)) {
          setClasses(data);
        }
      } catch (error) {
        console.error("Không thể tải danh sách lớp:", error);
      }
    };
    fetchClasses();
  }, []);

  const onSubmit = async (data: UpdateUserBody) => {
    try {
      setLoading(true);
      const res = await userService.updateUser(user!.id, data);
      useUserStore.setState({ user: res.payload.data });
        toast.success("Thành công", { description: "Cập nhật thông tin thành công!" });
      updateForm.reset({ ...data, password: "", password_confirmation: "" });
      setIsEditing(false);
    } catch (err) {
      const message =
        err instanceof Error && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message || "Có lỗi xảy ra."
          : "Có lỗi xảy ra.";
        toast.error("Lỗi", { description: message });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (value?: string | null) => {
    if (!value) return "Chưa cập nhật";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
  };

  return (
    <>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Thông tin cá nhân</h1>
          <p className="text-muted-foreground">
            Quản lý thông tin và lịch sử mượn sách của bạn
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="space-y-6">
            {/* Avatar Card */}
            <Card>
              <CardContent className="p-6 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarFallback className="text-2xl">
                    {user?.hoTen?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold mb-1">{user?.hoTen}</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {user?.email}
                </p>
                <div className="space-y-2">
                  <Button
                    variant={isEditing ? "outline" : "default"}
                    className="w-full"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? (
                      <>
                        <X className="w-4 h-4 mr-2" />
                        Hủy chỉnh sửa
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Chỉnh sửa hồ sơ
                      </>
                    )}
                  </Button>
                  <LogoutBtn className="w-full" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Thông tin cá nhân
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isEditing ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="flex items-center gap-2 text-muted-foreground">
                        <User className="w-4 h-4" />
                        Họ và tên
                      </Label>
                      <p className="text-sm font-medium">{user?.hoTen}</p>
                    </div>

                    <div className="space-y-1">
                      <Label className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        Email
                      </Label>
                      <p className="text-sm font-medium">{user?.email}</p>
                    </div>

                    <div className="space-y-1">
                      <Label className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        Số điện thoại
                      </Label>
                      <p className="text-sm font-medium">
                        {user?.soDienThoai || "Chưa cập nhật"}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <Label className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        Ngày sinh
                      </Label>
                      <p className="text-sm font-medium">
                        {formatDate(user?.ngaySinh)}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <Label className="flex items-center gap-2 text-muted-foreground">
                        <IdCard className="w-4 h-4" />
                        Mã sinh viên
                      </Label>
                      <p className="text-sm font-medium">
                        {user?.maSinhVien || "Chưa cập nhật"}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <Label className="flex items-center gap-2 text-muted-foreground">
                        <GraduationCap className="w-4 h-4" />
                        Lớp
                      </Label>
                      <p className="text-sm font-medium">
                        {user?.lop?.tenLop ||
                          user?.idLop?.toString() ||
                          "Chưa cập nhật"}
                      </p>
                    </div>

                    <div className="md:col-span-2 space-y-1">
                      <Label className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        Địa chỉ
                      </Label>
                      <p className="text-sm font-medium">
                        {user?.diaChi || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={updateForm.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hoTen" className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Họ và tên
                        </Label>
                        <Input
                          id="hoTen"
                          {...updateForm.register("hoTen")}
                          placeholder="Nhập họ tên"
                        />
                        {updateForm.formState.errors.hoTen && (
                          <p className="text-xs text-destructive">
                            {updateForm.formState.errors.hoTen.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          {...updateForm.register("email")}
                          placeholder="email@example.com"
                        />
                        {updateForm.formState.errors.email && (
                          <p className="text-xs text-destructive">
                            {updateForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="soDienThoai" className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Số điện thoại
                        </Label>
                        <Input
                          id="soDienThoai"
                          type="tel"
                          {...updateForm.register("soDienThoai")}
                          placeholder="0123456789"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ngaySinh" className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Ngày sinh
                        </Label>
                        <Input
                          id="ngaySinh"
                          type="date"
                          {...updateForm.register("ngaySinh", {
                            setValueAs: (value) => (value === "" ? null : value),
                          })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maSinhVien" className="flex items-center gap-2">
                          <IdCard className="w-4 h-4" />
                          Mã sinh viên
                        </Label>
                        <Input
                          id="maSinhVien"
                          {...updateForm.register("maSinhVien")}
                          placeholder="VD: B21DCCN001"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="idLop" className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" />
                          Lớp
                        </Label>
                        <select
                          id="idLop"
                          {...updateForm.register("idLop", {
                            setValueAs: (value) =>
                              value === "" ? null : Number(value),
                          })}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <option value="">Chọn lớp</option>
                          {classes.map((lop) => (
                            <option key={lop.idLop} value={lop.idLop}>
                              {lop.tenLop}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="diaChi" className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Địa chỉ
                        </Label>
                        <Textarea
                          id="diaChi"
                          {...updateForm.register("diaChi")}
                          rows={2}
                          placeholder="Nhập địa chỉ"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          Mật khẩu mới (nếu muốn đổi)
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          {...updateForm.register("password")}
                          placeholder="Nhập mật khẩu mới"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password_confirmation" className="flex items-center gap-2">
                          <Key className="w-4 h-4" />
                          Xác nhận mật khẩu
                        </Label>
                        <Input
                          id="password_confirmation"
                          type="password"
                          {...updateForm.register("password_confirmation")}
                          placeholder="Nhập lại mật khẩu"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
    </>
  );
}
