import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
    Clock,
    Filter,
    Loader2,
    Search,
    User,
    UserCog,
    Shield,
    UserCheck,
} from "lucide-react";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/components/layout/admin/AdminLayout";

type User = {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "STAFF" | "CUSTOMER";
    createdAt: string;
};

const roleLabels: Record<string, { label: string; color: string; icon: any }> =
    {
        ADMIN: {
            label: "Admin",
            color: "bg-purple-100 text-purple-800",
            icon: Shield,
        },
        STAFF: {
            label: "Staff",
            color: "bg-blue-100 text-blue-800",
            icon: UserCog,
        },
        CUSTOMER: {
            label: "Pelanggan",
            color: "bg-green-100 text-green-800",
            icon: User,
        },
    };

const UserManagementPage: NextPage = () => {
    const { isAuthenticated, isHydrated } = useAuth(
        "/auth/login?callbackUrl=" + encodeURIComponent("/admin/users")
    );

    const [filterRole, setFilterRole] = useState<
        "ADMIN" | "STAFF" | "CUSTOMER" | "ALL"
    >("ALL");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [newRole, setNewRole] = useState<"ADMIN" | "STAFF" | "CUSTOMER">(
        "CUSTOMER"
    );

    const itemsPerPage = 10;
    const queryClient = useQueryClient();

    // Fetch users
    const {
        data: users,
        isLoading,
        // refetch,
    } = useQuery<User[]>({
        queryKey: ["adminUsers"],
        queryFn: async () => {
            try {
                const response = await axiosInstance.get("/admin/users");
                if (!response.data.success) {
                    throw new Error("Failed to fetch users");
                }
                return response.data.data;
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("Gagal mengambil data pengguna");
                return [];
            }
        },
        enabled: isAuthenticated && isHydrated,
    });

    const { mutate: updateUserRole, isPending } = useMutation({
        mutationFn: async (data: { userId: string; role: string }) => {
            const response = await axiosInstance.patch(
                `/admin/users/${data.userId}`,
                {
                    role: data.role,
                }
            );
            return response.data;
        },
        onSuccess: () => {
            toast.success("Role pengguna berhasil diperbarui");
            setEditingUser(null);
            queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
        },
        onError: () => {
            toast.error("Gagal memperbarui role pengguna");
        },
    });

    // Handle role change
    const handleRoleChange = () => {
        if (editingUser) {
            updateUserRole({ userId: editingUser.id, role: newRole });
        }
    };

    // Filter users based on search term and role
    const filteredUsers =
        users?.filter((user) => {
            const matchesSearch =
                !searchTerm ||
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesRole =
                filterRole === "ALL" || user.role === filterRole;

            return matchesSearch && matchesRole;
        }) || [];

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filterRole, searchTerm]);

    // Start editing user
    const handleStartEdit = (user: User) => {
        setEditingUser(user);
        setNewRole(user.role);
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditingUser(null);
    };

    return (
        <AdminLayout>
            <Head>
                <title>Kelola Pengguna - Cita Nusa Resto</title>
                <meta
                    name="description"
                    content="Dasbor admin untuk mengelola pengguna di Cita Nusa Resto"
                />
            </Head>

            <div className="p-6 bg-white rounded-lg">
                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                    <h1
                        className={`text-2xl font-extrabold text-amber-900 mb-4 md:mb-0`}
                    >
                        Kelola Pengguna
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
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Role Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Filter Role
                        </label>
                        <div className="relative">
                            <select
                                value={filterRole}
                                onChange={(e) =>
                                    setFilterRole(
                                        e.target.value as
                                            | "ADMIN"
                                            | "STAFF"
                                            | "CUSTOMER"
                                            | "ALL"
                                    )
                                }
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 pl-10 text-black"
                            >
                                <option value="ALL">Semua Role</option>
                                <option value="ADMIN">Admin</option>
                                <option value="STAFF">Staff</option>
                                <option value="CUSTOMER">Pelanggan</option>
                            </select>
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        </div>
                    </div>

                    {/* Search Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cari Pengguna
                        </label>
                        <div className="relative text-black">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Cari nama, email..."
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 pl-10"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        </div>
                    </div>
                </div>

                {/* User List */}
                {isLoading ? (
                    <div className="text-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-amber-600" />
                        <p className="mt-2 text-amber-800">
                            Memuat data pengguna...
                        </p>
                    </div>
                ) : paginatedUsers.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border-collapse">
                            <thead>
                                <tr className="bg-amber-50">
                                    <th className="py-3 px-4 text-left text-xs font-medium text-amber-800 uppercase tracking-wider border-b">
                                        ID
                                    </th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-amber-800 uppercase tracking-wider border-b">
                                        Nama
                                    </th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-amber-800 uppercase tracking-wider border-b">
                                        Email
                                    </th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-amber-800 uppercase tracking-wider border-b">
                                        Role
                                    </th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-amber-800 uppercase tracking-wider border-b">
                                        Tanggal Bergabung
                                    </th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-amber-800 uppercase tracking-wider border-b">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {paginatedUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <UserCheck className="h-4 w-4 text-amber-600 mr-2" />
                                                <span className="font-medium text-amber-900">
                                                    {user.id
                                                        .substring(0, 8)
                                                        .toUpperCase()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <span className="font-medium text-gray-900">
                                                {user.name}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <span className="text-gray-500">
                                                {user.email}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {roleLabels[user.role] && (
                                                    <>
                                                        <span
                                                            className={`px-2 py-1 rounded-md text-sm flex items-center ${
                                                                roleLabels[
                                                                    user.role
                                                                ].color
                                                            }`}
                                                        >
                                                            {React.createElement(
                                                                roleLabels[
                                                                    user.role
                                                                ].icon,
                                                                {
                                                                    className:
                                                                        "h-3 w-3 mr-1",
                                                                }
                                                            )}
                                                            {
                                                                roleLabels[
                                                                    user.role
                                                                ].label
                                                            }
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-600">
                                                {new Date(
                                                    user.createdAt
                                                ).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            {editingUser?.id === user.id ? (
                                                <div className="flex items-center space-x-2">
                                                    <select
                                                        value={newRole}
                                                        onChange={(e) =>
                                                            setNewRole(
                                                                e.target
                                                                    .value as
                                                                    | "ADMIN"
                                                                    | "STAFF"
                                                                    | "CUSTOMER"
                                                            )
                                                        }
                                                        className="p-1 border border-gray-300 rounded text-sm"
                                                    >
                                                        <option value="ADMIN">
                                                            Admin
                                                        </option>
                                                        <option value="STAFF">
                                                            Staff
                                                        </option>
                                                        <option value="CUSTOMER">
                                                            Pelanggan
                                                        </option>
                                                    </select>
                                                    <button
                                                        onClick={
                                                            handleRoleChange
                                                        }
                                                        disabled={isPending}
                                                        className={`inline-flex items-center px-2 py-1 bg-green-50 text-green-800 rounded hover:bg-green-100 text-sm ${
                                                            isPending
                                                                ? "opacity-50 cursor-not-allowed"
                                                                : ""
                                                        }`}
                                                    >
                                                        {isPending ? (
                                                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                                        ) : (
                                                            <UserCheck className="h-3 w-3 mr-1" />
                                                        )}
                                                        Simpan
                                                    </button>
                                                    <button
                                                        onClick={
                                                            handleCancelEdit
                                                        }
                                                        className="inline-flex items-center px-2 py-1 bg-gray-50 text-gray-800 rounded hover:bg-gray-100 text-sm"
                                                    >
                                                        Batal
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        handleStartEdit(user)
                                                    }
                                                    className="inline-flex items-center px-2.5 py-1.5 bg-amber-50 text-amber-800 rounded hover:bg-amber-100 text-sm"
                                                >
                                                    <UserCog className="h-4 w-4 mr-1" />
                                                    Ubah Role
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
                            {users && users.length > 0
                                ? "Tidak ada pengguna yang cocok dengan filter"
                                : "Tidak ada pengguna yang tersedia"}
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
                                filteredUsers.length
                            )}{" "}
                            dari {filteredUsers.length} pengguna
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

export default UserManagementPage;
