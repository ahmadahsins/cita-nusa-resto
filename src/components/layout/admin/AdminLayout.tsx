import { ReactNode, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { LogOut, Menu as MenuIcon, X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { playfair } from "@/pages/_app";
import { dashboardNavItems } from "@/constants";

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (path: string) => {
        return router.pathname.startsWith(path);
    };

    const handleLogout = async () => {
        await logout();
        router.push("/auth/login");
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar - desktop */}
            <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 hidden md:block">
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-center h-16 px-6 border-b border-gray-200">
                        <Link
                            href="/admin/dashboard"
                            className="flex items-center"
                        >
                            <h1
                                className={`text-xl font-bold text-amber-900 ${playfair.className}`}
                            >
                                Cita Nusa Resto
                            </h1>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 px-4 py-6 overflow-y-auto">
                        <nav className="space-y-1">
                            {dashboardNavItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-md group ${
                                        isActive(item.href)
                                            ? "bg-amber-100 text-amber-900"
                                            : "text-gray-700 hover:bg-amber-50"
                                    }`}
                                >
                                    <span
                                        className={`mr-3 ${
                                            isActive(item.href)
                                                ? "text-amber-700"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {item.icon}
                                    </span>
                                    {item.title}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* User info */}
                    <div className="flex flex-col px-4 py-4 border-t border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="h-8 w-8 rounded-full bg-amber-600 flex items-center justify-center text-white font-medium">
                                    {user?.name?.charAt(0) || "A"}
                                </div>
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {user?.name || "Admin"}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {user?.email || "admin@example.com"}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="mt-4 flex items-center px-4 py-2 text-sm font-medium text-red-700 rounded-md hover:bg-red-50"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-white border-b border-gray-200">
                <Link href="/admin/dashboard" className="flex items-center">
                    <h1
                        className={`text-lg font-bold text-amber-900 ${playfair.className}`}
                    >
                        Cita Nusa Resto
                    </h1>
                </Link>
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                >
                    {mobileMenuOpen ? (
                        <X className="block h-6 w-6" />
                    ) : (
                        <MenuIcon className="block h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 flex z-40 md:hidden">
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-gray-600 bg-opacity-75"
                        onClick={() => setMobileMenuOpen(false)}
                    ></div>

                    {/* Menu content */}
                    <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                            <Link
                                href="/admin/dashboard"
                                className="flex items-center"
                            >
                                <h1
                                    className={`text-xl font-bold text-amber-900 ${playfair.className}`}
                                >
                                    Cita Nusa Resto
                                </h1>
                            </Link>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="ml-1 flex items-center justify-center h-10 w-10 rounded-md text-gray-500 hover:text-gray-900"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="flex-1 px-4 py-6 overflow-y-auto">
                            <nav className="space-y-1">
                                {dashboardNavItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-md group ${
                                            isActive(item.href)
                                                ? "bg-amber-100 text-amber-900"
                                                : "text-gray-700 hover:bg-amber-50"
                                        }`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <span
                                            className={`mr-3 ${
                                                isActive(item.href)
                                                    ? "text-amber-700"
                                                    : "text-gray-500"
                                            }`}
                                        >
                                            {item.icon}
                                        </span>
                                        {item.title}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {/* User info */}
                        <div className="flex flex-col px-4 py-4 border-t border-gray-200">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="h-8 w-8 rounded-full bg-amber-600 flex items-center justify-center text-white font-medium">
                                        {user?.name?.charAt(0) || "A"}
                                    </div>
                                </div>
                                <div className="ml-3 flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {user?.name || "Admin"}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {user?.email || "admin@example.com"}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="mt-4 flex items-center px-4 py-2 text-sm font-medium text-red-700 rounded-md hover:bg-red-50"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main content */}
            <div className="md:ml-64 min-h-screen pt-16 md:pt-0">
                <main className="p-4 md:p-6">{children}</main>
            </div>
        </div>
    );
};

export default AdminLayout;
