import { useState, useEffect } from "react";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BookingStatus } from "@prisma/client";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    Calendar,
    Check,
    Clock,
    Eye,
    Filter,
    Loader2,
    Search,
    UserCheck,
    X,
} from "lucide-react";
import axiosInstance from "@/lib/axios";
import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import { BookingWithRelations } from "@/types";

const statusLabels: Record<BookingStatus, { label: string; color: string }> = {
    PENDING: { label: "Menunggu", color: "bg-yellow-100 text-yellow-800" },
    CONFIRMED: { label: "Terkonfirmasi", color: "bg-green-100 text-green-800" },
    CANCELLED: { label: "Dibatalkan", color: "bg-red-100 text-red-800" },
    COMPLETED: { label: "Selesai", color: "bg-blue-100 text-blue-800" },
};

const AdminBookingsPage: NextPage = () => {
    const { isAuthenticated, isHydrated } = useAuth(
        "/auth/login?callbackUrl=" + encodeURIComponent("/admin/bookings")
    );

    const [filterDate, setFilterDate] = useState<Date | null>(null);
    const [filterStatus, setFilterStatus] = useState<BookingStatus | "ALL">(
        "ALL"
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoadingConfirm, setIsLoadingConfirm] = useState(false);
    const [isLoadingFinish, setIsLoadingFinish] = useState(false);
    const [isLoadingCancel, setIsLoadingCancel] = useState(false);

    const itemsPerPage = 10;

    // Fetch bookings
    const {
        data: bookings,
        isLoading,
        refetch,
    } = useQuery<BookingWithRelations[]>({
        queryKey: ["adminBookings", filterDate, filterStatus],
        queryFn: async () => {
            try {
                const dateParam = filterDate
                    ? format(filterDate, "yyyy-MM-dd")
                    : "";
                const statusParam = filterStatus !== "ALL" ? filterStatus : "";

                const response = await axiosInstance.get(
                    `/bookings?date=${dateParam}${
                        statusParam ? `&status=${statusParam}` : ""
                    }`
                );

                if (!response.data.success) {
                    throw new Error("Failed to fetch bookings");
                }

                return response.data.data;
            } catch (error) {
                console.error("Error fetching bookings:", error);
                toast.error("Gagal mengambil data reservasi");
                return [];
            }
        },
        enabled: isAuthenticated && isHydrated,
    });

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: {
            bookingId: string;
            newStatus: BookingStatus;
        }) => {
            const response = await axiosInstance.patch(
                `/bookings/${data.bookingId}`,
                {
                    status: data.newStatus,
                }
            );

            return response.data;
        },
        onSuccess: (data: { status: BookingStatus }) => {
            toast.success(
                `Status reservasi berhasil diubah ke ${
                    statusLabels[data.status].label
                } dan email konfirmasi telah dikirim ke pelanggan`
            );
            refetch();
        },
        onError: (error) => {
            console.error("Error updating booking status:", error);
            toast.error("Gagal mengubah status reservasi");
        },
        onSettled: () => {
            if (isLoadingConfirm) setIsLoadingConfirm(false);
            else if (isLoadingFinish) setIsLoadingFinish(false);
            else if (isLoadingCancel) setIsLoadingCancel(false);
        },
    });

    // Handle status change
    const handleStatusChange = (
        bookingId: string,
        newStatus: BookingStatus
    ) => {
        mutate({ bookingId, newStatus });
    };

    // Filter bookings based on search term
    const filteredBookings =
        bookings?.filter((booking) => {
            if (!searchTerm) return true;

            const searchLower = searchTerm.toLowerCase();
            return (
                booking.user.name.toLowerCase().includes(searchLower) ||
                booking.user.email.toLowerCase().includes(searchLower) ||
                (booking.user.phone &&
                    booking.user.phone.includes(searchTerm)) ||
                `Meja #${booking.table.tableNumber}`.includes(searchTerm)
            );
        }) || [];

    // Pagination
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
    const paginatedBookings = filteredBookings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filterDate, filterStatus, searchTerm]);

    // Reset date filter
    const handleResetDate = () => {
        setFilterDate(null);
    };

    return (
        <AdminLayout>
            <Head>
                <title>Kelola Reservasi - Cita Nusa Resto</title>
                <meta
                    name="description"
                    content="Dasbor admin untuk mengelola reservasi di Cita Nusa Resto"
                />
            </Head>

            <div className="p-6 bg-white rounded-lg">
                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                    <h1
                        className={`text-2xl font-extrabold text-amber-900 mb-4 md:mb-0`}
                    >
                        Kelola Reservasi
                    </h1>
                    <Link
                        href="/admin/dashboard"
                        className="px-4 py-2 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 inline-flex items-center"
                    >
                        <Clock className="h-4 w-4 mr-2" />
                        Kembali ke Dashboard
                    </Link>
                </div>

                {/* Filters */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Date Filter */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Filter Tanggal
                        </label>
                        <div className="flex items-center">
                            <div className="relative flex-grow text-black">
                                <DatePicker
                                    selected={filterDate}
                                    onChange={(date) => setFilterDate(date)}
                                    dateFormat="dd MMMM yyyy"
                                    locale={id}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 pl-10"
                                />
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            </div>
                            {filterDate && (
                                <button
                                    onClick={handleResetDate}
                                    className="ml-2 p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Filter Status
                        </label>
                        <div className="relative">
                            <select
                                value={filterStatus}
                                onChange={(e) =>
                                    setFilterStatus(
                                        e.target.value as BookingStatus | "ALL"
                                    )
                                }
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 pl-10 text-black"
                            >
                                <option value="ALL">Semua Status</option>
                                <option value="PENDING">Menunggu</option>
                                <option value="CONFIRMED">Terkonfirmasi</option>
                                <option value="CANCELLED">Dibatalkan</option>
                                <option value="COMPLETED">Selesai</option>
                            </select>
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        </div>
                    </div>

                    {/* Search Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cari Reservasi
                        </label>
                        <div className="relative text-black">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Cari nama pelanggan, email, meja..."
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 pl-10"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        </div>
                    </div>
                </div>

                {/* Booking List */}
                {isLoading ? (
                    <div className="text-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-amber-600" />
                        <p className="mt-2 text-amber-800">
                            Memuat data reservasi...
                        </p>
                    </div>
                ) : paginatedBookings.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border-collapse">
                            <thead>
                                <tr className="bg-amber-50">
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
                                        Jumlah Tamu
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
                                {paginatedBookings.map((booking) => (
                                    <tr
                                        key={booking.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">
                                                    {booking.user.name}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {booking.user.email}
                                                </span>
                                                {booking.user.phone && (
                                                    <span className="text-sm text-gray-500">
                                                        {booking.user.phone}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <span className="px-2 py-1 bg-amber-50 text-amber-800 rounded-md text-sm">
                                                Meja #
                                                {booking.table.tableNumber}
                                            </span>
                                            <div className="text-sm text-gray-500 mt-1">
                                                Kapasitas:{" "}
                                                {booking.table.capacity} orang
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {format(
                                                    new Date(booking.dateTime),
                                                    "dd MMMM yyyy",
                                                    { locale: id }
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {format(
                                                    new Date(booking.dateTime),
                                                    "HH:mm",
                                                    { locale: id }
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Durasi: {booking.duration} menit
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap text-center">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-sm">
                                                {booking.guestCount} orang
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 rounded-md text-sm ${
                                                    statusLabels[booking.status]
                                                        .color
                                                }`}
                                            >
                                                {
                                                    statusLabels[booking.status]
                                                        .label
                                                }
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap space-x-2">
                                            <Link
                                                href={`/admin/bookings/${booking.id}`}
                                                className="inline-flex items-center px-2.5 py-1.5 bg-amber-50 text-amber-800 rounded hover:bg-amber-100"
                                            >
                                                <Eye className="h-4 w-4 mr-1" />
                                                Detail
                                            </Link>

                                            {booking.status === "PENDING" && (
                                                <button
                                                    onClick={() => {
                                                        handleStatusChange(
                                                            booking.id,
                                                            "CONFIRMED"
                                                        );
                                                        setIsLoadingConfirm(
                                                            true
                                                        );
                                                    }}
                                                    disabled={isPending}
                                                    className="inline-flex items-center px-2.5 py-1.5 bg-green-50 text-green-800 rounded hover:bg-green-100"
                                                >
                                                    {isPending &&
                                                    isLoadingConfirm ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Check className="h-4 w-4 mr-1" />
                                                    )}
                                                    Konfirmasi
                                                </button>
                                            )}

                                            {booking.status === "CONFIRMED" && (
                                                <button
                                                    onClick={() => {
                                                        handleStatusChange(
                                                            booking.id,
                                                            "COMPLETED"
                                                        );
                                                        setIsLoadingFinish(
                                                            true
                                                        );
                                                    }}
                                                    disabled={isPending}
                                                    className="inline-flex items-center px-2.5 py-1.5 bg-blue-50 text-blue-800 rounded hover:bg-blue-100"
                                                >
                                                    {isPending &&
                                                    isLoadingFinish ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <UserCheck className="h-4 w-4 mr-1" />
                                                    )}
                                                    Selesai
                                                </button>
                                            )}

                                            {(booking.status === "PENDING" ||
                                                booking.status ===
                                                    "CONFIRMED") && (
                                                <button
                                                    onClick={() => {
                                                        handleStatusChange(
                                                            booking.id,
                                                            "CANCELLED"
                                                        );
                                                        setIsLoadingCancel(
                                                            true
                                                        );
                                                    }}
                                                    disabled={isPending}
                                                    className="inline-flex items-center px-2.5 py-1.5 bg-red-50 text-red-800 rounded hover:bg-red-100"
                                                >
                                                    {isPending &&
                                                    isLoadingCancel ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <X className="h-4 w-4 mr-1" />
                                                    )}
                                                    Batalkan
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-10 bg-amber-50 rounded-lg">
                        <p className="text-amber-800">
                            {bookings && bookings.length > 0
                                ? "Tidak ada reservasi yang cocok dengan filter"
                                : "Tidak ada reservasi yang tersedia"}
                        </p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mt-6">
                        <div className="text-sm text-gray-700">
                            Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{" "}
                            {Math.min(
                                currentPage * itemsPerPage,
                                filteredBookings.length
                            )}{" "}
                            dari {filteredBookings.length} reservasi
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

export default AdminBookingsPage;
