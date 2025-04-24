import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { playfair } from "../_app";
import Layout from "@/components/layout/Layout";

const BookingPage: NextPage = () => {
    return (
        <Layout>
            <Head>
                <title>Reservasi - Cita Nusa Resto</title>
                <meta
                    name="description"
                    content="Reservasi meja di Cita Nusa Resto - Sajian autentik Indonesia"
                />
            </Head>

            {/* Booking Info Section */}
            <section className="py-16 px-4 bg-amber-50">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-12">
                        <h2
                            className={`text-2xl font-extrabold text-amber-900 mb-4`}
                        >
                            Informasi Reservasi
                        </h2>
                        <p className="text-gray-700 max-w-2xl mx-auto">
                            Kami menyediakan layanan reservasi untuk memastikan
                            pengalaman bersantap Anda berjalan lancar. Silahkan
                            pesan meja Anda minimal 2 jam sebelum kedatangan.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-800 mx-auto mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-amber-900 mb-2">
                                Jam Operasional
                            </h3>
                            <p className="text-gray-600">
                                Senin - Jumat: 11.00 - 22.00
                                <br />
                                Sabtu - Minggu: 10.00 - 23.00
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-800 mx-auto mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-amber-900 mb-2">
                                Kapasitas
                            </h3>
                            <p className="text-gray-600">
                                Kami memiliki meja untuk 2, 4, 6, dan 8 orang.
                                <br />
                                Untuk grup lebih besar, silahkan hubungi kami.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-800 mx-auto mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-amber-900 mb-2">
                                Kontak
                            </h3>
                            <p className="text-gray-600">
                                Telepon: (021) 123-4567
                                <br />
                                Email: info@citanusaresto.com
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                        <h3
                            className={`text-2xl font-extrabold text-amber-900 mb-4`}
                        >
                            Buat Reservasi Sekarang
                        </h3>
                        <p className="text-gray-700 mb-6">
                            Reservasi meja untuk memastikan tempat Anda di Cita
                            Nusa Resto. Nikmati hidangan autentik Indonesia
                            dalam suasana yang nyaman.
                        </p>
                        <Link
                            href="/booking/new"
                            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-md text-lg font-medium inline-block"
                        >
                            Reservasi Meja
                        </Link>
                    </div>
                </div>
            </section>

            {/* My Bookings Section for logged-in users */}
            <section className="py-16 px-4 bg-white">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-8">
                        <h2
                            className={`text-2xl font-extrabold text-amber-900 mb-4`}
                        >
                            Reservasi Saya
                        </h2>
                        <p className="text-gray-700 max-w-2xl mx-auto">
                            Lihat dan kelola reservasi yang telah Anda buat.
                        </p>
                    </div>

                    <div className="bg-amber-50 p-8 rounded-lg shadow-md text-center">
                        <Link
                            href="/profile/bookings"
                            className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 px-8 py-3 rounded-md text-lg font-medium inline-block"
                        >
                            Lihat Reservasi Saya
                        </Link>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default BookingPage;
