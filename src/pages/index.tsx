import React from "react";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Layout from "../components/layout/Layout";
import { playfair } from "./_app";

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
            <section className="relative h-[90vh]">
                <div className="absolute inset-0 bg-black/40 z-10" />
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
                            className={`text-5xl md:text-6xl font-bold text-white mb-6 ${playfair.className}`}
                        >
                            Cita Nusa Resto
                        </h1>
                        <p className={`text-xl md:text-2xl text-white mb-8`}>
                            Sajian autentik Indonesia dengan cita rasa nusantara
                            yang menggugah selera
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/menu"
                                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-md text-lg font-medium"
                            >
                                {" "}
                                Lihat Menu
                            </Link>
                            <Link
                                href="/booking"
                                className="bg-white hover:bg-gray-100 text-amber-900 px-8 py-3 rounded-md text-lg font-medium"
                            >
                                Reservasi Sekarang
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Home;
