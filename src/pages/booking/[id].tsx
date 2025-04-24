import { useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "@/components/layout/Layout";
import { playfair } from "../_app";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { toast } from "react-hot-toast";
import { BookingStatus, Order } from "@prisma/client";
import {
    Loader2,
    Calendar,
    Clock,
    Users,
    MapPin,
    FileText,
    X,
} from "lucide-react";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";

interface BookingDetail {
    id: string;
    dateTime: string;
    status: BookingStatus;
    guestCount: number;
    specialRequest?: string;
    duration: number;
    createdAt: string;
    updatedAt: string;
    userId: string;
    tableId: string;
    user: {
        id: string;
        name: string;
        email: string;
        phone: string;
    };
    table: {
        id: string;
        tableNumber: number;
        capacity: number;
    };
    orders: Order[];
}

const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    CONFIRMED: "bg-green-100 text-green-800 border-green-200",
    CANCELLED: "bg-red-100 text-red-800 border-red-200",
    COMPLETED: "bg-blue-100 text-blue-800 border-blue-200",
};

const statusLabels = {
    PENDING: "Menunggu Konfirmasi",
    CONFIRMED: "Dikonfirmasi",
    CANCELLED: "Dibatalkan",
    COMPLETED: "Selesai",
};

const BookingDetailPage: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const { isAuthenticated, isHydrated } = useAuth();
    const { user } = useAuthStore();
    const [showCancelModal, setShowCancelModal] = useState(false);

    // Fetch booking details
    const {
        data: booking,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["booking", id],
        queryFn: async () => {
            const response = await axiosInstance.get(`/bookings/${id}`);
            return response.data;
        },
        enabled: !!id && isAuthenticated && isHydrated,
    });

    // Cancel booking mutation
    const cancelBookingMutation = useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.delete(`/bookings/${id}`);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Reservasi berhasil dibatalkan");
            setShowCancelModal(false);
            refetch();
        },
        onError: (error) => {
            toast.error("Gagal membatalkan reservasi");
            console.error("Cancel booking error:", error);
        },
    });

    // Handle booking cancellation
    const handleCancelBooking = () => {
        cancelBookingMutation.mutate();
    };

    // Check if booking is cancellable (pending or confirmed and at least 3 hours before the booking time)
    const isCancellable = (booking: BookingDetail) => {
        if (booking.status !== "PENDING" && booking.status !== "CONFIRMED") {
            return false;
        }

        const bookingTime = new Date(booking.dateTime);
        const now = new Date();
        const hoursDifference =
            (bookingTime.getTime() - now.getTime()) / (1000 * 60 * 60);

        return hoursDifference >= 3;
    };

    if (isLoading || !isHydrated) {
        return (
            <Layout>
                <div className="flex justify-center items-center min-h-screen bg-amber-50">
                    <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-amber-600" />
                        <p className="mt-2 text-amber-800">
                            Memuat data reservasi...
                        </p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="min-h-screen bg-amber-50 py-16 px-4">
                    <div className="container mx-auto max-w-3xl">
                        <div className="bg-white p-8 rounded-lg shadow-md text-center">
                            <h1
                                className={`text-2xl font-bold text-amber-900 mb-4 ${playfair.className}`}
                            >
                                Gagal Memuat Data
                            </h1>
                            <p className="text-gray-700 mb-6">
                                Terjadi kesalahan saat memuat data reservasi.
                                Silakan coba lagi nanti.
                            </p>
                            <Link
                                href="/profile/bookings"
                                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md font-medium"
                            >
                                Kembali ke Daftar Reservasi
                            </Link>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    // If not authenticated or not the owner of the booking (and not admin/staff)
    if (
        isHydrated &&
        (!isAuthenticated ||
            (user?.role === "CUSTOMER" && user?.id !== booking?.userId))
    ) {
        router.push("/auth/login");
        return null;
    }

    return (
        <Layout>
            <Head>
                <title>Detail Reservasi - Cita Nusa Resto</title>
                <meta
                    name="description"
                    content="Detail reservasi di Cita Nusa Resto"
                />
            </Head>

            <section className="py-12 px-4 bg-amber-50 min-h-screen">
                <div className="container mx-auto max-w-3xl">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        {/* Header */}
                        <div className="bg-amber-600 p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                <div>
                                    <h1
                                        className={`text-2xl font-bold text-white ${playfair.className}`}
                                    >
                                        Detail Reservasi
                                    </h1>
                                    <p className="text-amber-100 mt-1">
                                        ID:{" "}
                                        {booking?.id
                                            .substring(0, 8)
                                            .toUpperCase()}
                                    </p>
                                </div>
                                <div
                                    className={`mt-4 md:mt-0 px-4 py-2 rounded-full border ${
                                        statusColors[booking?.status]
                                    }`}
                                >
                                    {statusLabels[booking?.status]}
                                </div>
                            </div>
                        </div>

                        {/* Booking Details */}
                        <div className="p-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-6">
                                    <div>
                                        <h2
                                            className={`text-xl font-semibold text-amber-900 mb-4 ${playfair.className}`}
                                        >
                                            Informasi Reservasi
                                        </h2>
                                        <div className="space-y-4">
                                            <div className="flex items-start">
                                                <Calendar className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
                                                <div>
                                                    <p className="text-gray-600 text-sm">
                                                        Tanggal
                                                    </p>
                                                    <p className="text-gray-900 font-medium">
                                                        {format(
                                                            new Date(
                                                                booking?.dateTime
                                                            ),
                                                            "EEEE, dd MMMM yyyy",
                                                            { locale: localeId }
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <Clock className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
                                                <div>
                                                    <p className="text-gray-600 text-sm">
                                                        Waktu
                                                    </p>
                                                    <p className="text-gray-900 font-medium">
                                                        {format(
                                                            new Date(
                                                                booking?.dateTime
                                                            ),
                                                            "HH:mm",
                                                            { locale: localeId }
                                                        )}{" "}
                                                        WIB
                                                        <span className="text-gray-500 text-sm ml-2">
                                                            (Durasi:{" "}
                                                            {booking?.duration}{" "}
                                                            menit)
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
                                                        {booking?.guestCount}{" "}
                                                        orang
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <MapPin className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
                                                <div>
                                                    <p className="text-gray-600 text-sm">
                                                        Nomor Meja
                                                    </p>
                                                    <p className="text-gray-900 font-medium">
                                                        Meja #
                                                        {
                                                            booking?.table
                                                                .tableNumber
                                                        }
                                                        <span className="text-gray-500 text-sm ml-2">
                                                            (Kapasitas:{" "}
                                                            {
                                                                booking?.table
                                                                    .capacity
                                                            }{" "}
                                                            orang)
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h2
                                            className={`text-xl font-semibold text-amber-900 mb-4 ${playfair.className}`}
                                        >
                                            Informasi Pemesan
                                        </h2>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-gray-600 text-sm">
                                                    Nama
                                                </p>
                                                <p className="text-gray-900 font-medium">
                                                    {booking?.user.name}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600 text-sm">
                                                    Email
                                                </p>
                                                <p className="text-gray-900 font-medium">
                                                    {booking?.user.email}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600 text-sm">
                                                    No. Telepon
                                                </p>
                                                <p className="text-gray-900 font-medium">
                                                    {booking?.user.phone || "-"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {booking?.specialRequest && (
                                        <div>
                                            <div className="flex items-start">
                                                <FileText className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
                                                <div>
                                                    <p className="text-gray-600 text-sm">
                                                        Permintaan Khusus
                                                    </p>
                                                    <p className="text-gray-900">
                                                        {booking.specialRequest}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Booking Info */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="bg-amber-50 p-4 rounded-md">
                                    <h3 className="font-medium text-amber-800 mb-2">
                                        Informasi Penting:
                                    </h3>
                                    <ul className="text-gray-700 space-y-2 text-sm">
                                        <li className="flex items-start">
                                            <span className="text-amber-600 mr-2">
                                                •
                                            </span>
                                            <span>
                                                Mohon datang 10 menit sebelum
                                                waktu reservasi.
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-amber-600 mr-2">
                                                •
                                            </span>
                                            <span>
                                                Jika Anda ingin membatalkan atau
                                                mengubah reservasi, silakan
                                                lakukan minimal 3 jam sebelum
                                                waktu reservasi.
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-amber-600 mr-2">
                                                •
                                            </span>
                                            <span>
                                                Meja akan ditahan selama 15
                                                menit dari waktu reservasi.
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/profile/bookings"
                                    className="bg-white hover:bg-gray-100 text-amber-900 border border-amber-300 px-6 py-3 rounded-md font-medium text-center"
                                >
                                    Kembali ke Daftar Reservasi
                                </Link>

                                {booking && isCancellable(booking) && (
                                    <button
                                        onClick={() => setShowCancelModal(true)}
                                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-medium"
                                    >
                                        Batalkan Reservasi
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cancel Confirmation Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3
                                className={`text-xl font-bold text-amber-900 ${playfair.className}`}
                            >
                                Konfirmasi Pembatalan
                            </h3>
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="mb-6">
                            <p className="text-gray-700 mb-4">
                                Apakah Anda yakin ingin membatalkan reservasi
                                ini? Tindakan ini tidak dapat dibatalkan.
                            </p>
                            <div className="bg-yellow-50 p-3 rounded-md text-yellow-800 text-sm mb-2">
                                <p>
                                    Tanggal:{" "}
                                    {format(
                                        new Date(booking?.dateTime),
                                        "dd MMMM yyyy",
                                        { locale: localeId }
                                    )}
                                </p>
                                <p>
                                    Waktu:{" "}
                                    {format(
                                        new Date(booking?.dateTime),
                                        "HH:mm",
                                        { locale: localeId }
                                    )}{" "}
                                    WIB
                                </p>
                                <p>
                                    Meja #{booking?.table.tableNumber} untuk{" "}
                                    {booking?.guestCount} orang
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 py-2 px-4 rounded-md font-medium"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleCancelBooking}
                                disabled={cancelBookingMutation.isPending}
                                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium flex items-center justify-center"
                            >
                                {cancelBookingMutation.isPending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        <span>Memproses...</span>
                                    </>
                                ) : (
                                    "Ya, batalkan reservasi"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default BookingDetailPage;
