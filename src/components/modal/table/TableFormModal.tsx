import axiosInstance from "@/lib/axios";
import { Table } from "@/pages/admin/tables";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

// Form schema for table creation and editing
const tableSchema = z.object({
    tableNumber: z.coerce.number().positive("Nomor meja harus positif"),
    capacity: z.coerce.number().positive("Kapasitas harus positif"),
    isAvailable: z.boolean().default(true),
});

type TableFormValues = z.infer<typeof tableSchema>;

const TableFormModal = ({
    isOpen,
    onClose,
    table,
    isEditing,
    refetch,
}: {
    isOpen: boolean;
    onClose: () => void;
    table?: Table;
    isEditing: boolean;
    refetch: () => void;
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
            refetch();
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
            refetch();
            onClose();
        },
        onError: () => {
            toast.error("Gagal memperbarui meja");
        },
    });

    const onSubmit = (data: TableFormValues) => {
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
                                {createTableMutation.isPending ||
                                updateTableMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : isEditing ? (
                                    "Perbarui"
                                ) : (
                                    "Edit"
                                )}{" "}
                                Meja
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TableFormModal;
