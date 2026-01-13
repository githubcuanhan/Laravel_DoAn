import { Edit, Trash2, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Lop } from "@/lib/types/lop.types";

interface ClassCardProps {
    lop: Lop;
    onEdit: (lop: Lop) => void;
    onDelete: (id: number, tenLop: string) => void;
}

export function ClassCard({ lop, onEdit, onDelete }: ClassCardProps) {
    return (
        <Card className="group hover:shadow-xl transition-all duration-300 border hover:border-primary/50">
            <CardContent className="p-6">
                {/* Header với Icon */}
                <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <School className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                        #{lop.idLop}
                    </span>
                </div>

                {/* Tên Lớp */}
                <h3 className="text-lg font-bold text-foreground mb-4 group-hover:text-primary transition-colors line-clamp-2">
                    {lop.tenLop}
                </h3>

                {/* Thông tin bổ sung */}
                <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                        <span>Ngày tạo:</span>
                        <span className="font-medium text-foreground">
                            {lop.created_at
                                ? new Date(lop.created_at).toLocaleDateString("vi-VN")
                                : "-"}
                        </span>
                    </div>
                    {lop.updated_at && lop.updated_at !== lop.created_at && (
                        <div className="flex items-center justify-between">
                            <span>Cập nhật:</span>
                            <span className="font-medium text-foreground">
                                {new Date(lop.updated_at).toLocaleDateString("vi-VN")}
                            </span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                    <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => onEdit(lop)}
                    >
                        <Edit className="w-4 h-4 mr-2" />
                        Sửa
                    </Button>
                    <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1"
                        onClick={() => onDelete(lop.idLop, lop.tenLop)}
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Xóa
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

