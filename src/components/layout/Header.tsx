import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { User, LogOut, Menu, X } from "lucide-react";
import { playfair } from "@/pages/_app";
import toast from "react-hot-toast";

const Header: React.FC = () => {
    const { isAuthenticated, user, logout, checkAuth } = useAuthStore();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Cek autentikasi setiap kali komponen di-render
    useEffect(() => {
        // Validasi token saat komponen dimuat
        const isValid = checkAuth();
        if (!isValid && isAuthenticated) {
            toast.error("Sesi anda telah berakhir. Silakan login kembali.");
            logout();

            // Redirect ke halaman login jika di halaman yang memerlukan autentikasi
            const authRequiredPaths = ["/profile", "/admin", "/booking/new"];
            const requiresAuth = authRequiredPaths.some((path) =>
                router.pathname.startsWith(path)
            );
            if (requiresAuth) {
                router.push("/auth/login");
            }
        }
    }, [router.pathname]);

    const handleLogout = () => {
        logout();
        router.push("/");
        toast.success("Logout sukses");
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <header className="bg-amber-900 text-white sticky top-0 z-50 shadow-md">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <Link
                        href="/"
                        className={`text-2xl font-bold ${playfair.className}`}
                    >
                        Cita Nusa Resto
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8 text-sm">
                        <Link
                            href="/"
                            className={`hover:text-amber-200 transition-colors duration-200 ${
                                router.pathname === "/"
                                    ? "text-amber-200 font-medium"
                                    : ""
                            }`}
                        >
                            Beranda
                        </Link>
                        <Link
                            href="/menu"
                            className={`hover:text-amber-200 transition-colors duration-200 ${
                                router.pathname === "/menu"
                                    ? "text-amber-200 font-medium"
                                    : ""
                            }`}
                        >
                            Menu
                        </Link>
                        <Link
                            href="/booking"
                            className={`hover:text-amber-200 transition-colors duration-200 ${
                                router.pathname === "/booking" ||
                                router.pathname.startsWith("/booking/")
                                    ? "text-amber-200 font-medium"
                                    : ""
                            }`}
                        >
                            Reservasi
                        </Link>
                        <Link
                            href="/about"
                            className={`hover:text-amber-200 transition-colors duration-200 ${
                                router.pathname === "/about"
                                    ? "text-amber-200 font-medium"
                                    : ""
                            }`}
                        >
                            Tentang Kami
                        </Link>
                        <Link
                            href="/contact"
                            className={`hover:text-amber-200 transition-colors duration-200 ${
                                router.pathname === "/contact"
                                    ? "text-amber-200 font-medium"
                                    : ""
                            }`}
                        >
                            Kontak
                        </Link>
                    </nav>

                    {/* Desktop Auth Menu */}
                    <div className="hidden md:flex items-center space-x-4 text-sm">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/profile"
                                    className="hover:text-amber-200 transition-colors duration-200 inline-flex items-center gap-1"
                                >
                                    <User size={16} />
                                    {user?.name}
                                </Link>
                                {user?.role === "ADMIN" && (
                                    <Link
                                        href="/admin/dashboard"
                                        className="hover:text-amber-200 transition-colors duration-200"
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="bg-white hover:bg-gray-100 text-amber-900 py-2 px-2.5 rounded-md inline-flex items-center gap-2 transition-colors duration-200"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Link
                                    href="/auth/login"
                                    className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded transition-colors duration-200"
                                >
                                    Login
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden focus:outline-none"
                        onClick={toggleMobileMenu}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <X size={24} className="text-white" />
                        ) : (
                            <Menu size={24} className="text-white" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden pt-4 pb-2 border-t border-amber-800 mt-4 animate-fadeIn">
                        <nav className="flex flex-col space-y-3 mb-6">
                            <Link
                                href="/"
                                onClick={closeMobileMenu}
                                className={`hover:text-amber-200 transition-colors duration-200 py-2 ${
                                    router.pathname === "/"
                                        ? "text-amber-200 font-medium"
                                        : ""
                                }`}
                            >
                                Beranda
                            </Link>
                            <Link
                                href="/menu"
                                onClick={closeMobileMenu}
                                className={`hover:text-amber-200 transition-colors duration-200 py-2 ${
                                    router.pathname === "/menu"
                                        ? "text-amber-200 font-medium"
                                        : ""
                                }`}
                            >
                                Menu
                            </Link>
                            <Link
                                href="/booking"
                                onClick={closeMobileMenu}
                                className={`hover:text-amber-200 transition-colors duration-200 py-2 ${
                                    router.pathname === "/booking" ||
                                    router.pathname.startsWith("/booking/")
                                        ? "text-amber-200 font-medium"
                                        : ""
                                }`}
                            >
                                Reservasi
                            </Link>
                            <Link
                                href="/about"
                                onClick={closeMobileMenu}
                                className={`hover:text-amber-200 transition-colors duration-200 py-2 ${
                                    router.pathname === "/about"
                                        ? "text-amber-200 font-medium"
                                        : ""
                                }`}
                            >
                                Tentang Kami
                            </Link>
                            <Link
                                href="/contact"
                                onClick={closeMobileMenu}
                                className={`hover:text-amber-200 transition-colors duration-200 py-2 ${
                                    router.pathname === "/contact"
                                        ? "text-amber-200 font-medium"
                                        : ""
                                }`}
                            >
                                Kontak
                            </Link>
                        </nav>

                        {isAuthenticated ? (
                            <div className="flex flex-col space-y-3 pt-3 border-t border-amber-800">
                                <Link
                                    href="/profile"
                                    onClick={closeMobileMenu}
                                    className="hover:text-amber-200 transition-colors duration-200 inline-flex items-center gap-2 py-2"
                                >
                                    <User size={20} />
                                    {user?.name}
                                </Link>
                                {user?.role === "ADMIN" && (
                                    <Link
                                        href="/admin/dashboard"
                                        onClick={closeMobileMenu}
                                        className="hover:text-amber-200 transition-colors duration-200 py-2"
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        closeMobileMenu();
                                    }}
                                    className="bg-white hover:bg-gray-100 text-amber-900 py-2 px-2.5 rounded-md inline-flex items-center gap-2 transition-colors duration-200"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="pt-3 border-t border-amber-800">
                                <Link
                                    href="/auth/login"
                                    onClick={closeMobileMenu}
                                    className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded transition-colors duration-200 inline-block"
                                >
                                    Login
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
