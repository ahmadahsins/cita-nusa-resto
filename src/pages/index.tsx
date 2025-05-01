import React from "react";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Layout from "../components/layout/Layout";
import { playfair } from "./_app";
import { Calendar, Utensils, Clock, Award, MapPin } from "lucide-react";
import { bestSellerMenu } from "@/constants";

const Home: NextPage = () => {
    return (
        <Layout>
            <Head>
                <title>Cita Nusa Resto - Sajian Autentik Indonesia</title>
                <meta
                    name="description"
                    content="Restoran dengan cita rasa nusantara yang menggugah selera"
                />
            </Head>

            {/* Hero Section */}
            <section className="relative h-[85vh] md:h-[90vh]">
                <div className="absolute inset-0 bg-black/50 z-10" />
                <div className="relative h-full">
                    <Image
                        src="/images/hero-bg.jpg"
                        alt="Cita Nusa Resto"
                        layout="fill"
                        objectFit="cover"
                        priority
                    />
                </div>
                <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-4">
                    <div className="max-w-3xl">
                        <h1
                            className={`text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 ${playfair.className}`}
                        >
                            Cita Nusa Resto
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-white mb-8">
                            Sajian autentik Indonesia dengan cita rasa nusantara
                            yang menggugah selera
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/menu"
                                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md text-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <Utensils className="h-5 w-5" />
                                    Lihat Menu
                                </span>
                            </Link>
                            <Link
                                href="/booking/new"
                                className="bg-white hover:bg-gray-100 text-amber-900 px-6 py-3 rounded-md text-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Reservasi Sekarang
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2
                            className={`text-3xl font-bold text-amber-900 mb-4 ${playfair.className}`}
                        >
                            Pengalaman Bersantap yang Istimewa
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Nikmati keunikan cita rasa kuliner nusantara dalam
                            suasana yang nyaman dan elegan di Cita Nusa Resto.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-amber-50 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-4">
                                <Utensils className="h-7 w-7 text-amber-700" />
                            </div>
                            <h3 className="text-xl font-semibold text-amber-900 mb-2">
                                Masakan Autentik
                            </h3>
                            <p className="text-gray-600">
                                Hidangan Indonesia dari berbagai daerah dengan
                                resep asli dan bahan berkualitas
                            </p>
                        </div>

                        <div className="bg-amber-50 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-4">
                                <Award className="h-7 w-7 text-amber-700" />
                            </div>
                            <h3 className="text-xl font-semibold text-amber-900 mb-2">
                                Kualitas Terbaik
                            </h3>
                            <p className="text-gray-600">
                                Menggunakan bahan-bahan segar dan berkualitas
                                tinggi untuk setiap hidangan
                            </p>
                        </div>

                        <div className="bg-amber-50 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-4">
                                <MapPin className="h-7 w-7 text-amber-700" />
                            </div>
                            <h3 className="text-xl font-semibold text-amber-900 mb-2">
                                Lokasi Strategis
                            </h3>
                            <p className="text-gray-600">
                                Berada di pusat kota dengan akses mudah dan
                                tempat parkir yang luas
                            </p>
                        </div>

                        <div className="bg-amber-50 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-4">
                                <Clock className="h-7 w-7 text-amber-700" />
                            </div>
                            <h3 className="text-xl font-semibold text-amber-900 mb-2">
                                Reservasi Mudah
                            </h3>
                            <p className="text-gray-600">
                                Sistem reservasi online yang praktis untuk
                                menjamin kenyamanan Anda
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Menu */}
            <section className="py-16 bg-amber-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2
                            className={`text-3xl font-bold text-amber-900 mb-4 ${playfair.className}`}
                        >
                            Menu Unggulan Kami
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Hidangan-hidangan istimewa yang menjadi favorit
                            pelanggan kami
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Menu Item 1 */}
                        {bestSellerMenu.map((menu) => (
                            <div
                                key={menu.id}
                                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="relative h-64">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                                    <Image
                                        src={`/images/menu/${menu.image}`}
                                        alt="Rendang Sapi"
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                    <div className="absolute bottom-0 left-0 p-4 z-20">
                                        <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                                            Best Seller
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-xl font-semibold text-amber-900">
                                            {menu.name}
                                        </h3>
                                        <span className="text-amber-600 font-bold">
                                            {`Rp. ${menu.price.toLocaleString(
                                                "id-ID"
                                            )}`}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4">
                                        {menu.description}
                                    </p>
                                    <Link
                                        href="/menu"
                                        className="text-amber-600 hover:text-amber-800 font-medium text-sm flex items-center"
                                    >
                                        Lihat Menu Lengkap
                                        <svg
                                            className="ml-1 w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Link
                            href="/menu"
                            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md text-lg font-medium transition-colors duration-200 inline-flex items-center"
                        >
                            <Utensils className="mr-2 h-5 w-5" />
                            Jelajahi Menu Lengkap
                        </Link>
                    </div>
                </div>
            </section>

            {/* Reservation CTA */}
            <section className="py-16 bg-amber-900 text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2
                            className={`text-3xl font-bold mb-6 ${playfair.className}`}
                        >
                            Pesan Meja Anda Sekarang
                        </h2>
                        <p className="text-amber-100 mb-8 text-lg">
                            Jangan lewatkan pengalaman bersantap yang istimewa.
                            Reservasi meja Anda untuk memastikan tempat di Cita
                            Nusa Resto.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/booking/new"
                                className="bg-white hover:bg-gray-100 text-amber-900 px-6 py-3 rounded-md text-lg font-medium transition-colors duration-200 inline-flex items-center justify-center"
                            >
                                <Calendar className="mr-2 h-5 w-5" />
                                Reservasi Sekarang
                            </Link>
                            <Link
                                href="/contact"
                                className="bg-transparent hover:bg-amber-800 text-white border border-white px-6 py-3 rounded-md text-lg font-medium transition-colors duration-200 inline-flex items-center justify-center"
                            >
                                Hubungi Kami
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Operating Hours & Location */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="bg-amber-50 p-8 rounded-lg shadow-md">
                        <h3
                            className={`text-2xl font-bold text-amber-900 mb-4 ${playfair.className}`}
                        >
                            Lokasi Kami
                        </h3>

                        {/* Embed Google Maps */}
                        <div className="relative h-64 rounded-lg overflow-hidden mb-4">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126223.49937453566!2d115.20055934863283!3d-8.672764672026936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd241e5c2a234ed%3A0x79baf75de8e6c873!2sSanur%2C%20Denpasar%2C%20Bali!5e0!3m2!1sid!2sid!4v1714556729050!5m2!1sid!2sid"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>

                        <p className="text-gray-600 mb-2">
                            Jl. Raya Cita Nusa No. 123, Denpasar, Bali
                        </p>
                        <Link
                            href="https://www.google.com/maps?q=Jl.+Raya+Cita+Nusa+No.+123,+Denpasar,+Bali"
                            target="_blank"
                            className="text-amber-600 hover:text-amber-800 font-medium inline-flex items-center"
                        >
                            Lihat di Google Maps
                            <svg
                                className="ml-1 w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Home;
