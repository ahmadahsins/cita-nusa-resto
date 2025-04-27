import { useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BookingStatus } from "@prisma/client";
import {
    ArrowLeft,
    Calendar,
    Check,
    Clock,
    FileText,
    Loader2,
    MapPin,
    UserCheck,
    Users,
    X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import { BookingDetail } from "@/types";
import { statusColors, statusLabels } from "@/constants";

const AdminBookingDetailPage: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const { isAuthenticated, isHydrated } = useAuth(
        "/auth/login?callbackUrl=" + encodeURIComponent(`/admin/bookings/${id}`)
    );

    const [isLoadingAction, setIsLoadingAction] = useState(false);

    // Fetch booking details
    const {
        data: booking,
        isLoading,
        refetch,
    } = useQuery<BookingDetail>({
        queryKey: ["adminBookingDetail", id],
        queryFn: async () => {
            const response = await axiosInstance.get(`/bookings/${id}`);
            return response.data;
        },
        enabled: !!id && isAuthenticated && isHydrated,
    });

    // Update booking status mutation
    const { mutate: updateStatus, isPending } = useMutation({
        mutationFn: async (newStatus: BookingStatus) => {
            const response = await axiosInstance.patch(`/bookings/${id}`, {
                status: newStatus,
            });
            return response.data;
        },
        onSuccess: (data) => {
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
            setIsLoadingAction(false);
        },
    });

    // Handle status change
    const handleStatusChange = (newStatus: BookingStatus) => {
        setIsLoadingAction(true);
        updateStatus(newStatus);
    };

    console.log(booking);

    if (isLoading || !isHydrated) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center min-h-screen bg-gray-50">
                    <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-amber-600" />
                        <p className="mt-2 text-amber-800">
                            Memuat data reservasi...
                        </p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <Head>
                <title>Detail Reservasi Admin - Cita Nusa Resto</title>
                <meta
                    name="description"
                    content="Detail reservasi admin di Cita Nusa Resto"
                />
            </Head>

            <div className="p-6 bg-white rounded-lg">
                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                    <h1 className="text-2xl font-extrabold text-amber-900 mb-4 md:mb-0">
                        Detail Reservasi
                    </h1>
                    <Link
                        href="/admin/bookings"
                        className="px-4 py-2 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 inline-flex items-center"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Kembali ke Daftar Reservasi
                    </Link>
                </div>

                {/* Status Badge */}
                <div className="mb-6 space-x-3">
                    <span
                        className={`px-3 py-1 rounded-full ${
                            statusColors[booking?.status || "PENDING"]
                        }`}
                    >
                        {statusLabels[booking?.status || "PENDING"]}
                    </span>
                    <div className="inline-block text-gray-500 text-sm">
                        ID: {booking?.id.substring(0, 8).toUpperCase()}
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column: Reservation Details */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-xl font-bold text-amber-900 mb-4 pb-2 border-b border-gray-200">
                            Informasi Reservasi
                        </h2>

                        <div className="space-y-4 mt-4">
                            <div className="flex items-start">
                                <Calendar className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
                                <div>
                                    <p className="text-gray-600 text-sm">
                                        Tanggal
                                    </p>
                                    <p className="text-gray-900 font-medium">
                                        {booking &&
                                            format(
                                                new Date(booking.dateTime),
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
                                        {booking &&
                                            format(
                                                new Date(booking.dateTime),
                                                "HH:mm",
                                                { locale: localeId }
                                            )}{" "}
                                        WIB
                                        <span className="text-gray-500 text-sm ml-2">
                                            (Durasi: {booking?.duration} menit)
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
                                        {booking?.guestCount} orang
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <MapPin className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
                                <div>
                                    <p className="text-gray-600 text-sm">
                                        Meja
                                    </p>
                                    <p className="text-gray-900 font-medium">
                                        <span className="px-2 py-1 bg-amber-50 text-amber-800 rounded-md text-sm">
                                            Meja #{booking?.table.tableNumber}
                                        </span>
                                        <span className="text-gray-500 text-sm ml-2">
                                            (Kapasitas:{" "}
                                            {booking?.table.capacity} orang)
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {booking?.specialRequest && (
                                <div className="flex items-start pt-2 mt-2 border-t border-gray-200">
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
                            )}
                        </div>
                    </div>

                    {/* Right Column: Customer Details */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-xl font-bold text-amber-900 mb-4 pb-2 border-b border-gray-200">
                            Informasi Pelanggan
                        </h2>

                        <div className="space-y-4 mt-4">
                            <div>
                                <p className="text-gray-600 text-sm">Nama</p>
                                <p className="text-gray-900 font-medium">
                                    {booking?.user.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-600 text-sm">Email</p>
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

                            {/* Booking History - A nice addition for admin */}
                            <div className="pt-4 mt-2 border-t border-gray-200">
                                <p className="text-gray-600 text-sm mb-2">
                                    Status Perubahan
                                </p>
                                <div className="bg-white p-2 rounded-md border border-gray-200">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">
                                            Dibuat:
                                        </span>{" "}
                                        {booking &&
                                            format(
                                                new Date(booking.createdAt),
                                                "dd MMM yyyy, HH:mm",
                                                { locale: localeId }
                                            )}
                                    </p>
                                    {booking?.updatedAt &&
                                        booking.updatedAt !==
                                            booking.createdAt && (
                                            <p className="text-sm text-gray-600 mt-1">
                                                <span className="font-medium">
                                                    Diperbarui:
                                                </span>{" "}
                                                {format(
                                                    new Date(booking.updatedAt),
                                                    "dd MMM yyyy, HH:mm",
                                                    { locale: localeId }
                                                )}
                                            </p>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-amber-900 mb-4">
                        Tindakan
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {booking?.status === "PENDING" && (
                            <button
                                onClick={() => handleStatusChange("CONFIRMED")}
                                disabled={isPending}
                                className="inline-flex items-center px-4 py-2 bg-green-50 text-green-800 border border-green-200 rounded hover:bg-green-100"
                            >
                                {isPending && isLoadingAction ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                    <Check className="h-4 w-4 mr-2" />
                                )}
                                Konfirmasi Reservasi
                            </button>
                        )}
                        {booking?.status === "CONFIRMED" && (
                            <button
                                onClick={() => handleStatusChange("COMPLETED")}
                                disabled={isPending}
                                className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-800 border border-blue-200 rounded hover:bg-blue-100"
                            >
                                {isPending && isLoadingAction ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                    <UserCheck className="h-4 w-4 mr-2" />
                                )}
                                Tandai Selesai
                            </button>
                        )}
                        {(booking?.status === "PENDING" ||
                            booking?.status === "CONFIRMED") && (
                            <button
                                onClick={() => handleStatusChange("CANCELLED")}
                                disabled={isPending}
                                className="inline-flex items-center px-4 py-2 bg-red-50 text-red-800 border border-red-200 rounded hover:bg-red-100"
                            >
                                {isPending && isLoadingAction ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                    <X className="h-4 w-4 mr-2" />
                                )}
                                Batalkan Reservasi
                            </button>
                        )}
                    </div>
                </div>

                {/* Notes from Admin */}
                <div className="mt-8 bg-amber-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-amber-900 mb-4">
                        Panduan untuk Staff
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                            <span className="text-amber-600 mr-2">•</span>
                            <span>
                                Pastikan meja telah disiapkan 10 menit sebelum
                                waktu reservasi.
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-amber-600 mr-2">•</span>
                            <span>
                                Hubungi pelanggan jika mereka terlambat lebih
                                dari 15 menit.
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-amber-600 mr-2">•</span>
                            <span>
                                Jika pelanggan memiliki permintaan khusus,
                                informasikan kepada chef dan tim dapur.
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-amber-600 mr-2">•</span>
                            <span>
                                Tandai reservasi sebagai {`'Selesai'`} hanya
                                setelah pelanggan meninggalkan restoran.
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminBookingDetailPage;
