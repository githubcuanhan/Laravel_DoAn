import { Button } from "@/components/ui/button";
import type { PaginatedData } from "@/lib/types/api.types";
import type { Lop } from "@/lib/types/lop.types";

interface ClassPaginationProps {
    classData: PaginatedData<Lop>;
    onPageChange: (page: number) => void;
}

export function ClassPagination({ classData, onPageChange }: ClassPaginationProps) {
    if (classData.last_page <= 1) {
        return null;
    }

    return (
        <div className="flex items-center justify-center gap-2">
            <Button
                variant="outline"
                size="sm"
                disabled={!classData.prev_page_url}
                onClick={() => onPageChange(Math.max(classData.current_page - 1, 1))}
            >
                Trước
            </Button>

            <span className="px-4 py-2">
                Trang {classData.current_page} / {classData.last_page}
            </span>

            <Button
                variant="outline"
                size="sm"
                disabled={!classData.next_page_url}
                onClick={() => onPageChange(classData.current_page + 1)}
            >
                Sau
            </Button>
        </div>
    );
}

