import axiosInstance from "@/lib/axios";
import { Table } from "@/pages/admin/tables";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";

const DeleteConfirmationModal = ({
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    table,
    refetch,
}: {
    isDeleteModalOpen: boolean;
    setIsDeleteModalOpen: Dispatch<SetStateAction<boolean>>;
    table?: Table;
    refetch: () => void;
}) => {
    // Delete table mutation
    const deleteTableMutation = useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.delete(`/tables/${table?.id}`);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Meja berhasil dihapus");
            refetch();
            setIsDeleteModalOpen(false);
        },
        onError: () => {
            toast.error("Gagal menghapus meja");
        },
    });

    // Handle confirm delete
    const handleConfirmDelete = () => {
        if (table) {
            deleteTableMutation.mutate();
        }
    };

    if (!isDeleteModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                        onClick={() => setIsDeleteModalOpen(false)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleConfirmDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        {deleteTableMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            "Hapus"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
