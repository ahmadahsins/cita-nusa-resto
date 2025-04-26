import React from "react";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Layout from "../components/layout/Layout";
import { playfair } from "./_app";
import { Home, RefreshCw, Mail } from "lucide-react";

const Custom500: NextPage = () => {
    return (
        <Layout>
            <Head>
                <title>Server Error - Cita Nusa Resto</title>
                <meta
                    name="description"
                    content="Terjadi kesalahan pada server"
                />
            </Head>

            {/* Error Section */}
            <section className="relative h-[70vh] md:h-[80vh] flex items-center">
                <div className="absolute inset-0 bg-amber-900/90 z-10" />
                <div className="relative h-full w-full">
                    <Image
                        src="/images/hero-bg.jpg"
                        alt="Background"
                        layout="fill"
                        objectFit="cover"
                        priority
                    />
                </div>

                <div className="container mx-auto px-4 z-20 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h1
                            className={`text-8xl font-bold text-white mb-4 ${playfair.className}`}
                        >
                            500
                        </h1>
                        <h2
                            className={`text-3xl md:text-4xl font-bold text-white mb-6 ${playfair.className}`}
                        >
                            Terjadi Kesalahan Server
                        </h2>
                        <p className="text-lg text-amber-100 mb-10">
                            Mohon maaf, terjadi kesalahan pada server kami. Tim
                            kami sedang bekerja untuk memperbaikinya. Silakan
                            coba lagi beberapa saat lagi.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/"
                                className="bg-white hover:bg-gray-100 text-amber-900 px-6 py-3 rounded-md text-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <Home className="h-5 w-5" />
                                    Kembali ke Beranda
                                </span>
                            </Link>
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md text-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <RefreshCw className="h-5 w-5" />
                                    Coba Lagi
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2
                            className={`text-3xl font-bold text-amber-900 mb-4 ${playfair.className}`}
                        >
                            Butuh Bantuan?
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Jika masalah terus berlanjut, jangan ragu untuk
                            menghubungi tim dukungan kami. Kami siap membantu
                            Anda dengan pertanyaan atau masalah apa pun.
                        </p>

                        <div className="flex justify-center">
                            <Link
                                href="/contact"
                                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md text-lg font-medium transition-colors duration-200 inline-flex items-center"
                            >
                                <Mail className="mr-2 h-5 w-5" />
                                Hubungi Dukungan
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Alternative Links */}
            <section className="py-16 bg-amber-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2
                            className={`text-3xl font-bold text-amber-900 mb-4 ${playfair.className}`}
                        >
                            Halaman Lainnya
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Anda dapat mengunjungi halaman-halaman populer kami
                            di bawah ini
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                        <Link
                            href="/"
                            className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-300 hover:bg-amber-100"
                        >
                            <h3 className="text-xl font-semibold text-amber-900 mb-2">
                                Beranda
                            </h3>
                            <p className="text-gray-600">
                                Kembali ke halaman utama
                            </p>
                        </Link>

                        <Link
                            href="/menu"
                            className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-300 hover:bg-amber-100"
                        >
                            <h3 className="text-xl font-semibold text-amber-900 mb-2">
                                Menu
                            </h3>
                            <p className="text-gray-600">Jelajahi menu kami</p>
                        </Link>

                        <Link
                            href="/booking/new"
                            className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-300 hover:bg-amber-100"
                        >
                            <h3 className="text-xl font-semibold text-amber-900 mb-2">
                                Reservasi
                            </h3>
                            <p className="text-gray-600">Pesan meja Anda</p>
                        </Link>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Custom500;
