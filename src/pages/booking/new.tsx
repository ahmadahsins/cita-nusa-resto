import { useState, useEffect } from "react";
import { NextPage } from "next";
import Head from "next/head";
import Layout from "@/components/layout/Layout";
import "react-datepicker/dist/react-datepicker.css";
import { Table } from "@prisma/client";
import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import NewBookingForm from "@/components/form/NewBookingForm";
import { useRouter } from "next/router";
import Image from "next/image";

const NewBookingPage: NextPage = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<Date | null>(null);
    const [availableTables, setAvailableTables] = useState<Table[]>([]);

    const router = useRouter();
    const { isAuthenticated, isHydrated } = useAuth(
        "/auth/login?callbackUrl=" + encodeURIComponent("/booking/new")
    );

    // Handle authentication check
    useEffect(() => {
        if (isHydrated && !isAuthenticated) {
            router.push(
                "/auth/login?callbackUrl=" + encodeURIComponent("/booking/new")
            );
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
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col lg:flex-row lg:space-x-8">
                        {/* Booking Form Column */}
                        <div className="w-full lg:w-1/2">
                            <NewBookingForm
                                selectedDate={selectedDate}
                                setSelectedDate={setSelectedDate}
                                selectedTime={selectedTime}
                                setSelectedTime={setSelectedTime}
                                availableTables={availableTables}
                                setAvailableTables={setAvailableTables}
                            />
                        </div>
                        
                        {/* Floor Plan Visualization Column */}
                        <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
                            <h3 className="text-xl font-semibold mb-4 text-brown-700">Denah Meja Restoran</h3>
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <div className="relative w-full">
                                    <Image
                                        src="/images/denah-meja.png"
                                        alt="Denah Meja Cita Nusa Resto"
                                        width={600}
                                        height={600}
                                        className="w-full rounded-lg"
                                        priority
                                    />
                                </div>
                                <p className="text-sm text-gray-600 mt-3 text-center">Pilih meja yang tersedia sesuai dengan kebutuhan Anda</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default NewBookingPage;