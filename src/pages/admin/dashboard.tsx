import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
    BarChart3,
    BookOpen,
    ChevronRight,
    Users,
    CalendarClock,
    ShoppingCart,
    Table2,
    Loader2,
    Home,
} from "lucide-react";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import { DashboardStats } from "@/types";
import StatCard from "@/components/card/admin/StatCard";
import ChartCard from "@/components/card/admin/ChartCard";
import RecentBooking from "@/components/card/admin/RecentBooking";
import RecentOrder from "@/components/card/admin/RecentOrder";

const AdminDashboardPage: NextPage = () => {
    const { isAuthenticated } = useAuth(
        "/auth/login?callbackUrl=" + encodeURIComponent("/admin/dashboard")
    );

    // Fetch dashboard stats
    const { data: dashboardStats, isLoading } = useQuery<DashboardStats>({
        queryKey: ["dashboardStats"],
        queryFn: async () => {
            const response = await axiosInstance.get("/admin/dashboard-stats");
            return response.data.data;
        },
        enabled: isAuthenticated,
        placeholderData: {
            totalUsers: 0,
            totalBookings: 0,
            totalOrders: 0,
            totalMenuItems: 0,
            totalTables: 0,
            recentBookings: [],
            recentOrders: [],
        },
    });

    return (
        <AdminLayout>
            <Head>
                <title>Dashboard Admin - Cita Nusa Resto</title>
                <meta
                    name="description"
                    content="Dashboard admin untuk mengelola Cita Nusa Resto"
                />
            </Head>

            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="">
                    <h1
                        className={`text-2xl font-extrabold text-amber-900 mb-2`}
                    >
                        Dashboard Admin
                    </h1>
                    <p className="text-gray-600">
                        Selamat datang di panel admin Cita Nusa Resto
                    </p>
                </div>
                <Link
                    href="/"
                    className="px-4 py-2 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 inline-flex items-center"
                >
                    <Home className="h-4 w-4 mr-2" />
                    Kembali ke Beranda
                </Link>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
                </div>
            ) : (
                <>
                    {/* Stat cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
                        <StatCard
                            title="Total Pengguna"
                            value={dashboardStats?.totalUsers || 0}
                            icon={<Users className="h-5 w-5 text-purple-600" />}
                            iconBg="bg-purple-100"
                            link="/admin/users"
                        />
                        <StatCard
                            title="Total Reservasi"
                            value={dashboardStats?.totalBookings || 0}
                            icon={
                                <CalendarClock className="h-5 w-5 text-amber-600" />
                            }
                            iconBg="bg-amber-100"
                            link="/admin/bookings"
                        />
                        <StatCard
                            title="Total Pesanan"
                            value={dashboardStats?.totalOrders || 0}
                            icon={
                                <ShoppingCart className="h-5 w-5 text-green-600" />
                            }
                            iconBg="bg-green-100"
                            link="/admin/orders"
                        />
                        <StatCard
                            title="Total Menu"
                            value={dashboardStats?.totalMenuItems || 0}
                            icon={
                                <BookOpen className="h-5 w-5 text-blue-600" />
                            }
                            iconBg="bg-blue-100"
                            link="/admin/menu"
                        />
                        <StatCard
                            title="Total Meja"
                            value={dashboardStats?.totalTables || 0}
                            icon={<Table2 className="h-5 w-5 text-red-600" />}
                            iconBg="bg-red-100"
                            link="/admin/tables"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Chart - Bookings per day */}
                        <ChartCard title="Reservasi per Hari">
                            <div className="flex items-center justify-center h-64 bg-gray-50 rounded">
                                <div className="text-center">
                                    <BarChart3 className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-500">
                                        Grafik reservasi akan ditampilkan di
                                        sini
                                    </p>
                                </div>
                            </div>
                        </ChartCard>

                        {/* Chart - Orders per day */}
                        <ChartCard title="Pesanan per Hari">
                            <div className="flex items-center justify-center h-64 bg-gray-50 rounded">
                                <div className="text-center">
                                    <BarChart3 className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-500">
                                        Grafik pesanan akan ditampilkan di sini
                                    </p>
                                </div>
                            </div>
                        </ChartCard>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent bookings */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-medium text-gray-900">
                                    Reservasi Terbaru
                                </h2>
                                <Link
                                    href="/admin/bookings"
                                    className="text-sm font-medium text-amber-600 hover:text-amber-800 flex items-center"
                                >
                                    <span>Lihat semua</span>
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </Link>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {dashboardStats?.recentBookings &&
                                dashboardStats.recentBookings.length > 0 ? (
                                    dashboardStats.recentBookings.map(
                                        (booking) => (
                                            <RecentBooking
                                                key={booking.id}
                                                name={booking.user.name}
                                                date={format(
                                                    new Date(booking.dateTime),
                                                    "dd MMM yyyy",
                                                    {
                                                        locale: localeId,
                                                    }
                                                )}
                                                time={format(
                                                    new Date(booking.dateTime),
                                                    "HH:mm",
                                                    {
                                                        locale: localeId,
                                                    }
                                                )}
                                                guests={booking.guestCount}
                                                status={booking.status}
                                            />
                                        )
                                    )
                                ) : (
                                    <div className="py-4 text-center text-gray-500">
                                        Belum ada reservasi
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent orders */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-medium text-gray-900">
                                    Pesanan Terbaru
                                </h2>
                                <Link
                                    href="/admin/orders"
                                    className="text-sm font-medium text-amber-600 hover:text-amber-800 flex items-center"
                                >
                                    <span>Lihat semua</span>
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </Link>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {dashboardStats?.recentOrders &&
                                dashboardStats.recentOrders.length > 0 ? (
                                    dashboardStats.recentOrders.map((order) => (
                                        <RecentOrder
                                            key={order.id}
                                            orderNumber={order.id
                                                .substring(0, 8)
                                                .toUpperCase()}
                                            date={format(
                                                new Date(order.dateTime),
                                                "dd MMM yyyy",
                                                {
                                                    locale: localeId,
                                                }
                                            )}
                                            time={format(
                                                new Date(order.dateTime),
                                                "HH:mm",
                                                {
                                                    locale: localeId,
                                                }
                                            )}
                                            items={order.itemCount}
                                            total={`Rp ${order.totalPrice.toLocaleString(
                                                "id-ID"
                                            )}`}
                                            status={order.status}
                                        />
                                    ))
                                ) : (
                                    <div className="py-4 text-center text-gray-500">
                                        Belum ada pesanan
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </AdminLayout>
    );
};

export default AdminDashboardPage;
