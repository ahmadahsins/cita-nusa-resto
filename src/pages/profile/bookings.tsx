import { useState, useEffect } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "@/components/layout/Layout";
import { playfair } from "../_app";
import { useQuery } from "@tanstack/react-query";
import { format, isAfter } from "date-fns";
import { id as localeId } from "date-fns/locale";
// import { toast } from "react-hot-toast";
import { BookingStatus } from "@prisma/client";
import Link from "next/link";
import {
    Calendar,
    Clock,
    Users,
    BadgeCheck,
    Clock8,
    History,
    Loader2,
} from "lucide-react";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";

// Type for booking
interface Booking {
    id: string;
    dateTime: string;
    status: BookingStatus;
    guestCount: number;
    duration: number;
    specialRequest?: string;
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
}

// Status colors and labels for booking status
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

// Status icon mapping
const StatusIcon = ({ status }: { status: BookingStatus }) => {
    switch (status) {
        case "PENDING":
            return <Clock8 className="h-5 w-5 text-yellow-600" />;
        case "CONFIRMED":
            return <BadgeCheck className="h-5 w-5 text-green-600" />;
        case "CANCELLED":
            return <Clock className="h-5 w-5 text-red-600" />;
        case "COMPLETED":
            return <History className="h-5 w-5 text-blue-600" />;
        default:
            return null;
    }
};

// Filter for booking status
const statusFilters = [
    { value: "", label: "Semua" },
    { value: "PENDING", label: "Menunggu Konfirmasi" },
    { value: "CONFIRMED", label: "Dikonfirmasi" },
    { value: "CANCELLED", label: "Dibatalkan" },
    { value: "COMPLETED", label: "Selesai" },
];

