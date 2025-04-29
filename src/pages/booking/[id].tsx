import { useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "@/components/layout/Layout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { toast } from "react-hot-toast";
import {
    Loader2,
    Calendar,
    Clock,
    Users,
    MapPin,
    FileText,
} from "lucide-react";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { statusColors, statusLabels } from "@/constants";
import { BookingDetail } from "@/types";
import CancelBookingModal from "@/components/modal/booking/CancelBookingModal";
import BookingInfo from "@/components/info";

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
                                className={`text-2xl font-extrabold text-amber-900 mb-4`}
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
        toast.error("Anda bukan pemilik reservasi ini");
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
                                        className={`text-2xl font-extrabold text-white`}
                                    >
                                        Detail Reservasi
                                    </h1>
                                    <p className="text-amber-100 mt-1">
                                        ID:
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
                        <div className="p-6 space-y-3">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-6">
                                    <div>
                                        <h2
                                            className={`text-xl font-bold text-amber-900 mb-4`}
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
                                            className={`text-xl font-bold text-amber-900 mb-4`}
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
                            <BookingInfo booking={booking} />

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
                <CancelBookingModal
                    setShowCancelModal={setShowCancelModal}
                    booking={booking}
                    handleCancelBooking={handleCancelBooking}
                    isPending={cancelBookingMutation.isPending}
                />
            )}
        </Layout>
    );
};

export default BookingDetailPage;
