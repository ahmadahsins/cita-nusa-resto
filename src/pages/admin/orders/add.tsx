import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
    ShoppingCart,
    PlusCircle,
    Trash2,
    ChevronLeft,
    Clock,
    User,
    CalendarClock,
    Loader2,
    Table2,
    Users,
} from "lucide-react";

import AdminLayout from "@/components/layout/admin/AdminLayout";
import axiosInstance from "@/lib/axios";
import { queryClient } from "@/lib/queryClient";
import { Booking, MenuItem } from "@/types";

const orderSchema = z.object({
    bookingId: z.string().min(1, "Pemesanan wajib dipilih"),
    items: z
        .array(
            z.object({
                menuId: z.string().min(1, "Menu wajib dipilih"),
                quantity: z.coerce.number().positive("Jumlah harus positif"),
                notes: z.string().optional(),
            })
        )
        .min(1, "Minimal harus ada 1 item pesanan"),
});

type OrderForm = z.infer<typeof orderSchema>;

export type Item = {
    menuId: string;
    quantity: number;
    notes?: string;
};

const AddOrderPage: NextPage = () => {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<OrderForm>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            bookingId: "",
            items: [{ menuId: "", quantity: 1, notes: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    const selectedBookingId = watch("bookingId");

    const { data: activeBookings, isLoading: isLoadingBookings } = useQuery({
        queryKey: ["active-bookings"],
        queryFn: async () => {
            const response = await axiosInstance.get(
                "/bookings?status=CONFIRMED"
            );
            return response.data.data;
        },
    });

    const { data: menuItems, isLoading: isLoadingMenu } = useQuery<MenuItem[]>({
        queryKey: ["menu-items"],
        queryFn: async () => {
            const response = await axiosInstance.get("/menus");
            return response.data.data;
        },
    });

    const { data: selectedBooking } = useQuery({
        queryKey: ["booking", selectedBookingId],
        queryFn: async () => {
            if (!selectedBookingId) return null;
            const response = await axiosInstance.get(
                `/bookings/${selectedBookingId}`
            );
            return response.data;
        },
        enabled: !!selectedBookingId,
    });

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: OrderForm) => {
            const response = await axiosInstance.post("/orders", data);
            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({
                queryKey: ["active-bookings"],
            });
            toast.success("Pesanan berhasil ditambahkan!");
            router.push("/admin/orders");
        },
        onError: () => {
            toast.error("Gagal menambahkan pesanan");
        },
    });

    const onSubmit = (data: OrderForm) => {
        mutate(data);
    };

    const addItem = () => {
        append({ menuId: "", quantity: 1, notes: "" });
    };

    const removeItem = (index: number) => {
        if (fields.length === 1) {
            toast.error("Minimal harus ada 1 item pesanan");
            return;
        }
        remove(index);
    };

    // Group menu items by category
    const groupedMenuItems = menuItems
        ? menuItems.reduce(
              (acc: Record<string, MenuItem[]>, item: MenuItem) => {
                  if (!acc[item.category.name]) acc[item.category.name] = [];
                  acc[item.category.name].push(item);
                  return acc;
              },
              {}
          )
        : {};

    // Calculate total price
    const calculateItemPrice = (menuId: string, quantity: number) => {
        if (!menuItems) return 0;
        const menu = menuItems.find((item) => item.id === menuId);
        return menu ? menu.price * quantity : 0;
    };

    const calculateTotalPrice = () => {
        if (!fields || !menuItems) return 0;

        return fields.reduce((total, field, index) => {
            const menuId = watch(`items.${index}.menuId`);
            const quantity = watch(`items.${index}.quantity`) || 0;
            return total + calculateItemPrice(menuId, quantity);
        }, 0);
    };

    const totalPrice = calculateTotalPrice();
    const isLoading = isLoadingBookings || isLoadingMenu;

    return (
        <AdminLayout>
            <Head>
                <title>Tambah Pesanan - Cita Nusa Resto</title>
                <meta
                    name="description"
                    content="Tambah pesanan baru untuk pelanggan di Cita Nusa Resto"
                />
            </Head>

            <div className="p-6 bg-white rounded-lg">
                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                    <h1 className="text-2xl font-extrabold text-amber-900 mb-4 md:mb-0">
                        Tambah Pesanan Baru
                    </h1>
                    <Link
                        href="/admin/orders"
                        className="px-4 py-2 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 inline-flex items-center"
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Kembali ke Daftar Pesanan
                    </Link>
                </div>

                {isLoading ? (
                    <div className="text-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-amber-600" />
                        <p className="mt-2 text-amber-800">Memuat data...</p>
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Booking Selection Card */}
                        <div className="bg-amber-50 p-5 rounded-lg border border-amber-200">
                            <h2 className="text-lg font-medium text-amber-800 mb-4 flex items-center">
                                <CalendarClock className="h-5 w-5 mr-2" />
                                Pilih Reservasi
                            </h2>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Reservasi
                                </label>
                                <select
                                    {...register("bookingId")}
                                    className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
                                >
                                    <option value="">
                                        -- Pilih Reservasi --
                                    </option>
                                    {activeBookings?.map((booking: Booking) => (
                                        <option
                                            key={booking.id}
                                            value={booking.id}
                                        >
                                            {booking.user.name} - Meja{" #"}
                                            {booking.table.tableNumber} -{" "}
                                            {new Date(
                                                booking.dateTime
                                            ).toLocaleString("id-ID")}
                                        </option>
                                    ))}
                                </select>
                                {errors.bookingId && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.bookingId.message}
                                    </p>
                                )}
                            </div>

                            {selectedBooking && (
                                <div className="bg-white p-4 rounded-md border border-amber-100 mt-4">
                                    <h3 className="font-medium text-amber-800 mb-2">
                                        Detail Reservasi:
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="flex items-center">
                                            <User className="h-4 w-4 text-amber-600 mr-2" />
                                            <span className="text-gray-700">
                                                {selectedBooking.user.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 text-amber-600 mr-2" />
                                            <span className="text-gray-700">
                                                {new Date(
                                                    selectedBooking.dateTime
                                                ).toLocaleString("id-ID")}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <Table2 className="h-4 w-4 text-amber-600 mr-2" />
                                            <span className="text-gray-700">
                                                {`Meja #${selectedBooking.table.tableNumber}`}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <Users className="h-4 w-4 text-amber-600 mr-2" />
                                            <span className="text-gray-700">
                                                {selectedBooking.guestCount}{" "}
                                                orang
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order Items Section */}
                        <div className="bg-white p-5 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-medium text-amber-800 flex items-center">
                                    <ShoppingCart className="h-5 w-5 mr-2" />
                                    Item Pesanan
                                </h2>
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="px-3 py-1.5 bg-amber-600 text-white rounded-md hover:bg-amber-700 flex items-center text-sm"
                                >
                                    <PlusCircle className="h-4 w-4 mr-1" />
                                    Tambah Item
                                </button>
                            </div>

                            {fields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="p-4 mb-4 border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-medium text-amber-700">
                                            Item #{index + 1}
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            className="text-red-500 hover:text-red-700 flex items-center text-sm"
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Hapus
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                        <div className="md:col-span-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Menu
                                            </label>
                                            <Controller
                                                name={`items.${index}.menuId`}
                                                control={control}
                                                render={({ field }) => (
                                                    <select
                                                        {...field}
                                                        className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
                                                    >
                                                        <option value="">
                                                            -- Pilih Menu --
                                                        </option>
                                                        {Object.keys(
                                                            groupedMenuItems
                                                        ).map((category) => (
                                                            <optgroup
                                                                key={category}
                                                                label={category}
                                                            >
                                                                {groupedMenuItems[
                                                                    category
                                                                ].map(
                                                                    (
                                                                        menu: MenuItem
                                                                    ) => (
                                                                        <option
                                                                            key={
                                                                                menu.id
                                                                            }
                                                                            value={
                                                                                menu.id
                                                                            }
                                                                        >
                                                                            {
                                                                                menu.name
                                                                            }{" "}
                                                                            - Rp{" "}
                                                                            {menu.price.toLocaleString(
                                                                                "id-ID"
                                                                            )}
                                                                        </option>
                                                                    )
                                                                )}
                                                            </optgroup>
                                                        ))}
                                                    </select>
                                                )}
                                            />
                                            {errors.items?.[index]?.menuId && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {
                                                        errors.items?.[index]
                                                            ?.menuId?.message
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Jumlah
                                            </label>
                                            <Controller
                                                name={`items.${index}.quantity`}
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                parseInt(
                                                                    e.target
                                                                        .value
                                                                )
                                                            )
                                                        }
                                                        className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
                                                    />
                                                )}
                                            />
                                            {errors.items?.[index]
                                                ?.quantity && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {
                                                        errors.items?.[index]
                                                            ?.quantity?.message
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="md:col-span-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Catatan
                                            </label>
                                            <input
                                                type="text"
                                                {...register(
                                                    `items.${index}.notes`
                                                )}
                                                placeholder="Tanpa bawang, pedas, dll."
                                                className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
                                            />
                                        </div>
                                    </div>

                                    {/* Item price calculation */}
                                    {watch(`items.${index}.menuId`) && (
                                        <div className="mt-3 text-right">
                                            <span className="text-sm text-gray-600">
                                                Subtotal:{" "}
                                                <span className="font-medium">
                                                    Rp{" "}
                                                    {calculateItemPrice(
                                                        watch(
                                                            `items.${index}.menuId`
                                                        ),
                                                        watch(
                                                            `items.${index}.quantity`
                                                        ) || 0
                                                    ).toLocaleString("id-ID")}
                                                </span>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Total Order Summary */}
                            <div className="mt-6 bg-amber-50 p-4 rounded-md border border-amber-100">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-amber-800">
                                        Total Pesanan
                                    </span>
                                    <span className="text-lg font-bold text-amber-900">
                                        Rp {totalPrice.toLocaleString("id-ID")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end mt-6">
                            <button
                                type="button"
                                onClick={() => router.push("/admin/orders")}
                                className="px-4 py-2 mr-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                            >
                                Batalkan
                            </button>
                            <button
                                type="submit"
                                disabled={isPending || isSubmitting}
                                className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:bg-gray-400 flex items-center"
                            >
                                {isPending && (
                                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                )}
                                {isPending ? "Memproses..." : "Tambah Pesanan"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </AdminLayout>
    );
};

export default AddOrderPage;
