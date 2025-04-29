import { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
// import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { CheckCircle } from "lucide-react";
import BookingInfo from "@/components/info";

const BookingSuccessPage: NextPage = () => {
    const router = useRouter();

    // If user directly navigates to success page without making a booking,
    // redirect them to the booking page
    useEffect(() => {
        const redirectTimeout = setTimeout(() => {
            if (!router.query.fromBooking) {
                router.push("/booking");
            }
        }, 100);

        return () => clearTimeout(redirectTimeout);
    }, [router]);

    return (
        <Layout>
            <Head>
                <title>Reservasi Berhasil - Cita Nusa Resto</title>
                <meta
                    name="description"
                    content="Konfirmasi reservasi berhasil di Cita Nusa Resto"
                />
            </Head>

            {/* Success Content */}
            <section className="py-20 px-4 bg-amber-50 min-h-screen flex items-center">
                <div className="container mx-auto max-w-3xl">
                    <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 text-center">
                        <div className="flex justify-center mb-6">
                            <CheckCircle size={80} className="text-green-500" />
                        </div>

                        <h1
                            className={`text-3xl md:text-4xl font-extrabold text-amber-900 mb-4`}
                        >
                            Reservasi Berhasil!
                        </h1>

                        <p className="text-gray-700 text-lg mb-8">
                            Terima kasih telah melakukan reservasi di Cita Nusa
                            Resto. Kami telah menerima permintaan reservasi Anda
                            dan akan segera mengkonfirmasi.
                        </p>

                        <BookingInfo />

                        <p className="text-gray-700 mb-8">
                            Anda dapat melihat dan mengelola reservasi Anda di
                            halaman profil.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/profile/bookings"
                                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md font-medium"
                            >
                                Lihat Reservasi Saya
                            </Link>
                            <Link
                                href="/menu"
                                className="bg-white hover:bg-gray-100 text-amber-900 border border-amber-300 px-6 py-3 rounded-md font-medium"
                            >
                                Lihat Menu Kami
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default BookingSuccessPage;
