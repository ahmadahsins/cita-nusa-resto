import { useState, useEffect } from "react";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
    Edit,
    Loader2,
    PlusCircle,
    Search,
    Clock,
    ShoppingCart,
    Table2,
    User,
    Tag,
    Calendar,
    XCircle,
    CheckCircle,
    TrendingUp,
} from "lucide-react";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import toast from "react-hot-toast";
import { OrderStatus } from "@prisma/client";
import { Order, OrderItem } from "@/types";

const statusLabels: Record<OrderStatus, { label: string }> = {
    PENDING: { label: "Menunggu" },
    PREPARING: { label: "Diproses" },
    COMPLETED: { label: "Selesai" },
    CANCELLED: { label: "Dibatalkan" },
};

const AdminOrdersPage: NextPage = () => {
    const { isAuthenticated } = useAuth(
        "/auth/login?callbackUrl=" + encodeURIComponent("/admin/orders")
    );

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">(
        "ALL"
    );
    const itemsPerPage = 10;

    // Fetch orders data
    const {
        data: orders,
        isLoading,
        refetch,
    } = useQuery<Order[]>({
        queryKey: ["orders"],
        queryFn: async () => {
            const response = await axiosInstance.get("/orders");
            return response.data.data;
        },
        enabled: isAuthenticated,
    });

    const updateOrderStatus = useMutation({
        mutationFn: async (data: { orderId: string; status: OrderStatus }) => {
            const response = await axiosInstance.patch(
                `/orders/${data.orderId}`,
                {
                    status: data.status,
                }
            );
            return response.data.data;
        },
        onSuccess: (data: { status: OrderStatus }) => {
            toast.success(
                `Status reservasi berhasil diubah ke ${statusLabels[data.status].label} dan email konfirmasi telah dikirim ke pelanggan`
            );
            refetch();
        },
        onError: () => {
            toast.error("Gagal mengubah status pesanan");
        },
    });

    // Update order status
    // const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    //     try {
    //         const res = await axiosInstance.patch(`/orders/${orderId}`, {
    //             status,
    //         });
    //         toast.success(
    //             `Status reservasi berhasil diubah ke ${status} dan email konfirmasi telah dikirim ke pelanggan`
    //         );
    //         refetch();
    //         return res.data.data;
    //     } catch (error) {
    //         console.error("Error updating order status:", error);
    //         toast.error("Gagal mengubah status pesanan");
    //     }
    // };

    // Filter orders based on search term and status
    const filteredOrders = orders?.filter((order) => {
        // Status filter
        if (statusFilter !== "ALL" && order.status !== statusFilter)
            return false;

        // Search term filter
        if (!searchTerm) return true;

        const searchLower = searchTerm.toLowerCase();
        return (
            order.booking.user.name.toLowerCase().includes(searchLower) ||
            order.booking.table.tableNumber.toString().includes(searchLower) ||
            order.id.toLowerCase().includes(searchLower)
        );
    });

    // Pagination
    const totalPages = Math.ceil((filteredOrders?.length || 0) / itemsPerPage);
    const paginatedOrders = filteredOrders?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Calculate total price for an order
    const calculateOrderTotal = (items: OrderItem[]) => {
        return items.reduce((total, item) => {
            return total + item.menu.price * item.quantity;
        }, 0);
    };

    // Reset pagination when search or filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    // Status badge color mapping
    const getStatusBadgeClass = (status: OrderStatus) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-100 text-yellow-800";
            case "PREPARING":
                return "bg-blue-100 text-blue-800";
            case "COMPLETED":
                return "bg-green-100 text-green-800";
            case "CANCELLED":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <AdminLayout>
            <Head>
                <title>Kelola Pesanan - Cita Nusa Resto</title>
                <meta
                    name="description"
                    content="Dasbor admin untuk mengelola pesanan di Cita Nusa Resto"
                />
            </Head>

            <div className="p-6 bg-white rounded-lg">
                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                    <h1 className="text-2xl font-extrabold text-amber-900 mb-4 md:mb-0">
                        Kelola Pesanan
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
                                placeholder="Cari pesanan berdasarkan nama pelanggan atau nomor meja..."
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 pl-10"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        </div>
                    </div>

                    {/* Filter by Status */}
                    <div className="w-full md:w-1/4">
                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(
                                    e.target.value as OrderStatus | "ALL"
                                )
                            }
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                            <option value="ALL">Semua Status</option>
                            <option value="PENDING">Menunggu</option>
                            <option value="PREPARING">Sedang Disiapkan</option>
                            <option value="COMPLETED">Selesai</option>
                            <option value="CANCELLED">Dibatalkan</option>
                        </select>
                    </div>

                    {/* Add Order Button */}
                    <Link
                        href="/admin/orders/add"
                        className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                    >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Tambah Pesanan Baru
                    </Link>
                </div>

                {/* Orders List */}
                {isLoading ? (
                    <div className="text-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-amber-600" />
                        <p className="mt-2 text-amber-800">
                            Memuat data pesanan...
                        </p>
                    </div>
                ) : paginatedOrders && paginatedOrders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border-collapse">
                            <thead>
                                <tr className="bg-amber-50">
                                    <th className="py-3 px-4 text-left text-xs font-medium text-amber-800 uppercase tracking-wider border-b">
                                        ID Pesanan
                                    </th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-amber-800 uppercase tracking-wider border-b">
                                        Pelanggan
                                    </th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-amber-800 uppercase tracking-wider border-b">
                                        Meja
                                    </th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-amber-800 uppercase tracking-wider border-b">
                                        Tanggal & Waktu
                                    </th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-amber-800 uppercase tracking-wider border-b">
                                        Item
                                    </th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-amber-800 uppercase tracking-wider border-b">
                                        Total
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
                                {paginatedOrders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <ShoppingCart className="h-4 w-4 text-amber-600 mr-2" />
                                                <span className="font-medium text-amber-900">
                                                    {order.id
                                                        .substring(0, 8)
                                                        .toUpperCase()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <User className="h-4 w-4 text-gray-500 mr-1" />
                                                <span className="text-gray-900">
                                                    {order.booking.user.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Table2 className="h-4 w-4 text-gray-500 mr-1" />
                                                <span className="text-gray-900">
                                                    Meja #
                                                    {
                                                        order.booking.table
                                                            .tableNumber
                                                    }
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                                                <span className="text-gray-900">
                                                    {format(
                                                        new Date(
                                                            order.booking.dateTime
                                                        ),
                                                        "dd MMM yyyy, HH:mm",
                                                        { locale: id }
                                                    )}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Tag className="h-4 w-4 text-gray-500 mr-1" />
                                                <span className="text-gray-900">
                                                    {order.items.length} item
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">
                                                Rp{" "}
                                                {calculateOrderTotal(
                                                    order.items
                                                ).toLocaleString("id-ID")}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 rounded-md text-sm ${getStatusBadgeClass(
                                                    order.status
                                                )}`}
                                            >
                                                {order.status === "PENDING" &&
                                                    "Menunggu"}
                                                {order.status === "PREPARING" &&
                                                    "Sedang Disiapkan"}
                                                {order.status === "COMPLETED" &&
                                                    "Selesai"}
                                                {order.status === "CANCELLED" &&
                                                    "Dibatalkan"}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <div className="flex space-x-2">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="inline-flex items-center px-2.5 py-1.5 bg-amber-50 text-amber-800 rounded hover:bg-amber-100"
                                                >
                                                    <Edit className="h-4 w-4 mr-1" />
                                                    Detail
                                                </Link>

                                                {order.status === "PENDING" && (
                                                    <button
                                                        onClick={() =>
                                                            updateOrderStatus.mutate(
                                                                {
                                                                    orderId:
                                                                        order.id,
                                                                    status: "PREPARING",
                                                                }
                                                            )
                                                        }
                                                        className="inline-flex items-center px-2.5 py-1.5 bg-blue-50 text-blue-800 rounded hover:bg-blue-100"
                                                        disabled={
                                                            updateOrderStatus.isPending
                                                        }
                                                    >
                                                        <TrendingUp className="h-4 w-4 mr-1" />
                                                        Proses
                                                    </button>
                                                )}

                                                {order.status ===
                                                    "PREPARING" && (
                                                    <button
                                                        onClick={() =>
                                                            updateOrderStatus.mutate(
                                                                {
                                                                    orderId:
                                                                        order.id,
                                                                    status: "COMPLETED",
                                                                }
                                                            )
                                                        }
                                                        className="inline-flex items-center px-2.5 py-1.5 bg-green-50 text-green-800 rounded hover:bg-green-100"
                                                        disabled={
                                                            updateOrderStatus.isPending
                                                        }
                                                    >
                                                        <CheckCircle className="h-4 w-4 mr-1" />
                                                        Selesai
                                                    </button>
                                                )}

                                                {(order.status === "PENDING" ||
                                                    order.status ===
                                                        "PREPARING") && (
                                                    <button
                                                        onClick={() =>
                                                            updateOrderStatus.mutate(
                                                                {
                                                                    orderId:
                                                                        order.id,
                                                                    status: "CANCELLED",
                                                                }
                                                            )
                                                        }
                                                        className="inline-flex items-center px-2.5 py-1.5 bg-red-50 text-red-800 rounded hover:bg-red-100"
                                                        disabled={
                                                            updateOrderStatus.isPending
                                                        }
                                                    >
                                                        <XCircle className="h-4 w-4 mr-1" />
                                                        Batal
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-10 bg-amber-50 rounded-lg">
                        <ShoppingCart className="h-10 w-10 text-amber-600 mx-auto mb-2" />
                        <p className="text-amber-800">
                            {searchTerm || statusFilter !== "ALL"
                                ? "Tidak ada pesanan yang cocok dengan pencarian atau filter Anda"
                                : "Belum ada pesanan yang tersedia"}
                        </p>
                        <Link
                            href="/admin/orders/add"
                            className="mt-4 inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                        >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Tambah Pesanan Baru
                        </Link>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mt-6">
                        <div className="text-sm text-gray-700">
                            Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{" "}
                            {Math.min(
                                currentPage * itemsPerPage,
                                filteredOrders?.length || 0
                            )}{" "}
                            dari {filteredOrders?.length || 0} pesanan
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
        </AdminLayout>
    );
};

export default AdminOrdersPage;
