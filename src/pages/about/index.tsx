import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/layout/Layout";
import { Award, Users, Calendar, Utensils } from "lucide-react";
import { playfair } from "../_app";

const AboutPage: NextPage = () => {
    // Data dummy untuk halaman about
    const teamMembers = [
        {
            id: 1,
            name: "Budi Santoso",
            position: "Head Chef",
            image: "chef-1.jpg",
            bio: "Chef Budi memiliki pengalaman lebih dari 15 tahun dalam dunia kuliner Indonesia. Dia telah memasak untuk berbagai acara penting dan memenangkan beberapa penghargaan kuliner nasional.",
        },
        {
            id: 2,
            name: "Siti Rahayu",
            position: "Restaurant Manager",
            image: "manager-1.jpg",
            bio: "Siti telah mengelola beberapa restoran terkemuka di Indonesia selama 10 tahun terakhir. Dengan latar belakang hospitality management, dia memastikan pengalaman tamu yang sempurna.",
        },
        {
            id: 3,
            name: "Agus Wijaya",
            position: "Sous Chef",
            image: "chef-2.jpg",
            bio: "Chef Agus adalah spesialis dalam hidangan seafood dan bumbu rempah Nusantara. Perjalanan kulinernya dimulai dari dapur keluarga di Sulawesi Selatan.",
        },
        {
            id: 4,
            name: "Dewi Anggraini",
            position: "Pastry Chef",
            image: "chef-3.jpg",
            bio: "Chef Dewi adalah ahli dalam menggabungkan teknik pastry modern dengan cita rasa tradisional Indonesia, menciptakan dessert yang unik dan memorable.",
        },
    ];

    const milestones = [
        {
            year: 2018,
            title: "Awal Perjalanan",
            description:
                "Cita Nusa Resto didirikan oleh keluarga Santoso dengan visi melestarikan kekayaan kuliner Indonesia.",
        },
        {
            year: 2019,
            title: "Ekspansi Menu",
            description:
                "Penambahan menu dari berbagai daerah di Indonesia untuk memperkaya pengalaman kuliner para tamu.",
        },
        {
            year: 2020,
            title: "Adaptasi di Masa Pandemi",
            description:
                "Mengembangkan layanan pesan antar dan take away untuk tetap melayani pelanggan setia.",
        },
        {
            year: 2021,
            title: "Renovasi & Inovasi",
            description:
                "Renovasi total interior restoran dan inovasi menu dengan menambahkan sentuhan modern.",
        },
        {
            year: 2022,
            title: "Penghargaan Kuliner",
            description:
                "Menerima penghargaan 'Restoran Autentik Terbaik' dari Asosiasi Kuliner Indonesia.",
        },
        {
            year: 2023,
            title: "Keberlanjutan",
            description:
                "Berkomitmen menggunakan bahan lokal dan praktik ramah lingkungan dalam operasional restoran.",
        },
    ];

    return (
        <Layout>
            <Head>
                <title>Tentang Kami - Cita Nusa Resto</title>
                <meta
                    name="description"
                    content="Mengenal lebih dekat Cita Nusa Resto, sejarah, dan tim kami yang berdedikasi menyajikan cita rasa nusantara."
                />
            </Head>

            {/* Hero Section */}
            <section className="relative h-[40vh]">
                <div className="absolute inset-0 bg-black/60 z-10" />
                <div className="relative h-full">
                    <Image
                        src="/images/about-hero.jpg"
                        alt="Tentang Cita Nusa Resto"
                        layout="fill"
                        objectFit="cover"
                        priority
                    />
                </div>
                <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-4">
                    <div className="max-w-3xl">
                        <h1
                            className={`text-4xl md:text-5xl font-extrabold text-white mb-4 ${playfair.className}`}
                        >
                            Tentang Kami
                        </h1>
                        <p className="text-lg md:text-xl text-white">
                            Perjalanan kami dalam menghadirkan cita rasa
                            nusantara yang autentik
                        </p>
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-16 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        <div className="lg:w-1/2">
                            <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-xl">
                                <Image
                                    src="/images/about-story.jpg"
                                    alt="Kisah Cita Nusa Resto"
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                        </div>
                        <div className="lg:w-1/2">
                            <h2
                                className={`text-3xl font-bold text-amber-900 mb-6 ${playfair.className}`}
                            >
                                Kisah Kami
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Cita Nusa Resto didirikan pada tahun 2018 dengan
                                sebuah misi sederhana namun mendalam:
                                melestarikan dan memperkenalkan kekayaan kuliner
                                Indonesia kepada masyarakat luas.
                            </p>
                            <p className="text-gray-700 mb-4">
                                Berawal dari kecintaan keluarga Santoso terhadap
                                masakan nusantara, Cita Nusa hadir sebagai wadah
                                untuk berbagi cita rasa autentik Indonesia yang
                                kaya akan rempah dan kenangan. Kami percaya
                                bahwa setiap hidangan memiliki cerita dan
                                warisan budaya yang patut dilestarikan.
                            </p>
                            <p className="text-gray-700 mb-4">
                                Nama {"Cita Nusa"} sendiri merupakan perwujudan
                                dari cita-cita kami untuk mengangkat cita rasa
                                kuliner nusantara ke panggung yang lebih luas,
                                tetap mempertahankan keasliannya namun disajikan
                                dengan sentuhan modern.
                            </p>
                            <p className="text-gray-700">
                                Setiap hidangan yang kami sajikan merupakan
                                hasil dari riset mendalam, pemilihan bahan
                                berkualitas, dan dedikasi untuk mempersembahkan
                                yang terbaik bagi para tamu. Inilah yang menjadi
                                fondasi Cita Nusa Resto hingga saat ini.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 px-4 bg-amber-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2
                            className={`text-3xl font-bold text-amber-900 mb-4 ${playfair.className}`}
                        >
                            Nilai-Nilai Kami
                        </h2>
                        <p className="text-gray-700 max-w-2xl mx-auto">
                            Prinsip yang memandu kami dalam menyajikan
                            pengalaman kuliner terbaik
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-4">
                                <Award className="h-8 w-8 text-amber-700" />
                            </div>
                            <h3 className="text-xl font-semibold text-amber-900 mb-2 text-center">
                                Keaslian
                            </h3>
                            <p className="text-gray-600 text-center">
                                Kami berkomitmen untuk menyajikan hidangan
                                dengan resep autentik dan teknik tradisional
                                Indonesia.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-4">
                                <Utensils className="h-8 w-8 text-amber-700" />
                            </div>
                            <h3 className="text-xl font-semibold text-amber-900 mb-2 text-center">
                                Kualitas
                            </h3>
                            <p className="text-gray-600 text-center">
                                Hanya bahan-bahan terbaik dan terbaru yang kami
                                gunakan untuk menciptakan hidangan berkualitas
                                tinggi.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-4">
                                <Users className="h-8 w-8 text-amber-700" />
                            </div>
                            <h3 className="text-xl font-semibold text-amber-900 mb-2 text-center">
                                Keramahan
                            </h3>
                            <p className="text-gray-600 text-center">
                                Kami percaya bahwa keramahan dan pelayanan yang
                                tulus adalah bagian penting dari pengalaman
                                bersantap.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-4">
                                <Calendar className="h-8 w-8 text-amber-700" />
                            </div>
                            <h3 className="text-xl font-semibold text-amber-900 mb-2 text-center">
                                Inovasi
                            </h3>
                            <p className="text-gray-600 text-center">
                                Kami terus berinovasi dan berkembang, tetapi
                                tetap menghormati akar dan tradisi kuliner
                                Indonesia.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Milestones Section */}
            <section className="py-16 px-4 bg-white">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-12">
                        <h2
                            className={`text-3xl font-bold text-amber-900 mb-4 ${playfair.className}`}
                        >
                            Perjalanan Kami
                        </h2>
                        <p className="text-gray-700 max-w-2xl mx-auto">
                            Tonggak penting dalam perjalanan Cita Nusa Resto
                            hingga saat ini
                        </p>
                    </div>

                    <div className="space-y-8">
                        {milestones.map((milestone, index) => (
                            <div
                                key={index}
                                className="flex flex-col md:flex-row items-start md:items-center gap-4"
                            >
                                <div className="bg-amber-100 text-amber-900 px-4 py-2 rounded-lg font-bold text-xl min-w-[100px] text-center">
                                    {milestone.year}
                                </div>
                                <div className="bg-amber-50 rounded-lg p-6 shadow-sm flex-1">
                                    <h3 className="text-xl font-semibold text-amber-900 mb-2">
                                        {milestone.title}
                                    </h3>
                                    <p className="text-gray-700">
                                        {milestone.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Team Section */}
            <section className="py-16 px-4 bg-amber-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2
                            className={`text-3xl font-bold text-amber-900 mb-4 ${playfair.className}`}
                        >
                            Tim Kami
                        </h2>
                        <p className="text-gray-700 max-w-2xl mx-auto">
                            Inilah orang-orang berbakat di balik hidangan lezat
                            Cita Nusa Resto
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamMembers.map((member) => (
                            <div
                                key={member.id}
                                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="relative h-64">
                                    <Image
                                        src={`/images/team/${member.image}`}
                                        alt={member.name}
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                </div>
                                <div className="p-5">
                                    <h3 className="text-xl font-semibold text-amber-900 mb-1">
                                        {member.name}
                                    </h3>
                                    <p className="text-amber-600 font-medium text-sm mb-3">
                                        {member.position}
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        {member.bio}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reservation CTA */}
            <section className="py-12 bg-amber-900 text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2
                            className={`text-3xl font-bold mb-6 ${playfair.className}`}
                        >
                            Rasakan Pengalaman Bersantap Bersama Kami
                        </h2>
                        <p className="text-amber-100 mb-8 text-lg">
                            Kami menantikan kehadiran Anda untuk menikmati
                            beragam cita rasa nusantara di Cita Nusa Resto.
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
                                href="/menu"
                                className="bg-transparent hover:bg-amber-800 text-white border border-white px-6 py-3 rounded-md text-lg font-medium transition-colors duration-200 inline-flex items-center justify-center"
                            >
                                <Utensils className="mr-2 h-5 w-5" />
                                Lihat Menu Kami
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default AboutPage;
