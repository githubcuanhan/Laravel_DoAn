import { ClassCard } from "./ClassCard";
import type { Lop } from "@/lib/types/lop.types";
import { School } from "lucide-react";

interface ClassListGridProps {
    classes: Lop[];
    loading: boolean;
    onEdit: (lop: Lop) => void;
    onDelete: (id: number, tenLop: string) => void;
}

export function ClassListGrid({
    classes,
    loading,
    onEdit,
    onDelete,
}: ClassListGridProps) {
    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-t-primary border-b-primary/30 border-l-transparent border-r-transparent rounded-full animate-spin" />
                    <p className="text-muted-foreground">Đang tải...</p>
                </div>
            </div>
        );
    }

    if (classes.length === 0) {
        return (
            <div className="border rounded-lg p-10 text-center">
                <div className="inline-block p-6 bg-muted rounded-full mb-4">
                    <School className="w-16 h-16 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Không có lớp học nào</h2>
                <p className="text-muted-foreground">
                    Hãy thêm lớp học mới để bắt đầu
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {classes.map((lop) => (
                <ClassCard
                    key={lop.idLop}
                    lop={lop}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}

