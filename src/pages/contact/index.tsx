import { NextPage } from "next";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Layout from "@/components/layout/Layout";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { playfair } from "../_app";
import axiosInstance from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const contactSchema = z.object({
    name: z.string().min(2, "Nama harus minimal 2 karakter"),
    email: z.string().email("Format email tidak valid"),
    subject: z.string().min(3, "Subjek harus minimal 3 karakter"),
    message: z.string().min(10, "Pesan harus minimal 10 karakter"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const ContactPage: NextPage = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (data: ContactFormValues) => {
            return axiosInstance.post("/contact", data);
        },
        onSuccess() {
            reset();
            toast.success("Pesan berhasil dikirim!");
        },
        onError() {
            toast.error("Terjadi kesalahan saat mengirim pesan");
        },
    });

    const onSubmit = async (data: ContactFormValues) => {
        mutate(data);
    };

    return (
        <Layout>
            <Head>
                <title>Kontak Kami - Cita Nusa Resto</title>
                <meta
                    name="description"
                    content="Hubungi Cita Nusa Resto untuk reservasi, feedback, atau pertanyaan lainnya"
                />
            </Head>

            {/* Hero Section */}
            <section className="relative h-[40vh]">
                <div className="absolute inset-0 bg-black/50 z-10" />
                <div className="relative h-full">
                    <div className="bg-amber-900 h-full" />
                </div>
                <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-4">
                    <div className="max-w-3xl">
                        <h1
                            className={`text-4xl md:text-5xl font-extrabold text-white mb-4 ${playfair.className}`}
                        >
                            Hubungi Kami
                        </h1>
                        <p className="text-lg md:text-xl text-white">
                            Kami siap mendengarkan pertanyaan, saran, dan
                            reservasi Anda
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-16 px-4 bg-amber-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-10">
                        {/* Contact Info */}
                        <div>
                            <div className="bg-white p-8 rounded-lg shadow-md">
                                <h2
                                    className={`text-2xl font-bold text-amber-900 mb-6 ${playfair.className}`}
                                >
                                    Informasi Kontak
                                </h2>

                                <div className="space-y-6">
                                    <div className="flex items-start">
                                        <div className="bg-amber-100 p-3 rounded-full mr-4">
                                            <MapPin className="h-6 w-6 text-amber-700" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-amber-900 mb-1">
                                                Alamat
                                            </h3>
                                            <p className="text-gray-600">
                                                Jl. Raya Cita Nusa No. 123
                                                <br />
                                                Denpasar, Bali
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-amber-100 p-3 rounded-full mr-4">
                                            <Phone className="h-6 w-6 text-amber-700" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-amber-900 mb-1">
                                                Telepon
                                            </h3>
                                            <p className="text-gray-600">
                                                (021) 123-4567
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-amber-100 p-3 rounded-full mr-4">
                                            <Mail className="h-6 w-6 text-amber-700" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-amber-900 mb-1">
                                                Email
                                            </h3>
                                            <p className="text-gray-600">
                                                info@citanusaresto.com
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <h3 className="font-semibold text-amber-900 mb-3">
                                        Jam Operasional
                                    </h3>
                                    <ul className="text-gray-600 space-y-1">
                                        <li className="flex justify-between">
                                            <span>Senin - Jumat:</span>
                                            <span>11.00 - 22.00</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Sabtu - Minggu:</span>
                                            <span>10.00 - 23.00</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div>
                            <div className="bg-white p-8 rounded-lg shadow-md">
                                <h2
                                    className={`text-2xl font-bold text-amber-900 mb-6 ${playfair.className}`}
                                >
                                    Kirim Pesan
                                </h2>
                                <form
                                    onSubmit={handleSubmit(onSubmit)}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-gray-700 mb-1"
                                        >
                                            Nama Lengkap
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                                errors.name
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            }`}
                                            placeholder="Masukkan nama lengkap"
                                            {...register("name")}
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-red-500 text-sm">
                                                {errors.name.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-gray-700 mb-1"
                                        >
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                                errors.email
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            }`}
                                            placeholder="Masukkan alamat email"
                                            {...register("email")}
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-red-500 text-sm">
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="subject"
                                            className="block text-gray-700 mb-1"
                                        >
                                            Subjek
                                        </label>
                                        <input
                                            id="subject"
                                            type="text"
                                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                                errors.subject
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            }`}
                                            placeholder="Masukkan subjek pesan"
                                            {...register("subject")}
                                        />
                                        {errors.subject && (
                                            <p className="mt-1 text-red-500 text-sm">
                                                {errors.subject.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="message"
                                            className="block text-gray-700 mb-1"
                                        >
                                            Pesan
                                        </label>
                                        <textarea
                                            id="message"
                                            rows={5}
                                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                                errors.message
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            }`}
                                            placeholder="Tulis pesan Anda"
                                            {...register("message")}
                                        ></textarea>
                                        {errors.message && (
                                            <p className="mt-1 text-red-500 text-sm">
                                                {errors.message.message}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200 flex items-center justify-center"
                                    >
                                        {isPending ? (
                                            <span className="flex items-center">
                                                <span className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                                                Mengirim...
                                            </span>
                                        ) : (
                                            <span className="flex items-center">
                                                <Send className="h-5 w-5 mr-2" />
                                                Kirim Pesan
                                            </span>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default ContactPage;
