import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
    ArrowLeft,
    Calendar,
    Clock,
    Loader2,
    MapPin,
    ShoppingCart,
    Receipt,
    CheckCircle,
    TrendingUp,
    XCircle,
    User,
    Table2,
    Users,
} from "lucide-react";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import { OrderStatus } from "@prisma/client";
import { Order } from "@/types";
import Image from "next/image";
import { calculateOrderTotal } from "@/utils";

// Status label and color mapping
const statusLabels: Record<OrderStatus, string> = {
    PENDING: "Menunggu",
    PREPARING: "Sedang Diproses",
    COMPLETED: "Selesai",
    CANCELLED: "Dibatalkan",
};

const statusColors: Record<OrderStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PREPARING: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
};

const AdminOrderDetailPage: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const { isAuthenticated, isHydrated } = useAuth(
        "/auth/login?callbackUrl=" + encodeURIComponent(`/admin/orders/${id}`)
    );

    // Fetch order details
    const {
        data: order,
        isLoading,
        refetch,
    } = useQuery<Order>({
        queryKey: ["adminOrderDetail", id],
        queryFn: async () => {
            const response = await axiosInstance.get(`/orders/${id}`);
            return response.data.data;
        },
        enabled: !!id && isAuthenticated && isHydrated,
    });

    // Update order status mutation
    const updateOrderStatus = useMutation({
        mutationFn: async (newStatus: OrderStatus) => {
            const response = await axiosInstance.patch(`/orders/${id}`, {
                status: newStatus,
            });
            return response.data.data;
        },
        onSuccess: (data: { status: OrderStatus }) => {
            toast.success(
                `Status pesanan berhasil diubah ke ${statusLabels[data.status]} dan email konfirmasi telah dikirim ke pelanggan`
            );
            refetch();
        },
        onError: () => {
            toast.error("Gagal mengubah status pesanan");
        },
    });

    // Calculate total price for the order

    if (isLoading || !isHydrated) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center min-h-screen bg-gray-50">
                    <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-amber-600" />
                        <p className="mt-2 text-amber-800">
                            Memuat data pesanan...
                        </p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <Head>
                <title>Detail Pesanan - Cita Nusa Resto</title>
                <meta
                    name="description"
                    content="Detail pesanan admin di Cita Nusa Resto"
                />
            </Head>

            <div className="p-6 bg-white rounded-lg">
                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                    <h1 className="text-2xl font-extrabold text-amber-900 mb-4 md:mb-0">
                        Detail Pesanan
                    </h1>
                    <Link
                        href="/admin/orders"
                        className="px-4 py-2 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 inline-flex items-center"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Kembali ke Daftar Pesanan
                    </Link>
                </div>

                {/* Status Badge */}
                <div className="mb-6 space-x-3">
                    <span
                        className={`px-3 py-1 rounded-full ${
                            statusColors[order?.status || "PENDING"]
                        }`}
                    >
                        {statusLabels[order?.status || "PENDING"]}
                    </span>
                    <div className="inline-block text-gray-500 text-sm">
                        ID: {order?.id.substring(0, 8).toUpperCase()}
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column: Order Information */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-xl font-bold text-amber-900 mb-4 pb-2 border-b border-gray-200">
                            Informasi Pesanan
                        </h2>

                        <div className="space-y-4 mt-4">
                            <div className="flex items-start">
                                <Calendar className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
                                <div>
                                    <p className="text-gray-600 text-sm">
                                        Tanggal & Waktu
                                    </p>
                                    <p className="text-gray-900 font-medium">
                                        {order &&
                                            order.booking &&
                                            format(
                                                new Date(
                                                    order.booking.dateTime
                                                ),
                                                "EEEE, dd MMMM yyyy, HH:mm",
                                                { locale: localeId }
                                            )}{" "}
                                        WIB
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Table2 className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
                                <div>
                                    <p className="text-gray-600 text-sm">
                                        Meja
                                    </p>
                                    <p className="text-gray-900 font-medium">
                                        <span className="px-2 py-1 bg-amber-50 text-amber-800 rounded-md text-sm">
                                            Meja #
                                            {order?.booking.table.tableNumber}
                                        </span>
                                        <span className="text-gray-500 text-sm ml-2">
                                            (Kapasitas:{" "}
                                            {order?.booking.table.capacity}{" "}
                                            orang)
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Users className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
                                <div>
                                    <p className="text-gray-600 text-sm">
                                        Jumlah Tamu
                                    </p>
                                    <p className="text-gray-900 font-medium">
                                        {order?.booking.guestCount} orang
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Receipt className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
                                <div>
                                    <p className="text-gray-600 text-sm">
                                        Total Harga
                                    </p>
                                    <p className="text-gray-900 font-medium">
                                        Rp{" "}
                                        {calculateOrderTotal(
                                            order?.items
                                        ).toLocaleString("id-ID")}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Clock className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
                                <div>
                                    <p className="text-gray-600 text-sm">
                                        Waktu Pemesanan
                                    </p>
                                    <p className="text-gray-900 font-medium">
                                        {order &&
                                            format(
                                                new Date(order.createdAt),
                                                "dd MMM yyyy, HH:mm",
                                                { locale: localeId }
                                            )}
                                    </p>
                                </div>
                            </div>

                            {order?.updatedAt &&
                                order.updatedAt !== order.createdAt && (
                                    <div className="flex items-start">
                                        <Clock className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
                                        <div>
                                            <p className="text-gray-600 text-sm">
                                                Terakhir Diubah
                                            </p>
                                            <p className="text-gray-900 font-medium">
                                                {format(
                                                    new Date(order.updatedAt),
                                                    "dd MMM yyyy, HH:mm",
                                                    { locale: localeId }
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>

                    {/* Right Column: Customer Details */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-xl font-bold text-amber-900 mb-4 pb-2 border-b border-gray-200">
                            Informasi Pelanggan
                        </h2>

                        <div className="space-y-4 mt-4">
                            <div className="flex items-start">
                                <User className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
                                <div>
                                    <p className="text-gray-600 text-sm">
                                        Nama
                                    </p>
                                    <p className="text-gray-900 font-medium">
                                        {order?.booking.user.name}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <MapPin className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
                                <div>
                                    <p className="text-gray-600 text-sm">
                                        Email
                                    </p>
                                    <p className="text-gray-900 font-medium">
                                        {order?.booking.user.email}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Calendar className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
                                <div>
                                    <p className="text-gray-600 text-sm">
                                        No. Telepon
                                    </p>
                                    <p className="text-gray-900 font-medium">
                                        {order?.booking.user.phone || "-"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="mt-8">
                    <h2 className="text-xl font-bold text-amber-900 mb-4">
                        Daftar Menu Pesanan
                    </h2>

                    <div className="overflow-x-auto bg-gray-50 rounded-lg">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr className="bg-amber-50">
                                    <th className="py-3 px-4 text-left text-xs font-medium text-amber-800 uppercase tracking-wider border-b">
                                        Menu
                                    </th>
                                    <th className="py-3 px-4 text-center text-xs font-medium text-amber-800 uppercase tracking-wider border-b">
                                        Harga
                                    </th>
                                    <th className="py-3 px-4 text-center text-xs font-medium text-amber-800 uppercase tracking-wider border-b">
                                        Jumlah
                                    </th>
                                    <th className="py-3 px-4 text-right text-xs font-medium text-amber-800 uppercase tracking-wider border-b">
                                        Subtotal
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {order?.items.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="py-4 px-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12 bg-amber-100 rounded-md overflow-hidden">
                                                    {item.menu.image ? (
                                                        <Image
                                                            src={`/images/menu/${item.menu.image}`}
                                                            alt={item.menu.name}
                                                            className="h-full w-full object-cover"
                                                            width={96}
                                                            height={96}
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full w-full text-amber-600">
                                                            <ShoppingCart className="h-6 w-6" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {item.menu.name}
                                                    </div>
                                                    {item.notes && (
                                                        <div className="text-sm text-gray-500 mt-1">
                                                            Catatan:{" "}
                                                            {item.notes}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-center text-sm text-gray-900">
                                            Rp{" "}
                                            {item.menu.price.toLocaleString(
                                                "id-ID"
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-center text-sm text-gray-900">
                                            {item.quantity}
                                        </td>
                                        <td className="py-4 px-4 text-right text-sm font-medium text-gray-900">
                                            Rp{" "}
                                            {(
                                                item.menu.price * item.quantity
                                            ).toLocaleString("id-ID")}
                                        </td>
                                    </tr>
                                ))}

                                {/* Total Row */}
                                <tr className="bg-amber-50">
                                    <td
                                        colSpan={3}
                                        className="py-4 px-4 text-right text-sm font-bold text-gray-900"
                                    >
                                        Total
                                    </td>
                                    <td className="py-4 px-4 text-right text-sm font-bold text-gray-900">
                                        Rp{" "}
                                        {calculateOrderTotal(
                                            order?.items
                                        ).toLocaleString("id-ID")}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-amber-900 mb-4">
                        Tindakan
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {order?.status === "PENDING" && (
                            <button
                                onClick={() =>
                                    updateOrderStatus.mutate("PREPARING")
                                }
                                disabled={updateOrderStatus.isPending}
                                className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-800 border border-blue-200 rounded hover:bg-blue-100"
                            >
                                {updateOrderStatus.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                    <TrendingUp className="h-4 w-4 mr-2" />
                                )}
                                Proses Pesanan
                            </button>
                        )}

                        {order?.status === "PREPARING" && (
                            <button
                                onClick={() =>
                                    updateOrderStatus.mutate("COMPLETED")
                                }
                                disabled={updateOrderStatus.isPending}
                                className="inline-flex items-center px-4 py-2 bg-green-50 text-green-800 border border-green-200 rounded hover:bg-green-100"
                            >
                                {updateOrderStatus.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                )}
                                Selesaikan Pesanan
                            </button>
                        )}

                        {(order?.status === "PENDING" ||
                            order?.status === "PREPARING") && (
                            <button
                                onClick={() =>
                                    updateOrderStatus.mutate("CANCELLED")
                                }
                                disabled={updateOrderStatus.isPending}
                                className="inline-flex items-center px-4 py-2 bg-red-50 text-red-800 border border-red-200 rounded hover:bg-red-100"
                            >
                                {updateOrderStatus.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                    <XCircle className="h-4 w-4 mr-2" />
                                )}
                                Batalkan Pesanan
                            </button>
                        )}
                    </div>
                </div>

                {/* Staff Guidelines */}
                <div className="mt-8 bg-amber-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-amber-900 mb-4">
                        Panduan untuk Staff
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                            <span className="text-amber-600 mr-2">•</span>
                            <span>
                                Pastikan menu disiapkan sesuai dengan catatan
                                khusus dari pelanggan.
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-amber-600 mr-2">•</span>
                            <span>
                                Jika ada menu yang tidak tersedia, segera
                                hubungi pelanggan untuk penggantian.
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-amber-600 mr-2">•</span>
                            <span>
                                Perhatikan waktu penyajian agar sesuai dengan
                                reservasi pelanggan.
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-amber-600 mr-2">•</span>
                            <span>
                                Ubah status pesanan menjadi {`'Selesai'`}{" "}
                                setelah semua menu telah disajikan dan dinikmati
                                pelanggan.
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminOrderDetailPage;
