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
                <div className="container mx-auto max-w-3xl">
                    <NewBookingForm
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        selectedTime={selectedTime}
                        setSelectedTime={setSelectedTime}
                        availableTables={availableTables}
                        setAvailableTables={setAvailableTables}
                    />
                </div>
            </section>
        </Layout>
    );
};

export default NewBookingPage;
