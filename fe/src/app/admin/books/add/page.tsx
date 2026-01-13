"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";
import { createSachBodySchema } from "@/lib/schemas/book.schema";
import type { CreateSachBody } from "@/lib/types/book.types";
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
import { BookPlus, ArrowLeft, Book, User, Building, Calendar, Package, FileText, FolderTree, BookOpen, Image, QrCode } from "lucide-react";
import { DanhMuc, KeSach } from "@/lib/types";
import bookshelfService from "@/services/bookshelf";
import bookService from "@/services/book";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import categoryService from "@/services/category";
import Link from "next/link";
import { handleErrorApi } from "@/lib/utils/mini";

interface BookImage {
  file: File;
  preview: string;
}

const generateBookCode = () => `BOOK-${uuidv4().slice(0, 8).toUpperCase()}`;
const generateQrUrl = (bookCode: string) =>
  `http://localhost:3000/sach/${bookCode}`;

export default function AddBook() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<BookImage[]>([]);
  const [keSachList, setKeSachList] = useState<KeSach[]>([]);
  const [danhMucList, setDanhMucList] = useState<DanhMuc[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fetchingData, setFetchingData] = useState(false);

  const initialBookCode = useMemo(() => generateBookCode(), []);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  const form = useForm<CreateSachBody>({
    resolver: zodResolver(createSachBodySchema),
    defaultValues: {
      maSach: initialBookCode,
      maQR: "",
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
    },
  });

  useEffect(() => {
    const qrUrl = generateQrUrl(initialBookCode);
    QRCode.toDataURL(qrUrl)
      .then((url) => {
        setQrCodeUrl(url);
        form.setValue("maQR", url);
      })
      .catch(console.error);
  }, [initialBookCode, form]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setFetchingData(true);
        const [kRes, dRes] = await Promise.all([
          bookshelfService.getAll(1, 100),
          categoryService.getAll(1, 100),
        ]);
        if (kRes.payload.success) setKeSachList(kRes.payload.data.data);
        if (dRes.payload.success) setDanhMucList(dRes.payload.data.data);
      } catch (err: any) {
        handleErrorApi({ error: err, setError });
      } finally {
        setFetchingData(false);
      }
    };
    loadData();
  }, []);

  const handleImageChange = (files: FileList | null) => {
    if (!files) return;
    const newImages = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(images[index].preview);
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CreateSachBody) => {
    try {
      setLoading(true);

      // 1. Chuẩn bị FormData để upload file lên Server (Next.js API Route)
      const uploadForm = new FormData();
      uploadForm.append("maSach", data.maSach);
      images.forEach((img) => uploadForm.append("images", img.file));

      if (data.maQR) {
        const qrBlob = await (await fetch(data.maQR)).blob();
        uploadForm.append(
          "maQR",
          new File([qrBlob], `${data.maSach}.png`, { type: "image/png" })
        );
      }

      const uploadRes = await fetch("/api/book", {
        method: "POST",
        body: uploadForm,
      });
      const uploadResult = await uploadRes.json();

      if (!uploadRes.ok || !uploadResult.success) {
        throw new Error(uploadResult.message || "Upload ảnh/QR thất bại");
      }

      // 2. SỬA ĐÚNG CHỖ NÀY: Tự gán đường dẫn cố định thay vì chờ qrUrl từ API trả về
      const bookPayload = {
        ...data,
        images: uploadResult.images,
        // Gán đúng link theo logic folder bạn muốn đổ vào database
        maQR: `/qr-codes/${data.maSach}.png`, 
      };

      const response = await bookService.create(bookPayload);

      if (response.payload.success) {
        toast.success("Thành công", { description: "Sách và Mã QR đã được lưu." });
        router.push("/admin/books");
      }
    } catch (err: any) {
      handleErrorApi({ error: err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/admin/books" className="hover:text-primary transition-colors flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Quản lý sách
        </Link>
        <span>/</span>
        <span className="text-foreground">Thêm mới</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="p-4 bg-primary/10 rounded-2xl">
          <BookPlus className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Thêm Sách</h1>
          <p className="text-muted-foreground mt-1">Thêm sách mới cùng mã QR tự động</p>
        </div>
      </div>

      <div className="border rounded-lg p-6 bg-card shadow-sm">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-primary" /> Mã Sách
                </FieldLabel>
                <Input {...form.register("maSach")} readOnly className="bg-muted font-bold text-lg" />
              </Field>
              <Field>
                <FieldLabel className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-primary" /> QR Preview
                </FieldLabel>
                <div className="w-32 h-32 border rounded-lg flex items-center justify-center bg-white shadow-inner">
                  {qrCodeUrl ? (
                    <img src={qrCodeUrl} alt="QR Code" className="w-28 h-28" />
                  ) : (
                    <span className="text-xs text-muted-foreground">Đang tạo...</span>
                  )}
                </div>
              </Field>
            </div>

            <Field>
              <FieldLabel className="flex items-center gap-2 font-semibold">
                <Book className="w-4 h-4 text-primary" /> Tên Sách <span className="text-red-500">*</span>
              </FieldLabel>
              <Input {...form.register("tenSach")} placeholder="Nhập tên sách" className={cn(form.formState.errors.tenSach && "border-red-500")} />
              {form.formState.errors.tenSach && <FieldError>{form.formState.errors.tenSach.message}</FieldError>}
            </Field>

            <div className="grid sm:grid-cols-3 gap-4">
              <Field>
                <FieldLabel className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> Tác Giả
                </FieldLabel>
                <Input {...form.register("tacGia")} placeholder="Tên tác giả" />
              </Field>
              <Field>
                <FieldLabel className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-primary" /> Nhà Xuất Bản
                </FieldLabel>
                <Input {...form.register("nhaXuatBan")} placeholder="Tên NXB" />
              </Field>
              <Field>
                <FieldLabel className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" /> Năm Xuất Bản
                </FieldLabel>
                <Input type="number" {...form.register("namXuatBan", { valueAsNumber: true })} />
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel className="flex items-center gap-2">
                  <FolderTree className="w-4 h-4 text-primary" /> Danh mục <span className="text-red-500">*</span>
                </FieldLabel>
                <Controller
                  name="danhMucIds"
                  control={form.control}
                  render={({ field }) => (
                    <Select value={field.value?.toString() || ""} onValueChange={(val) => field.onChange(Number(val))}>
                      <SelectTrigger className={cn(form.formState.errors.danhMucIds && "border-red-500")}>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        {danhMucList.map((dm) => (
                          <SelectItem key={dm.idDanhmuc} value={dm.idDanhmuc.toString()}>{dm.tenDanhmuc}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.danhMucIds && <FieldError>{form.formState.errors.danhMucIds.message}</FieldError>}
              </Field>
              <Field>
                <FieldLabel className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" /> Kệ Sách <span className="text-red-500">*</span>
                </FieldLabel>
                <Controller
                  name="idKeSach"
                  control={form.control}
                  render={({ field }) => (
                    <Select value={field.value?.toString() || ""} onValueChange={(val) => field.onChange(Number(val))}>
                      <SelectTrigger className={cn(form.formState.errors.idKeSach && "border-red-500")}>
                        <SelectValue placeholder="Chọn kệ sách" />
                      </SelectTrigger>
                      <SelectContent>
                        {keSachList.map((ke) => (
                          <SelectItem key={ke.idKeSach} value={ke.idKeSach.toString()}>{ke.tenKe}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.idKeSach && <FieldError>{form.formState.errors.idKeSach.message}</FieldError>}
              </Field>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <Field>
                <FieldLabel className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" /> Số Lượng
                </FieldLabel>
                <Input type="number" {...form.register("soLuong", { valueAsNumber: true })} />
              </Field>
              <Field>
                <FieldLabel className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" /> Số Lượng Khả Dụng
                </FieldLabel>
                <Input type="number" {...form.register("soLuongKhaDung", { valueAsNumber: true })} />
              </Field>
              <Field>
                <FieldLabel>Trạng Thái</FieldLabel>
                <Controller
                  name="trangThai"
                  control={form.control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dang_su_dung">Đang sử dụng</SelectItem>
                        <SelectItem value="tam_khoa">Tạm khóa</SelectItem>
                        <SelectItem value="ngung_phuc_vu">Ngưng phục vụ</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
            </div>

            <Field>
              <FieldLabel className="flex items-center gap-2 font-semibold">
                <FileText className="w-4 h-4 text-primary" /> Mô Tả
              </FieldLabel>
              <Textarea {...form.register("moTa")} placeholder="Nhập mô tả về sách..." rows={4} className="resize-none" />
            </Field>

            <Field>
              <FieldLabel className="flex items-center gap-2 font-semibold">
                <Image className="w-4 h-4 text-primary" /> Hình Ảnh Sách
              </FieldLabel>
              <input type="file" accept="image/*" multiple onChange={(e) => handleImageChange(e.target.files)} className="mt-2 block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer" />
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden border">
                      <img src={img.preview} alt="Preview" className="w-full h-32 object-cover" />
                      <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                    </div>
                  ))}
                </div>
              )}
            </Field>
          </FieldGroup>

          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/books")}>Hủy</Button>
            <Button type="submit" disabled={loading}>{loading ? "Đang lưu..." : "Lưu Sách"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}