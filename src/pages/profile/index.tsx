import { useEffect, useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "@/components/layout/Layout";
import ProfileForm from "@/components/form/ProfileForm";
import { useQuery } from "@tanstack/react-query";
import { User, Calendar, Loader2 } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";

const Profile: NextPage = () => {
    const router = useRouter();
    const { isAuthenticated, isHydrated } = useAuth();
    const [isTabShow, setIsTabShow] = useState(false);

    // Fetch user profile data
    const {
        data: user,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const response = await axiosInstance.get("/profile");
            return response.data.user;
        },
        enabled: !!isAuthenticated && isHydrated,
    });

    // Navigate to login if not authenticated
    useEffect(() => {
        if (isHydrated && !isAuthenticated) {
            router.push(
                "/auth/login?callbackUrl=" + encodeURIComponent("/profile")
            );
        }

        if (isHydrated && isAuthenticated && user?.role === "CUSTOMER") {
            setIsTabShow(true);
        }
    }, [isAuthenticated, isHydrated, router, user]);

    if (isLoading) {
        return (
            <Layout>
                <div className="flex justify-center items-center min-h-screen bg-amber-50">
                    <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-amber-600" />
                        <p className="mt-2 text-amber-800">
                            Memuat data profil...
                        </p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Head>
                <title>Profil - Cita Nusa Resto</title>
                <meta
                    name="description"
                    content="Kelola profil pengguna di Cita Nusa Resto"
                />
            </Head>

            <section className="py-12 px-4 bg-amber-50 min-h-screen">
                <div className="container mx-auto max-w-4xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-amber-900 mb-4">
                            Profil Anda
                        </h1>
                        <p className="text-gray-700 max-w-2xl mx-auto">
                            Kelola informasi pribadi dan lihat riwayat reservasi
                            Anda di Cita Nusa Resto.
                        </p>
                    </div>

                    {/* Profile Navigation Tabs */}
                    {isTabShow && (
                        <div className="flex flex-wrap justify-center mb-8 gap-4">
                            <Link
                                href="/profile"
                                className="bg-amber-600 text-white px-6 py-3 rounded-md font-medium inline-flex items-center"
                            >
                                <User className="mr-2 h-5 w-5" />
                                Profil
                            </Link>
                            <Link
                                href="/profile/bookings"
                                className="bg-white hover:bg-amber-100 text-amber-800 border border-amber-200 px-6 py-3 rounded-md font-medium inline-flex items-center transition-colors"
                            >
                                <Calendar className="mr-2 h-5 w-5" />
                                Reservasi Saya
                            </Link>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                            <p>
                                Gagal memuat data profil. Silakan coba lagi
                                nanti.
                            </p>
                        </div>
                    )}

                    {/* Profile Card */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-amber-100 p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-center">
                                <div className="flex items-center mb-4 sm:mb-0">
                                    <div className="w-16 h-16 bg-amber-600 text-white rounded-full flex items-center justify-center mr-4">
                                        <User className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-amber-900">
                                            {user?.name || "Pengguna"}
                                        </h2>
                                        <p className="text-amber-700">
                                            {user?.email || "email@example.com"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Form */}
                        <div className="p-6">
                            {user && <ProfileForm user={user} />}
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-bold text-amber-900 mb-4">
                            Kelola Pengalaman Kuliner Anda
                        </h3>
                        <div className="space-y-4 text-gray-700">
                            <div className="flex items-start">
                                <span className="text-amber-600 mr-2">•</span>
                                <span>
                                    Pastikan informasi kontak Anda selalu
                                    terbaru untuk menerima konfirmasi reservasi
                                    dan informasi promosi.
                                </span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-amber-600 mr-2">•</span>
                                <span>
                                    Kunjungi halaman{" "}
                                    <Link
                                        href="/profile/bookings"
                                        className="text-amber-600 hover:text-amber-800 font-medium"
                                    >
                                        Reservasi Saya
                                    </Link>{" "}
                                    untuk melihat dan mengelola reservasi Anda.
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Reservation CTA */}
                    <div className="mt-8 bg-amber-100 p-6 rounded-lg shadow-md">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <div className="mb-4 md:mb-0">
                                <h3 className="text-xl font-bold text-amber-900 mb-2">
                                    Buat Reservasi Baru
                                </h3>
                                <p className="text-amber-800">
                                    Ingin mengunjungi kami? Reservasi meja Anda
                                    sekarang!
                                </p>
                            </div>
                            <Link
                                href="/booking/new"
                                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md font-medium inline-flex items-center transition-colors"
                            >
                                <Calendar className="mr-2 h-5 w-5" />
                                Reservasi Sekarang
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Profile;
