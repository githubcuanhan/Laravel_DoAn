"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { updateSachBodySchema } from "@/lib/schemas/book.schema";
import type { UpdateSachBody } from "@/lib/types/book.types";
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
import { Edit, ArrowLeft, Book, User, Building, Calendar, Package, FileText, FolderTree, BookOpen, Image, Ruler } from "lucide-react";
import bookshelfService from "@/services/bookshelf";
import bookService from "@/services/book";
import categoryService from "@/services/category";
import { DanhMuc } from "@/lib/types";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { handleErrorApi } from "@/lib/utils/mini";

interface BookImage {
  id?: number;
  file?: File;
  preview: string;
  isNew?: boolean;
}

export default function EditBook() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [fetchingData, setFetchingData] = useState(false);
  const [keSachList, setKeSachList] = useState<any[]>([]);
  const [images, setImages] = useState<BookImage[]>([]);
  const [bookCode, setBookCode] = useState<string>("");
  const [qrLink, setQrLink] = useState<string>("");
  const [danhMucList, setDanhMucList] = useState<DanhMuc[]>([]);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UpdateSachBody & { sizesach?: string }>({
    resolver: zodResolver(updateSachBodySchema),
    defaultValues: {
      tenSach: "",
      tacGia: "",
      nhaXuatBan: "",
      namXuatBan: new Date().getFullYear(),
      soLuong: 1,
      soLuongKhaDung: 1,
      trangThai: "dang_su_dung",
      moTa: "",
      idKeSach: 0,
      danhMucIds: 0,
      maQR: "",
      sizesach: "vua", // Giá trị mặc định
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setFetchingData(true);
        setError(null);

        const [kRes, dRes] = await Promise.all([
          bookshelfService.getAll(1, 100),
          categoryService.getAll(1, 100),
        ]);

        if (kRes.payload.success) {
          setKeSachList(kRes.payload.data.data);
        } else {
          throw new Error(kRes.payload.message);
        }

        if (dRes.payload.success) {
          setDanhMucList(dRes.payload.data.data);
        } else {
          throw new Error(dRes.payload.message);
        }
      } catch (err: any) {
        handleErrorApi({ error: err, setError });
      } finally {
        setFetchingData(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setInitialLoading(true);
        const res = await bookService.getOne(id);
        if (res.payload.success) {
          const data = res.payload.data;
          form.reset({
            maQR: data.maQR,
            maSach: data.maSach,
            tenSach: data.tenSach,
            tacGia: data.tacGia,
            nhaXuatBan: data.nhaXuatBan,
            namXuatBan: data.namXuatBan,
            soLuong: data.soLuong,
            soLuongKhaDung: data.soLuongKhaDung,
            trangThai: data.trangThai,
            moTa: data.moTa,
            idKeSach: data.idKeSach,
            danhMucIds: data.danh_mucs?.[0]?.idDanhmuc || 0,
            sizesach: data.sizesach || "vua", // Lấy dữ liệu từ DB
          });

          setBookCode(data.maSach);
          setQrLink(data.maQR);

          const bookImages: BookImage[] = [];
          if (data.hinh_anhs?.length) {
            data.hinh_anhs.forEach((img: any) => {
              bookImages.push({ preview: img.duongDan, isNew: false });
            });
          }
          setImages(bookImages);
        }
      } catch (err: any) {
        handleErrorApi({ error: err });
      } finally {
        setInitialLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleImageChange = (files: FileList | null) => {
    if (!files) return;
    const newImages = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isNew: true,
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index: number) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  const uploadImages = async (files: BookImage[]): Promise<string[]> => {
    const uploaded: string[] = [];
    for (const img of files) {
      if (img.file) {
        const formData = new FormData();
        formData.append("maSach", bookCode);
        formData.append("images", img.file);

        const res = await fetch("/api/book", {
          method: "POST",
          body: formData,
        });

        const result = await res.json();

        if (result.success) uploaded.push(result.images[0]);
        else throw new Error(result.message || "Upload ảnh thất bại");
      }
    }
    return uploaded;
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);

      const newImages = images.filter((img) => img.isNew);
      const uploadedLinks = await uploadImages(newImages);
      const existingLinks = images
        .filter((img) => !img.isNew)
        .map((img) => img.preview);
      const allImageLinks = [...existingLinks, ...uploadedLinks];
      
      await bookService.update(id, {
        ...data,
        images: allImageLinks,
      });

      toast.success("Thành công", {
        description: "Sách đã được cập nhật.",
      });
      router.push("/admin/books");
    } catch (err: any) {
      handleErrorApi({ error: err });
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
        <Link href="/admin/books" className="hover:text-primary transition-colors flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Quản lý sách
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
          <h1 className="text-3xl font-bold">Chỉnh sửa Sách</h1>
          <p className="text-muted-foreground mt-1">
            Cập nhật thông tin sách trong thư viện
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="border border-red-500/50 bg-red-500/10 rounded-lg p-4 text-red-500">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="border rounded-lg p-6 bg-card">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              {/* Tên sách */}
              <Field>
                <FieldLabel htmlFor="tenSach" className="flex items-center gap-2">
                  <Book className="w-4 h-4 text-primary" />
                  Tên Sách
                  <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  {...form.register("tenSach")}
                  placeholder="Nhập tên sách"
                  className={cn(
                    form.formState.errors.tenSach && "border-red-500"
                  )}
                  disabled={loading || fetchingData || initialLoading}
                />
                {form.formState.errors.tenSach && (
                  <FieldError>
                    {form.formState.errors.tenSach.message}
                  </FieldError>
                )}
              </Field>

              {/* Tác giả, NXB, Năm XB */}
              <div className="grid sm:grid-cols-3 gap-4">
                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Tác Gi Giả
                  </FieldLabel>
                  <Input
                    {...form.register("tacGia")}
                    placeholder="Nhập tác giả"
                    disabled={loading || fetchingData || initialLoading}
                  />
                </Field>

                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-primary" />
                    Nhà Xuất Bản
                  </FieldLabel>
                  <Input
                    {...form.register("nhaXuatBan")}
                    placeholder="Nhập NXB"
                    disabled={loading || fetchingData || initialLoading}
                  />
                </Field>

                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    Năm Xuất Bản
                  </FieldLabel>
                  <Input
                    type="number"
                    {...form.register("namXuatBan", { valueAsNumber: true })}
                    disabled={loading || fetchingData || initialLoading}
                  />
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    <FolderTree className="w-4 h-4 text-primary" />
                    Danh mục
                  </FieldLabel>
                  <Controller
                    name="danhMucIds"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        value={field.value?.toString() || ""}
                        onValueChange={(val) => field.onChange(Number(val))}
                        disabled={loading || fetchingData || initialLoading}
                      >
                        <SelectTrigger
                          className={cn(
                            form.formState.errors.danhMucIds && "border-red-500"
                          )}
                        >
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>

                        <SelectContent>
                          {danhMucList.map((dm) => (
                            <SelectItem
                              key={dm.idDanhmuc}
                              value={dm.idDanhmuc.toString()}
                            >
                              {dm.tenDanhmuc}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.danhMucIds && (
                    <FieldError>
                      {form.formState.errors.danhMucIds.message}
                    </FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    Kệ Sách
                  </FieldLabel>
                  <Controller
                    name="idKeSach"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        value={field.value?.toString() || ""}
                        onValueChange={(val) => field.onChange(Number(val))}
                        disabled={loading || fetchingData || initialLoading}
                      >
                        <SelectTrigger
                          className={cn(
                            form.formState.errors.idKeSach && "border-red-500"
                          )}
                        >
                          <SelectValue placeholder="Chọn kệ sách" />
                        </SelectTrigger>

                        <SelectContent>
                          {keSachList.map((ke) => (
                            <SelectItem
                              key={ke.idKeSach}
                              value={ke.idKeSach.toString()}
                            >
                              {ke.tenKe}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.idKeSach && (
                    <FieldError>
                      {form.formState.errors.idKeSach.message}
                    </FieldError>
                  )}
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    Số Lượng
                  </FieldLabel>
                  <Input
                    type="number"
                    min={1}
                    {...form.register("soLuong", { valueAsNumber: true })}
                    disabled={loading || fetchingData || initialLoading}
                  />
                </Field>

                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    Số Lượng Khả Dụng
                  </FieldLabel>
                  <Input
                    type="number"
                    min={0}
                    {...form.register("soLuongKhaDung", {
                      valueAsNumber: true,
                    })}
                    disabled={loading || fetchingData || initialLoading}
                  />
                </Field>

                {/* THÊM SIZE SÁCH TẠI ĐÂY */}
                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-primary" />
                    Size Sách
                  </FieldLabel>
                  <Controller
                    name="sizesach"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        value={field.value || ""}
                        onValueChange={field.onChange}
                        disabled={loading || fetchingData || initialLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lon">Lớn</SelectItem>
                          <SelectItem value="vua">Vừa</SelectItem>
                          <SelectItem value="nho">Nhỏ</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>

                <Field>
                  <FieldLabel>Trạng Thái</FieldLabel>
                  <Controller
                    name="trangThai"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        value={field.value || ""}
                        onValueChange={field.onChange}
                        disabled={loading || fetchingData || initialLoading}
                      >
                        <SelectTrigger
                          className={cn(
                            form.formState.errors.trangThai &&
                              "border-red-500"
                          )}
                        >
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="dang_su_dung">
                            Đang sử dụng
                          </SelectItem>
                          <SelectItem value="tam_khoa">Tạm khóa</SelectItem>
                          <SelectItem value="ngung_phuc_vu">
                            Ngưng phục vụ
                          </SelectItem>
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

              <Field>
                <FieldLabel className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Mô Tả
                </FieldLabel>
                <Textarea
                  {...form.register("moTa")}
                  placeholder="Nhập mô tả..."
                  rows={4}
                  className="resize-none"
                  disabled={loading || fetchingData || initialLoading}
                />
              </Field>

              <Field>
                <FieldLabel className="flex items-center gap-2">
                  <Image className="w-4 h-4 text-primary" />
                  Hình Ảnh Sách
                </FieldLabel>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageChange(e.target.files)}
                  disabled={loading || fetchingData || initialLoading}
                  className="mt-2 block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                />
                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img.preview}
                          alt={`Preview ${idx}`}
                          className="w-full h-32 object-cover rounded-lg border shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </Field>
            </FieldGroup>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/books")}
                disabled={loading || fetchingData || initialLoading}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={loading || fetchingData || initialLoading}>
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Đang lưu...
                  </>
                ) : (
                  "Cập nhật Sách"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
}