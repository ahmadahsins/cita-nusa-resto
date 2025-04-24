import { useState, useEffect } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "@/components/layout/Layout";
import { playfair } from "../_app";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { format, addMinutes, setHours, setMinutes } from "date-fns";
import { id } from "date-fns/locale";
import { Table } from "@prisma/client";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";

// Form schema validation
const bookingSchema = z.object({
    date: z.date({
        required_error: "Tanggal wajib diisi",
    }),
    time: z.date({
        required_error: "Waktu wajib diisi",
    }),
    guestCount: z
        .number({
            required_error: "Jumlah tamu wajib diisi",
        })
        .min(1, "Minimal 1 tamu")
        .max(20, "Maksimal 20 tamu"),
    tableId: z.string({
        required_error: "Pilih meja",
    }),
    specialRequest: z.string().optional(),
});

type BookingForm = z.infer<typeof bookingSchema>;

const NewBookingPage: NextPage = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<Date | null>(null);
    const [availableTables, setAvailableTables] = useState<Table[]>([]);
    const router = useRouter();
    const { isAuthenticated, isHydrated } = useAuth(
        "/auth/login?callbackUrl=" + encodeURIComponent("/booking/new")
    );

    // Create form
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm<BookingForm>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            guestCount: 2,
        },
    });

    const watchDate = watch("date");
    const watchTime = watch("time");
    const watchGuestCount = watch("guestCount");

    // Time options
    // const generateTimeOptions = () => {
    //     const times = [];
    //     let start = setHours(setMinutes(new Date(), 0), 11); // 11:00 AM
    //     const end = setHours(setMinutes(new Date(), 0), 21); // 9:00 PM

    //     while (start <= end) {
    //         times.push(new Date(start));
    //         start = addMinutes(start, 30);
    //     }
    //     return times;
    // };

    // const timeOptions = generateTimeOptions();
    // console.log(timeOptions);

    // Fetch available tables based on date, time, and guest count
    const fetchAvailableTables = async () => {
        if (!selectedDate || !selectedTime || !watchGuestCount) return;

        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        const formattedTime = format(selectedTime, "HH:mm");

        try {
            const response = await axiosInstance.get(
                `/tables/available?date=${formattedDate}&time=${formattedTime}&guestCount=${watchGuestCount}`
            );

            if (!response.data.success) {
                throw new Error("Failed to fetch available tables");
            }

            const data = response.data.data;
            setAvailableTables(data);

            // If there are available tables and none is selected yet, select the first one
            if (data.length > 0) {
                setValue("tableId", data[0].id);
            }
        } catch (error) {
            console.error("Error fetching available tables:", error);
            toast.error("Gagal mendapatkan data meja yang tersedia");
        }
    };

    useEffect(() => {
        if (selectedDate && selectedTime && watchGuestCount) {
            fetchAvailableTables();
        }
    }, [selectedDate, selectedTime, watchGuestCount]);

    // Handle form submission
    const createBookingMutation = useMutation({
        mutationFn: async (data: BookingForm) => {
            // Combine date and time
            const dateTime = new Date(data.date);
            const hours = data.time.getHours();
            const minutes = data.time.getMinutes();
            dateTime.setHours(hours, minutes, 0, 0);

            const bookingData = {
                tableId: data.tableId,
                dateTime: dateTime.toISOString(),
                guestCount: data.guestCount,
                specialRequest: data.specialRequest || "",
            };

            const response = await axiosInstance.post("/bookings", bookingData);

            if (!response.data.success) {
                throw new Error("Failed to create booking");
            }

            return response.data.data;
        },
        onSuccess: () => {
            toast.success("Reservasi berhasil dibuat!");
            router.push("/booking/success?fromBooking=true");
        },
        onError: (error) => {
            toast.error(error.message || "Gagal membuat reservasi");
        },
    });

    const onSubmit = (data: BookingForm) => {
        createBookingMutation.mutate(data);
    };

    // Handle authentication check
    useEffect(() => {
        if (isHydrated && !isAuthenticated) {
            toast.error(
                "Anda harus login terlebih dahulu untuk melakukan reservasi"
            );
        }
    }, [isAuthenticated]);

    return (
        <Layout>
            <Head>
                <title>Buat Reservasi - Cita Nusa Resto</title>
                <meta
                    name="description"
                    content="Form pembuatan reservasi di Cita Nusa Resto"
                />
            </Head>

            {/* Booking Form Section */}
            <section className="py-12 px-4 bg-amber-50">
                <div className="container mx-auto max-w-3xl">
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2
                            className={`text-2xl font-extrabold text-amber-900 mb-6 text-center`}
                        >
                            Form Reservasi
                        </h2>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            {/* Date Picker */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="date"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Tanggal
                                </label>
                                <Controller
                                    control={control}
                                    name="date"
                                    render={({ field }) => (
                                        <DatePicker
                                            selected={field.value}
                                            onChange={(date) => {
                                                field.onChange(date);
                                                setSelectedDate(date);
                                                setAvailableTables([]);
                                                setValue("tableId", "");
                                            }}
                                            dateFormat="dd MMMM yyyy"
                                            minDate={new Date()}
                                            locale={id}
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-black"
                                            placeholderText="Pilih tanggal"
                                        />
                                    )}
                                />
                                {errors.date && (
                                    <p className="text-red-500 text-sm">
                                        {errors.date.message}
                                    </p>
                                )}
                            </div>

                            {/* Time Picker */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="time"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Waktu
                                </label>
                                <Controller
                                    control={control}
                                    name="time"
                                    render={({ field }) => (
                                        <DatePicker
                                            selected={field.value}
                                            onChange={(time) => {
                                                field.onChange(time);
                                                setSelectedTime(time);
                                                setAvailableTables([]);
                                                setValue("tableId", "");
                                            }}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={30}
                                            timeCaption="Waktu"
                                            dateFormat="HH:mm"
                                            // includeTimes={timeOptions}
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-black"
                                            placeholderText="Pilih waktu"
                                        />
                                    )}
                                />
                                {errors.time && (
                                    <p className="text-red-500 text-sm">
                                        {errors.time.message}
                                    </p>
                                )}
                            </div>

                            {/* Guest Count */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="guestCount"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Jumlah Tamu
                                </label>
                                <select
                                    {...register("guestCount", {
                                        valueAsNumber: true,
                                    })}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-black"
                                >
                                    {[...Array(20)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {i + 1} {i === 0 ? "tamu" : "tamu"}
                                        </option>
                                    ))}
                                </select>
                                {errors.guestCount && (
                                    <p className="text-red-500 text-sm">
                                        {errors.guestCount.message}
                                    </p>
                                )}
                            </div>

                            {/* Table Selection */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="tableId"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Pilih Meja
                                </label>
                                {watchDate && watchTime && watchGuestCount ? (
                                    availableTables.length > 0 ? (
                                        <select
                                            {...register("tableId")}
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-black"
                                        >
                                            {availableTables.map((table) => (
                                                <option
                                                    key={table.id}
                                                    value={table.id}
                                                >
                                                    Meja #{table.tableNumber}{" "}
                                                    (Kapasitas: {table.capacity}{" "}
                                                    orang)
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div className="p-3 bg-red-50 text-red-700 rounded-md">
                                            Tidak ada meja yang tersedia untuk
                                            waktu yang dipilih dan jumlah tamu.
                                            Silakan pilih waktu lain atau ubah
                                            jumlah tamu.
                                        </div>
                                    )
                                ) : (
                                    <div className="p-3 bg-amber-50 text-amber-700 rounded-md">
                                        Silakan pilih tanggal, waktu, dan jumlah
                                        tamu terlebih dahulu.
                                    </div>
                                )}
                                {errors.tableId && (
                                    <p className="text-red-500 text-sm">
                                        {errors.tableId.message}
                                    </p>
                                )}
                            </div>

                            {/* Special Request */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="specialRequest"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Permintaan Khusus (opsional)
                                </label>
                                <textarea
                                    {...register("specialRequest")}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 h-32"
                                    placeholder="Jika Anda memiliki permintaan khusus, silakan tuliskan di sini..."
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={
                                        createBookingMutation.isPending ||
                                        availableTables.length === 0
                                    }
                                    className={`w-full p-4 rounded-md text-white font-medium text-lg
                    ${
                        createBookingMutation.isPending ||
                        availableTables.length === 0
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-amber-600 hover:bg-amber-700"
                    }`}
                                >
                                    {createBookingMutation.isPending ? (
                                        <div className="flex items-center justify-center">
                                            <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                            <span>Memproses...</span>
                                        </div>
                                    ) : (
                                        "Buat Reservasi"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default NewBookingPage;
