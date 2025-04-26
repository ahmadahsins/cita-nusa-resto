import { useState, useEffect } from "react";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
    Edit,
    Loader2,
    PlusCircle,
    Search,
    Trash2,
    Users,
    Table2,
    Clock,
} from "lucide-react";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import TableFormModal from "@/components/modal/table/TableFormModal";
import DeleteConfirmationModal from "@/components/modal/table/DeleteConfirmationModal";

// Define Table type
export type Table = {
    id: string;
    tableNumber: number;
    capacity: number;
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
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
    const {
        data: tables,
        isLoading,
        refetch,
    } = useQuery<Table[]>({
        queryKey: ["tables"],
        queryFn: async () => {
            const response = await axiosInstance.get("/tables");
            return response.data;
        },
        enabled: isAuthenticated,
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
                        Kembali ke Dashboard
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
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mt-6">
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
                refetch={refetch}
            />

            {/* Edit Table Modal */}
            <TableFormModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                table={selectedTable}
                isEditing={true}
                refetch={refetch}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isDeleteModalOpen={isDeleteModalOpen}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
                table={selectedTable}
                refetch={refetch}
            />
        </AdminLayout>
    );
};

export default AdminTablesPage;
