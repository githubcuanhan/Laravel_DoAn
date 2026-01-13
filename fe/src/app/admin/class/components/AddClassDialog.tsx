import { School } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import type { CreateLopBody } from "@/lib/types/lop.types";
import { createLopBodySchema } from "@/lib/schemas/lop.schema";
import { useEffect } from "react";
import { handleErrorApi } from "@/lib/utils/mini";
interface AddClassDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: CreateLopBody) => Promise<void>;
    isSubmitting: boolean;
}

export function AddClassDialog({
    open,
    onOpenChange,
    onSubmit,
    isSubmitting,
}: AddClassDialogProps) {
    const form = useForm<CreateLopBody>({
        resolver: zodResolver(createLopBodySchema),
        defaultValues: {
            tenLop: "",
        },
    });

    // Reset form when dialog opens/closes
    useEffect(() => {
        if (!open) {
            form.reset();
        }
    }, [open, form]);

    const handleSubmit = async (data: CreateLopBody) => {
        try {
            await onSubmit(data);
            form.reset();
        } catch (error) {
            // Handle validation errors from server
            handleErrorApi({ error, setError: form.setError });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                        <School className="w-6 h-6 text-primary" />
                        Thêm Lớp học Mới
                    </DialogTitle>
                    <DialogDescription>
                        Nhập thông tin lớp học. Tên lớp phải là duy nhất.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="add-tenLop">
                                Tên Lớp <span className="text-red-500">*</span>
                            </FieldLabel>
                            <Input
                                id="add-tenLop"
                                {...form.register("tenLop")}
                                placeholder="VD: Lớp 10A1"
                                className={cn(
                                    "h-11",
                                    form.formState.errors.tenLop && "border-red-500"
                                )}
                                disabled={isSubmitting}
                            />
                            {form.formState.errors.tenLop && (
                                <FieldError>
                                    {form.formState.errors.tenLop.message}
                                </FieldError>
                            )}
                        </Field>
                    </FieldGroup>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Đang lưu..." : "Thêm Lớp"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

