import { useState, useEffect } from "react";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
    // Calendar,
    // Check,
    Edit,
    Loader2,
    PlusCircle,
    Search,
    Trash2,
    Users,
    X,
    Table2,
    Clock,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import { queryClient } from "@/lib/queryCLient";

// Define Table type
type Table = {
    id: string;
    tableNumber: number;
    capacity: number;
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
};

// Form schema for table creation and editing
const tableSchema = z.object({
    tableNumber: z.coerce.number().positive("Nomor meja harus positif"),
    capacity: z.coerce.number().positive("Kapasitas harus positif"),
    isAvailable: z.boolean().default(true),
});

type TableFormValues = z.infer<typeof tableSchema>;

// Modal component for adding/editing tables
const TableFormModal = ({
    isOpen,
    onClose,
    table,
    isEditing,
}: {
    isOpen: boolean;
    onClose: () => void;
    table?: Table;
    isEditing: boolean;
}) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<TableFormValues>({
        resolver: zodResolver(tableSchema),
        defaultValues:
            isEditing && table
                ? {
                      tableNumber: table.tableNumber,
                      capacity: table.capacity,
                      isAvailable: table.isAvailable,
                  }
                : {
                      tableNumber: undefined,
                      capacity: undefined,
                      isAvailable: true,
                  },
    });

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            reset(
                isEditing && table
                    ? {
                          tableNumber: table.tableNumber,
                          capacity: table.capacity,
                          isAvailable: table.isAvailable,
                      }
                    : {
                          tableNumber: undefined,
                          capacity: undefined,
                          isAvailable: true,
                      }
            );
        }
    }, [isOpen, reset, table, isEditing]);

    // Create table mutation
    const createTableMutation = useMutation({
        mutationFn: async (data: TableFormValues) => {
            const response = await axiosInstance.post("/tables", data);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Meja berhasil ditambahkan");
            queryClient.invalidateQueries({ queryKey: ["tables"] });
            onClose();
        },
        onError: () => {
            toast.error("Gagal menambahkan meja");
        },
    });

    // Update table mutation
    const updateTableMutation = useMutation({
        mutationFn: async (data: TableFormValues) => {
            const response = await axiosInstance.patch(
                `/tables/${table?.id}`,
                data
            );
            return response.data;
        },
        onSuccess: () => {
            toast.success("Meja berhasil diperbarui");
            queryClient.invalidateQueries({ queryKey: ["tables"] });
            onClose();
        },
        onError: () => {
            toast.error("Gagal memperbarui meja");
        },
    });

    const onSubmit: (data) => void = (data: TableFormValues) => {
        if (isEditing && table) {
            updateTableMutation.mutate(data);
        } else {
            createTableMutation.mutate(data);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-amber-900">
                            {isEditing ? "Edit Meja" : "Tambah Meja Baru"}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nomor Meja
                            </label>
                            <input
                                type="number"
                                {...register("tableNumber")}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="Masukkan nomor meja"
                            />
                            {errors.tableNumber && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.tableNumber.message}
                                </p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kapasitas
                            </label>
                            <input
                                type="number"
                                {...register("capacity")}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="Masukkan kapasitas meja"
                            />
                            {errors.capacity && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.capacity.message}
                                </p>
                            )}
                        </div>

                        <div className="mb-6 flex items-center">
                            <input
                                type="checkbox"
                                id="isAvailable"
                                {...register("isAvailable")}
                                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                            />
                            <label
                                htmlFor="isAvailable"
                                className="ml-2 block text-sm text-gray-700"
                            >
                                Meja tersedia
                            </label>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 flex items-center"
                            >
                                {isSubmitting && (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                )}
                                {isEditing ? "Perbarui" : "Tambah"} Meja
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Delete confirmation modal
const DeleteConfirmationModal = ({
    isOpen,
    onClose,
    table,
    onConfirm,
}: {
    isOpen: boolean;
    onClose: () => void;
    table?: Table;
    onConfirm: () => void;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
                <h2 className="text-xl font-bold text-red-600 mb-4">
                    Konfirmasi Hapus
                </h2>
                <p className="text-gray-700 mb-6">
                    Apakah Anda yakin ingin menghapus Meja #{table?.tableNumber}
                    ? Tindakan ini tidak bisa dibatalkan.
                </p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Hapus
                    </button>
                </div>
            </div>
        </div>
    );
};

