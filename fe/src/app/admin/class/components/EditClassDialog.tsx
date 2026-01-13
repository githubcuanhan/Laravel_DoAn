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
import type { UpdateLopBody, Lop } from "@/lib/types/lop.types";
import { updateLopBodySchema } from "@/lib/schemas/lop.schema";
import { useEffect } from "react";
import { handleErrorApi } from "@/lib/utils/mini";

interface EditClassDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: UpdateLopBody) => Promise<void>;
    isSubmitting: boolean;
    editingClass: Lop | null;
}

export function EditClassDialog({
    open,
    onOpenChange,
    onSubmit,
    isSubmitting,
    editingClass,
}: EditClassDialogProps) {
    const form = useForm<UpdateLopBody>({
        resolver: zodResolver(updateLopBodySchema),
        defaultValues: {
            tenLop: "",
        },
    });

    // Reset form with editing class data when dialog opens
    useEffect(() => {
        if (open && editingClass) {
            form.reset({
                tenLop: editingClass.tenLop,
            });
        } else if (!open) {
            form.reset();
        }
    }, [open, editingClass, form]);

    const handleSubmit = async (data: UpdateLopBody) => {
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
                        Chỉnh sửa Lớp học
                    </DialogTitle>
                    <DialogDescription>
                        Cập nhật thông tin lớp học. Tên lớp phải là duy nhất.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="edit-tenLop">
                                Tên Lớp <span className="text-red-500">*</span>
                            </FieldLabel>
                            <Input
                                id="edit-tenLop"
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
                            {isSubmitting ? "Đang lưu..." : "Cập nhật"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

