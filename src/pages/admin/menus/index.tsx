import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Menu, MenuCategory } from "@prisma/client";
import toast from "react-hot-toast";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import Modal from "@/components/modal/menu/AdminMenuMode;";
import axiosInstance from "@/lib/axios";
import { Loader2, Search } from "lucide-react";

// Schema for form validation
const menuSchema = z.object({
    name: z.string().min(1, "Nama menu harus diisi"),
    description: z.string().optional(),
    price: z.number().positive("Harga harus lebih dari 0"),
    image: z.string().optional(),
    isAvailable: z.boolean(),
    categoryId: z.string().min(1, "Kategori harus dipilih"),
});

type MenuFormData = z.infer<typeof menuSchema>;

interface MenuWithCategory extends Menu {
    category: MenuCategory;
}

const AdminMenusPage: NextPage = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentMenu, setCurrentMenu] = useState<MenuWithCategory | null>(
        null
    );
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Form setup
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<MenuFormData>({
        resolver: zodResolver(menuSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            image: "",
            isAvailable: true,
            categoryId: "",
        },
    });

    // Fetch menus
    const { data: menus, isLoading: menusLoading } = useQuery<
        MenuWithCategory[]
    >({
        queryKey: ["menus"],
        queryFn: async () => {
            const res = await axiosInstance.get("/menus");
            return res.data.data;
        },
    });

    // Fetch categories
    const { data: categories } = useQuery<MenuCategory[]>({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await axiosInstance.get("/menus/categories");
            return res.data.data;
        },
    });

    // Create menu mutation
    const createMenuMutation = useMutation({
        mutationFn: async (data: MenuFormData) => {
            const res = await axiosInstance.post("/menus", data);
            return res.data.data;
        },
        onSuccess: () => {
            toast.success("Menu berhasil ditambahkan");
            queryClient.invalidateQueries({ queryKey: ["menus"] });
            setIsModalOpen(false);
            reset();
        },
        onError: (error) => {
            toast.error(error.message || "Gagal menambahkan menu");
        },
    });

    // Update menu mutation
    const updateMenuMutation = useMutation({
        mutationFn: async (data: MenuFormData & { id: string }) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, ...menuData } = data;
            const res = await axiosInstance.patch(`/menus/${id}`, data);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Menu berhasil diperbarui");
            queryClient.invalidateQueries({ queryKey: ["menus"] });
            setIsModalOpen(false);
            setCurrentMenu(null);
            reset();
        },
        onError: (error) => {
            toast.error(error.message || "Gagal memperbarui menu");
        },
    });

    // Delete menu mutation
    const deleteMenuMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await axiosInstance.delete(`/menus/${id}`);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Menu berhasil dihapus");
            queryClient.invalidateQueries({ queryKey: ["menus"] });
            setIsDeleteModalOpen(false);
            setCurrentMenu(null);
        },
        onError: (error) => {
            toast.error(error.message || "Gagal menghapus menu");
        },
    });

    // Handle form submission
    const onSubmit = (data: MenuFormData) => {
        if (currentMenu) {
            updateMenuMutation.mutate({ ...data, id: currentMenu.id });
        } else {
            createMenuMutation.mutate(data);
        }
    };

    // Open modal to edit menu
    const handleEdit = (menu: MenuWithCategory) => {
        setCurrentMenu(menu);
        setValue("name", menu.name);
        setValue("description", menu.description || "");
        setValue("price", menu.price);
        setValue("image", menu.image || "");
        setValue("isAvailable", menu.isAvailable);
        setValue("categoryId", menu.categoryId);
        setIsModalOpen(true);
    };

    // Open modal to add new menu
    const handleAdd = () => {
        setCurrentMenu(null);
        reset();
        setIsModalOpen(true);
    };

    // Open confirmation modal for deletion
    const handleDeleteClick = (menu: MenuWithCategory) => {
        setCurrentMenu(menu);
        setIsDeleteModalOpen(true);
    };

    // Confirm deletion
    const confirmDelete = () => {
        if (currentMenu) {
            deleteMenuMutation.mutate(currentMenu.id);
        }
    };

    // Format price to IDR
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(price);
    };

    const filteredMenus = menus?.filter((menu) => {
        if (!searchTerm) return true;

        return menu.name
            .toLocaleLowerCase()
            .includes(searchTerm.toLocaleLowerCase());
    });

    return (
        <AdminLayout>
            <Head>
                <title>Manajemen Menu - Admin Cita Nusa Resto</title>
            </Head>

            <div className="p-6 space-y-3 bg-white">
                <h1 className="text-2xl font-bold text-amber-900">
                    Kelola Menu
                </h1>
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-2">
                    {/* Search Bar */}
                    <div className="w-full md:w-1/3">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Cari menu berdasarkan nama..."
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 pl-10"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        </div>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md w-full md:w-auto"
                    >
                        Tambah Menu
                    </button>
                </div>

                {/* Menu List */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        {menusLoading ? (
                            <div className="text-center py-10">
                                <Loader2 className="h-8 w-8 animate-spin mx-auto text-amber-600" />
                                <p className="mt-2 text-amber-800">
                                    Memuat data pesanan...
                                </p>
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-amber-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                                            Nama Menu
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                                            Kategori
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                                            Harga
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-amber-900 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredMenus?.map((menu) => (
                                        <tr
                                            key={menu.id}
                                            className="hover:bg-amber-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {menu.image && (
                                                        <div className="flex-shrink-0 h-10 w-10 mr-4">
                                                            <img
                                                                className="h-10 w-10 rounded-full object-cover"
                                                                src={`/images/menu/${menu.image}`}
                                                                alt={menu.name}
                                                            />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {menu.name}
                                                        </div>
                                                        {menu.description && (
                                                            <div className="text-sm text-gray-500 line-clamp-1">
                                                                {
                                                                    menu.description
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                                                    {menu.category.name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatPrice(menu.price)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        menu.isAvailable
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {menu.isAvailable
                                                        ? "Tersedia"
                                                        : "Tidak Tersedia"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() =>
                                                        handleEdit(menu)
                                                    }
                                                    className="text-amber-600 hover:text-amber-900 mr-4"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteClick(menu)
                                                    }
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {menus?.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-6 py-4 text-center text-gray-500"
                                            >
                                                Belum ada menu. Silakan
                                                tambahkan menu baru.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* Add/Edit Menu Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentMenu ? "Edit Menu" : "Tambah Menu Baru"}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Nama Menu
                        </label>
                        <input
                            type="text"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="Nama menu"
                            {...register("name")}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Deskripsi
                        </label>
                        <textarea
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            rows={3}
                            placeholder="Deskripsi menu (opsional)"
                            {...register("description")}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Harga (Rp)
                        </label>
                        <input
                            type="number"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="Harga menu"
                            {...register("price")}
                        />
                        {errors.price && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.price.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            URL Gambar
                        </label>
                        <input
                            type="text"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="URL gambar menu (opsional)"
                            {...register("image")}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Kategori
                        </label>
                        <select
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            {...register("categoryId")}
                        >
                            <option value="">Pilih Kategori</option>
                            {categories?.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.categoryId && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.categoryId.message}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isAvailable"
                            className="h-4 w-4 text-amber-600 border-gray-300 rounded"
                            {...register("isAvailable")}
                        />
                        <label
                            htmlFor="isAvailable"
                            className="ml-2 block text-sm text-gray-700"
                        >
                            Menu tersedia
                        </label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700"
                            disabled={
                                createMenuMutation.isPending ||
                                updateMenuMutation.isPending
                            }
                        >
                            {createMenuMutation.isPending ||
                            updateMenuMutation.isPending
                                ? "Menyimpan..."
                                : currentMenu
                                  ? "Perbarui"
                                  : "Simpan"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Konfirmasi Hapus"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                        Apakah Anda yakin ingin menghapus menu &quot;
                        {currentMenu?.name}
                        &quot;? Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Batal
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                            disabled={deleteMenuMutation.isPending}
                        >
                            {deleteMenuMutation.isPending
                                ? "Menghapus..."
                                : "Hapus"}
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
};

export default AdminMenusPage;
