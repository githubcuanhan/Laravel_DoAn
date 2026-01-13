"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Settings, Save, AlertCircle, Calendar, DollarSign, Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { handleErrorApi } from "@/lib/utils/mini";
import cauHinhMuonTraService from "@/services/cauHinhMuonTra";
import type { CauHinhMuonTra, UpdateCauHinhMuonTraBody } from "@/lib/types/cauHinhMuonTra.types";
import { updateCauHinhMuonTraBodySchema } from "@/lib/schemas/cauHinhMuonTra.schema";

export default function CauHinhMuonTraPage() {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [currentConfig, setCurrentConfig] = useState<CauHinhMuonTra | null>(null);

    const form = useForm<UpdateCauHinhMuonTraBody>({
        resolver: zodResolver(updateCauHinhMuonTraBodySchema),
        defaultValues: {
            soNgayToiDa: 14,
            mucPhatMoiNgay: 5000,
            apDungTuNgay: new Date().toISOString().split('T')[0],
            apDungDenNgay: null,
        },
    });

    const formatDateForInput = (dateString: string | null): string | null => {
        if (!dateString) return null;
        return dateString.split('T')[0];
    };

    const fetchCurrentConfig = async () => {
        setLoading(true);
        try {
            const res = await cauHinhMuonTraService.getCurrent();
            if (res.payload.success && res.payload.data) {
                const config = res.payload.data;
                setCurrentConfig(config);

                form.reset({
                    soNgayToiDa: config.soNgayToiDa,
                    mucPhatMoiNgay: config.mucPhatMoiNgay,
                    apDungTuNgay: formatDateForInput(config.apDungTuNgay) || new Date().toISOString().split('T')[0],
                    apDungDenNgay: formatDateForInput(config.apDungDenNgay),
                });
            }
        } catch (err: any) {
            console.log("No current config found, using defaults");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrentConfig();
    }, []);

    const onSubmit = async (data: UpdateCauHinhMuonTraBody) => {
        setSubmitting(true);
        try {
            let response;

            if (currentConfig) {
                // Update existing config
                response = await cauHinhMuonTraService.update(currentConfig.id, data);
            } else {
                // Create new config
                response = await cauHinhMuonTraService.create(data);
            }

            if (response.payload.success) {
                toast.success("Thành công", {
                    description: "Cấu hình mượn trả đã được cập nhật",
                });
                fetchCurrentConfig(); // Refresh data
            }
        } catch (error) {
            handleErrorApi({ error, setError: form.setError });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDateChange = (value: string) => {
        return value === "" ? null : value;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-t-primary border-b-primary/30 border-l-transparent border-r-transparent rounded-full animate-spin" />
                    <p className="text-muted-foreground">Đang tải cấu hình...</p>
                </div>
            </div>
        );
    }

    const isActive = currentConfig && (!currentConfig.apDungDenNgay || new Date(currentConfig.apDungDenNgay) > new Date());

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="p-4 bg-primary/10 rounded-2xl">
                    <Settings className="w-8 h-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Cấu hình Mượn Trả</h1>
                    <p className="text-muted-foreground mt-1">
                        Quản lý các thông số cho việc mượn và trả sách
                    </p>
                </div>
            </div>

            {/* Notice Alert */}
            <Alert>
                <Info className="w-4 h-4" />
                <AlertTitle>Lưu ý quan trọng</AlertTitle>
                <AlertDescription>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                        <li>Cấu hình này sẽ được áp dụng cho tất cả các giao dịch mượn sách mới.</li>
                        <li>Nếu để trống "Ngày kết thúc", cấu hình sẽ có hiệu lực vô thời hạn.</li>
                        <li>Khi tạo cấu hình mới, cấu hình cũ sẽ tự động kết thúc.</li>
                    </ul>
                </AlertDescription>
            </Alert>

            {/* Configuration Form */}
            <div className="border rounded-lg p-6 bg-card">
                {/* Form Header */}
                <div className="flex items-center gap-2 pb-4 border-b mb-6">
                    <Settings className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold">Thông số cấu hình</h2>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FieldGroup>
                        {/* Số ngày tối đa */}
                        <Field>
                            <FieldLabel htmlFor="soNgayToiDa" className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                Số ngày mượn tối đa
                                <span className="text-red-500">*</span>
                            </FieldLabel>
                            <Input
                                id="soNgayToiDa"
                                type="number"
                                {...form.register("soNgayToiDa", { valueAsNumber: true })}
                                placeholder="VD: 14"
                                className={cn(
                                    form.formState.errors.soNgayToiDa && "border-red-500"
                                )}
                                disabled={submitting}
                            />
                            {form.formState.errors.soNgayToiDa && (
                                <FieldError>
                                    {form.formState.errors.soNgayToiDa.message}
                                </FieldError>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                                Số ngày tối đa một người được phép mượn sách (1-365 ngày)
                            </p>
                        </Field>

                        {/* Mức phạt mỗi ngày */}
                        <Field>
                            <FieldLabel htmlFor="mucPhatMoiNgay" className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-primary" />
                                Mức phạt mỗi ngày (VNĐ)
                                <span className="text-red-500">*</span>
                            </FieldLabel>
                            <Input
                                id="mucPhatMoiNgay"
                                type="number"
                                step="0.01"
                                {...form.register("mucPhatMoiNgay", { valueAsNumber: true })}
                                placeholder="VD: 5000"
                                className={cn(
                                    form.formState.errors.mucPhatMoiNgay && "border-red-500"
                                )}
                                disabled={submitting}
                            />
                            {form.formState.errors.mucPhatMoiNgay && (
                                <FieldError>
                                    {form.formState.errors.mucPhatMoiNgay.message}
                                </FieldError>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                                Số tiền phạt cho mỗi ngày trả sách trễ
                            </p>
                        </Field>

                        {/* Ngày áp dụng */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="apDungTuNgay" className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    Ngày áp dụng
                                    <span className="text-red-500">*</span>
                                </FieldLabel>
                                <Input
                                    id="apDungTuNgay"
                                    type="date"
                                    {...form.register("apDungTuNgay")}
                                    className={cn(
                                        form.formState.errors.apDungTuNgay && "border-red-500"
                                    )}
                                    disabled={submitting}
                                />
                                {form.formState.errors.apDungTuNgay && (
                                    <FieldError>
                                        {form.formState.errors.apDungTuNgay.message}
                                    </FieldError>
                                )}
                                <p className="text-xs text-muted-foreground mt-1">
                                    Ngày bắt đầu áp dụng cấu hình này
                                </p>
                            </Field>

                            {/* Ngày kết thúc */}
                            <Field>
                                <FieldLabel htmlFor="apDungDenNgay" className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    Ngày kết thúc
                                    <span className="text-muted-foreground text-xs">(Tùy chọn)</span>
                                </FieldLabel>
                                <Input
                                    id="apDungDenNgay"
                                    type="date"
                                    {...form.register("apDungDenNgay", {
                                        setValueAs: handleDateChange,
                                    })}
                                    className={cn(
                                        form.formState.errors.apDungDenNgay && "border-red-500"
                                    )}
                                    disabled={submitting}
                                />
                                {form.formState.errors.apDungDenNgay && (
                                    <FieldError>
                                        {form.formState.errors.apDungDenNgay.message}
                                    </FieldError>
                                )}
                                <p className="text-xs text-muted-foreground mt-1">
                                    Để trống nếu muốn cấu hình có hiệu lực vô thời hạn
                                </p>
                            </Field>
                        </div>
                    </FieldGroup>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 pt-6 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => form.reset()}
                            disabled={submitting}
                        >
                            Đặt lại
                        </Button>
                        <Button
                            type="submit"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Lưu cấu hình
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

