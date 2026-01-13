import { Plus, School, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ClassListHeaderProps {
    search: string;
    onSearchChange: (value: string) => void;
    onAddClick: () => void;
}

export function ClassListHeader({
    search,
    onSearchChange,
    onAddClick,
}: ClassListHeaderProps) {
    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Quản lý Lớp học</h1>
                    <p className="text-muted-foreground mt-1">
                        Quản lý danh sách lớp học
                    </p>
                </div>
                <Button onClick={onAddClick}>
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm Lớp
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm theo tên lớp..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>
        </>
    );
}

