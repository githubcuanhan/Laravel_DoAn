"use client";

import { useState, useEffect, useMemo } from "react";
import lopService from "@/services/lop";
import type { PaginatedData } from "@/lib/types/api.types";
import { toast } from "sonner";
import type { Lop, CreateLopBody, UpdateLopBody } from "@/lib/types/lop.types";
import {
    ClassListHeader,
    ClassListGrid,
    ClassPagination,
    AddClassDialog,
    EditClassDialog,
} from "./components";
import { handleErrorApi } from "@/lib/utils/mini";
import { School, Users } from "lucide-react";

export default function ClassPage() {
    // Data states
    const [classData, setClassData] = useState<PaginatedData<Lop> | null>(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    // Dialog states
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingClass, setEditingClass] = useState<Lop | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const perPage = 10;

    // Fetch classes
    const fetchClasses = async (page: number) => {
        setLoading(true);
        try {
            const res = await lopService.getAll(page, perPage);
            if (res.payload.success) {
                if ('data' in res.payload.data && Array.isArray(res.payload.data.data)) {
                    setClassData(res.payload.data as PaginatedData<Lop>);
                }
            }
        } catch (err: any) {
            handleErrorApi({ error: err });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses(page);
    }, [page]);

    // Filter classes by search
    const filteredList = useMemo(() => {
        if (!classData) return [];
        return classData.data.filter((lop) =>
            lop.tenLop.toLowerCase().includes(search.toLowerCase())
        );
    }, [classData, search]);

    // Handle search change
    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    // Handle Add
    const handleAdd = async (data: CreateLopBody) => {
        setSubmitting(true);
        try {
            const response = await lopService.create(data);

            if (response.payload.success) {
                toast.success("Thành công", {
                    description: "Lớp học đã được thêm",
                });
                setIsAddDialogOpen(false);
                fetchClasses(page);
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Handle Edit
    const handleEditClick = (lop: Lop) => {
        setEditingClass(lop);
        setIsEditDialogOpen(true);
    };

    const handleEdit = async (data: UpdateLopBody) => {
        if (!editingClass) return;

        setSubmitting(true);
        try {
            const response = await lopService.update(editingClass.idLop, data);

            if (response.payload.success) {
                toast.success("Thành công", {
                    description: "Lớp học đã được cập nhật",
                });
                setIsEditDialogOpen(false);
                setEditingClass(null);
                fetchClasses(page);
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Handle Delete
    const handleDelete = async (id: number, tenLop: string) => {
        if (!confirm(`Bạn có chắc muốn xóa lớp "${tenLop}"?`)) return;

        try {
            const res = await lopService.delete(id);
            if (res.payload.success) {
                toast.success("Thành công", {description: "Đã xóa lớp." });
                fetchClasses(page);
            }
        } catch (err: any) {
            toast.error({ title: "Lỗi", description: err?.message });
        }
    };

    const allClasses = classData?.data || [];
    const totalClasses = allClasses.length;

    return (
        <div className="p-6 space-y-6">
            {/* Header với Search và Add button */}
            <ClassListHeader
                search={search}
                onSearchChange={handleSearchChange}
                onAddClick={() => setIsAddDialogOpen(true)}
            />
            
            {/* Grid danh sách lớp học */}
            <ClassListGrid
                classes={filteredList}
                loading={loading}
                onEdit={handleEditClick}
                onDelete={handleDelete}
            />

            {/* Pagination */}
            {classData && (
                <ClassPagination
                    classData={classData}
                    onPageChange={setPage}
                />
            )}

            {/* Add Dialog */}
            <AddClassDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onSubmit={handleAdd}
                isSubmitting={submitting}
            />

            {/* Edit Dialog */}
            <EditClassDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                onSubmit={handleEdit}
                isSubmitting={submitting}
                editingClass={editingClass}
            />
        </div>
    );
}