const AdminTablesPage: NextPage = () => {
    const { isAuthenticated } = useAuth(
        "/auth/login?callbackUrl=" + encodeURIComponent("/admin/tables")
    );

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState<Table | undefined>(
        undefined
    );
    const itemsPerPage = 10;

    // Fetch tables data
    const { data: tables, isLoading } = useQuery<Table[]>({
        queryKey: ["tables"],
        queryFn: async () => {
            const response = await axiosInstance.get("/tables");
            return response.data;
        },
        enabled: isAuthenticated,
    });

    // Delete table mutation
    const deleteTableMutation = useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.delete(
                `/tables/${selectedTable?.id}`
            );
            return response.data;
        },
        onSuccess: () => {
            toast.success("Meja berhasil dihapus");
            queryClient.invalidateQueries({ queryKey: ["tables"] });
            setIsDeleteModalOpen(false);
        },
        onError: () => {
            toast.error("Gagal menghapus meja");
        },
    });

    // Filter tables based on search term
    const filteredTables = tables?.filter((table) => {
        if (!searchTerm) return true;

        const searchLower = searchTerm.toLowerCase();
        return (
            table.tableNumber.toString().includes(searchLower) ||
            table.capacity.toString().includes(searchLower)
        );
    });

    // Handle confirm delete
    const handleConfirmDelete = () => {
        if (selectedTable) {
            deleteTableMutation.mutate();
        }
    };

    // Handle edit table
    const handleEditTable = (table: Table) => {
        setSelectedTable(table);
        setIsEditModalOpen(true);
    };

    // Handle delete table
    const handleDeleteTable = (table: Table) => {
        setSelectedTable(table);
        setIsDeleteModalOpen(true);
    };

    // Pagination
    const totalPages = Math.ceil((filteredTables?.length || 0) / itemsPerPage);
    const paginatedTables = filteredTables?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset pagination when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    return (
        <AdminLayout>
            <Head>
                <title>Kelola Meja - Cita Nusa Resto</title>
                <meta
                    name="description"
                    content="Dasbor admin untuk mengelola meja di Cita Nusa Resto"
                />
            </Head>

            <div className="p-6 bg-white rounded-lg">
                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                    <h1 className="text-2xl font-extrabold text-amber-900 mb-4 md:mb-0">
                        Kelola Meja
                    </h1>
                    <Link
                        href="/admin/dashboard"
                        className="px-4 py-2 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 inline-flex items-center"
                    >
                        <Clock className="h-4 w-4 mr-2" />
                        Kembali ke Dasbor
                    </Link>
                </div>

                {/* Action Bar */}
                <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                    {/* Search Bar */}
                    <div className="w-full md:w-1/3">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Cari meja berdasarkan nomor atau kapasitas..."
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 pl-10"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        </div>
                    </div>

                    {/* Add Table Button */}
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                    >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Tambah Meja Baru
                    </button>
                </div>

                {/* Table List */}
                {isLoading ? (
                    <div className="text-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-amber-600" />
                        <p className="mt-2 text-amber-800">
                            Memuat data meja...
                        </p>
                    </div>
                ) : paginatedTables && paginatedTables.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border-collapse">
                            <thead>
                                <tr className="bg-amber-50">
                                    <th className="py-3 px-4 text-left text-xs font-medium text-amber-800 uppercase tracking-wider border-b">
                                        Nomor Meja
                                    </th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-amber-800 uppercase tracking-wider border-b">
                                        Kapasitas
                                    </th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-amber-800 uppercase tracking-wider border-b">
                                        Status
                                    </th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-amber-800 uppercase tracking-wider border-b">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {paginatedTables.map((table) => (
                                    <tr
                                        key={table.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-medium">
                                                    {table.tableNumber}
                                                </div>
                                                <span className="ml-3 font-medium text-gray-900">
                                                    Meja #{table.tableNumber}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Users className="h-4 w-4 text-gray-500 mr-1" />
                                                <span className="text-gray-900">
                                                    {table.capacity} orang
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 rounded-md text-sm ${
                                                    table.isAvailable
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {table.isAvailable
                                                    ? "Tersedia"
                                                    : "Tidak Tersedia"}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap space-x-2">
                                            <button
                                                onClick={() =>
                                                    handleEditTable(table)
                                                }
                                                className="inline-flex items-center px-2.5 py-1.5 bg-amber-50 text-amber-800 rounded hover:bg-amber-100"
                                            >
                                                <Edit className="h-4 w-4 mr-1" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDeleteTable(table)
                                                }
                                                className="inline-flex items-center px-2.5 py-1.5 bg-red-50 text-red-800 rounded hover:bg-red-100"
                                            >
                                                <Trash2 className="h-4 w-4 mr-1" />
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-10 bg-amber-50 rounded-lg">
                        <Table2 className="h-10 w-10 text-amber-600 mx-auto mb-2" />
                        <p className="text-amber-800">
                            {searchTerm
                                ? "Tidak ada meja yang cocok dengan pencarian Anda"
                                : "Belum ada meja yang tersedia"}
                        </p>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="mt-4 inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                        >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Tambah Meja Baru
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-6">
                        <div className="text-sm text-gray-700">
                            Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{" "}
                            {Math.min(
                                currentPage * itemsPerPage,
                                filteredTables?.length || 0
                            )}{" "}
                            dari {filteredTables?.length || 0} meja
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 rounded ${
                                    currentPage === 1
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                                }`}
                            >
                                Sebelumnya
                            </button>
                            <div className="flex items-center space-x-1">
                                {Array.from({ length: totalPages }).map(
                                    (_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() =>
                                                setCurrentPage(idx + 1)
                                            }
                                            className={`px-3 py-1 rounded ${
                                                currentPage === idx + 1
                                                    ? "bg-amber-500 text-white"
                                                    : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                                            }`}
                                        >
                                            {idx + 1}
                                        </button>
                                    )
                                )}
                            </div>
                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1 rounded ${
                                    currentPage === totalPages
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                                }`}
                            >
                                Selanjutnya
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Table Modal */}
            <TableFormModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                isEditing={false}
            />

            {/* Edit Table Modal */}
            <TableFormModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                table={selectedTable}
                isEditing={true}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                table={selectedTable}
                onConfirm={handleConfirmDelete}
            />
        </AdminLayout>
    );
};

export default AdminTablesPage;