const ProfileBookingsPage: NextPage = () => {
    const router = useRouter();
    const { isAuthenticated, isHydrated } = useAuth();
    const [statusFilter, setStatusFilter] = useState<string>("");

    // Fetch bookings
    const {
        data: bookings,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["bookings", statusFilter],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (statusFilter) params.append("status", statusFilter);

            const response = await axiosInstance.get(
                `/bookings?${params.toString()}`
            );

            if (!response.data.success) {
                throw new Error("Failed to fetch bookings");
            }

            return response.data.data as Booking[];
        },
        enabled: !!isAuthenticated && isHydrated,
    });

    // Navigate to login if not authenticated
    useEffect(() => {
        if (isHydrated && !isAuthenticated) {
            router.push(
                "/auth/login?callbackUrl=" +
                    encodeURIComponent("/profile/bookings")
            );
        }
    }, [isAuthenticated, isHydrated, router]);

    // Group bookings by date
    const groupedBookings = () => {
        if (!bookings) return {};

        const grouped: Record<string, Booking[]> = {};
        const now = new Date();

        // First add upcoming bookings (sorted by date)
        const upcoming = bookings
            .filter(
                (booking) =>
                    isAfter(new Date(booking.dateTime), now) &&
                    (booking.status === "PENDING" ||
                        booking.status === "CONFIRMED")
            )
            .sort(
                (a, b) =>
                    new Date(a.dateTime).getTime() -
                    new Date(b.dateTime).getTime()
            );

        if (upcoming.length > 0) {
            grouped["Mendatang"] = upcoming;
        }

        // Then add past bookings
        const past = bookings
            .filter(
                (booking) =>
                    !isAfter(new Date(booking.dateTime), now) ||
                    booking.status === "CANCELLED" ||
                    booking.status === "COMPLETED"
            )
            .sort(
                (a, b) =>
                    new Date(b.dateTime).getTime() -
                    new Date(a.dateTime).getTime()
            );

        if (past.length > 0) {
            grouped["Sebelumnya"] = past;
        }

        return grouped;
    };

    // Check if booking is upcoming
    const isUpcoming = (booking: Booking) => {
        return (
            isAfter(new Date(booking.dateTime), new Date()) &&
            (booking.status === "PENDING" || booking.status === "CONFIRMED")
        );
    };

    if (isLoading) {
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

    return (
        <Layout>
            <Head>
                <title>Reservasi Saya - Cita Nusa Resto</title>
                <meta
                    name="description"
                    content="Kelola reservasi meja di Cita Nusa Resto"
                />
            </Head>

            <section className="py-12 px-4 bg-amber-50 min-h-screen">
                <div className="container mx-auto max-w-4xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1
                            className={`text-3xl font-bold text-amber-900 mb-4 ${playfair.className}`}
                        >
                            Reservasi Saya
                        </h1>
                        <p className="text-gray-700 max-w-2xl mx-auto">
                            Lihat dan kelola semua reservasi yang telah Anda
                            buat di Cita Nusa Resto.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                        <div>
                            <Link
                                href="/booking/new"
                                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md font-medium inline-flex items-center"
                            >
                                <Calendar className="mr-2 h-5 w-5" />
                                Buat Reservasi Baru
                            </Link>
                        </div>

                        {/* Filter */}
                        <div className="flex items-center space-x-2">
                            <label
                                htmlFor="statusFilter"
                                className="text-sm font-medium text-gray-700"
                            >
                                Status:
                            </label>
                            <select
                                id="statusFilter"
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                            >
                                {statusFilters.map((filter) => (
                                    <option
                                        key={filter.value}
                                        value={filter.value}
                                    >
                                        {filter.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                            <p>
                                Gagal memuat data reservasi. Silakan coba lagi
                                nanti.
                            </p>
                        </div>
                    )}

                    {/* Empty State */}
                    {bookings && bookings.length === 0 && (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mx-auto mb-4">
                                <Calendar className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-semibold text-amber-900 mb-2">
                                Belum Ada Reservasi
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Anda belum memiliki reservasi. Buat reservasi
                                baru untuk menikmati hidangan di Cita Nusa
                                Resto.
                            </p>
                            <Link
                                href="/booking/new"
                                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md font-medium"
                            >
                                Buat Reservasi
                            </Link>
                        </div>
                    )}

                    {/* Bookings List */}
                    {bookings && bookings.length > 0 && (
                        <div className="space-y-8">
                            {Object.entries(groupedBookings()).map(
                                ([group, bookingsList]) => (
                                    <div key={group}>
                                        <h2 className="text-xl font-semibold text-amber-800 mb-4">
                                            {group}
                                        </h2>
                                        <div className="space-y-4">
                                            {bookingsList.map((booking) => (
                                                <div
                                                    key={booking.id}
                                                    className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
                                                >
                                                    <div className="flex flex-col md:flex-row">
                                                        {/* Date Column */}
                                                        <div className="bg-amber-50 p-4 md:p-6 flex flex-col items-center justify-center md:w-1/5">
                                                            <p className="text-amber-900 font-bold text-2xl">
                                                                {format(
                                                                    new Date(
                                                                        booking.dateTime
                                                                    ),
                                                                    "dd",
                                                                    {
                                                                        locale: localeId,
                                                                    }
                                                                )}
                                                            </p>
                                                            <p className="text-amber-800">
                                                                {format(
                                                                    new Date(
                                                                        booking.dateTime
                                                                    ),
                                                                    "MMM yyyy",
                                                                    {
                                                                        locale: localeId,
                                                                    }
                                                                )}
                                                            </p>
                                                            <p className="mt-2 font-medium text-amber-700">
                                                                {format(
                                                                    new Date(
                                                                        booking.dateTime
                                                                    ),
                                                                    "HH:mm",
                                                                    {
                                                                        locale: localeId,
                                                                    }
                                                                )}
                                                            </p>
                                                        </div>

                                                        {/* Details */}
                                                        <div className="p-4 md:p-6 flex-1">
                                                            <div className="flex flex-col sm:flex-row justify-between mb-4">
                                                                <div>
                                                                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                                                        Meja #
                                                                        {
                                                                            booking
                                                                                .table
                                                                                .tableNumber
                                                                        }
                                                                    </h3>
                                                                    <p className="text-gray-600 text-sm">
                                                                        ID:{" "}
                                                                        {booking.id
                                                                            .substring(
                                                                                0,
                                                                                8
                                                                            )
                                                                            .toUpperCase()}
                                                                    </p>
                                                                </div>
                                                                <div
                                                                    className={`mt-2 sm:mt-0 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                                        statusColors[
                                                                            booking
                                                                                .status
                                                                        ]
                                                                    }`}
                                                                >
                                                                    <StatusIcon
                                                                        status={
                                                                            booking.status
                                                                        }
                                                                    />
                                                                    <span className="ml-1">
                                                                        {
                                                                            statusLabels[
                                                                                booking
                                                                                    .status
                                                                            ]
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                                                                <div className="flex items-center">
                                                                    <Users className="h-4 w-4 text-amber-600 mr-2" />
                                                                    <span className="text-amber-600">
                                                                        {
                                                                            booking.guestCount
                                                                        }{" "}
                                                                        orang
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <Clock className="h-4 w-4 text-amber-600 mr-2" />
                                                                    <span className="text-amber-600">
                                                                        Durasi:{" "}
                                                                        {
                                                                            booking.duration
                                                                        }{" "}
                                                                        menit
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {booking.specialRequest && (
                                                                <div className="mt-2 text-sm text-gray-600">
                                                                    <p className="font-medium">
                                                                        Permintaan
                                                                        Khusus:
                                                                    </p>
                                                                    <p className="italic">
                                                                        {
                                                                            booking.specialRequest
                                                                        }
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {/* Actions */}
                                                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                                                                <Link
                                                                    href={`/booking/${booking.id}`}
                                                                    className="text-amber-600 hover:text-amber-800 font-medium text-sm"
                                                                >
                                                                    Lihat Detail
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}

                    {/* Additional Info */}
                    <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
                        <h3
                            className={`text-xl font-semibold text-amber-900 mb-4 ${playfair.className}`}
                        >
                            Informasi Reservasi
                        </h3>
                        <div className="space-y-4 text-gray-700">
                            <div className="flex items-start">
                                <span className="text-amber-600 mr-2">•</span>
                                <span>
                                    Pembatalan reservasi dapat dilakukan minimal
                                    3 jam sebelum waktu reservasi.
                                </span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-amber-600 mr-2">•</span>
                                <span>
                                    Mohon datang 10 menit sebelum waktu
                                    reservasi untuk memastikan meja Anda.
                                </span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-amber-600 mr-2">•</span>
                                <span>
                                    Meja akan ditahan selama 15 menit dari waktu
                                    reservasi. Setelah itu, meja dapat diberikan
                                    kepada tamu lain.
                                </span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-amber-600 mr-2">•</span>
                                <span>
                                    Untuk perubahan jumlah tamu atau waktu
                                    reservasi, silakan hubungi kami melalui
                                    telepon di (021) 123-4567.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default ProfileBookingsPage;
