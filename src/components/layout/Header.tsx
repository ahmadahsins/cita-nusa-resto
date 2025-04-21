import Link from "next/link";
import { useRouter } from "next/router";
import { useAuthStore } from "../../store/authStore";
import { User, LogOut } from "lucide-react";
import { playfair } from "@/pages/_app";

const Header: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    return (
        <header className="bg-amber-900 text-white">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <Link
                        href="/"
                        className={`text-2xl font-bold ${playfair.className}`}
                    >
                        Cita Nusa Resto
                    </Link>

                    <nav className="hidden md:flex space-x-8 text-sm">
                        <Link href="/" className="hover:text-amber-200">
                            Beranda
                        </Link>
                        <Link href="/menu" className="hover:text-amber-200">
                            Menu
                        </Link>
                        <Link href="/booking" className="hover:text-amber-200">
                            Reservasi
                        </Link>
                        <Link href="/about" className="hover:text-amber-200">
                            Tentang Kami
                        </Link>
                        <Link href="/contact" className="hover:text-amber-200">
                            Kontak
                        </Link>
                    </nav>

                    <div className="flex items-center space-x-4 text-sm">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/profile"
                                    className="hover:text-amber-200 inline-flex items-center gap-2"
                                >
                                    <User size={20} />
                                    {user?.name}
                                </Link>
                                {user?.role === "ADMIN" && (
                                    <Link
                                        href="/admin"
                                        className="hover:text-amber-200"
                                    >
                                        Admin
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="bg-white hover:bg-white/80 text-red-500 hover:text-red-600 px-4 py-2 rounded inline-flex items-center gap-2"
                                >
                                    <LogOut size={20} />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Link
                                    href="/auth/login"
                                    className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded"
                                >
                                    Login
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
