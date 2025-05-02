import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/layout/Layout";
import { Award, Users, Calendar, Utensils } from "lucide-react";
import { playfair } from "../_app";
import { milestones, teamMembers } from "@/constants";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import TeamMemberCard from "@/components/card/about/TeamMemberCard ";

const AboutPage: NextPage = () => {
    // Refs for each section
    const storyRef = useRef(null);
    const valuesRef = useRef(null);
    const milestonesRef = useRef(null);
    const teamRef = useRef(null);
    const ctaRef = useRef(null);

    // Check if sections are in view
    const storyInView = useInView(storyRef, { once: true, amount: 0.3 });
    const valuesInView = useInView(valuesRef, { once: true, amount: 0.3 });
    const milestonesInView = useInView(milestonesRef, {
        once: true,
        amount: 0.3,
    });
    const teamInView = useInView(teamRef, { once: true, amount: 0.3 });
    const ctaInView = useInView(ctaRef, { once: true, amount: 0.5 });

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.8, ease: "easeOut" },
        },
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 60 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" },
        },
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const staggerContainerTeam = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
        },
    };

    const heroTextVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                delay: 0.3,
            },
        },
    };

    const imgScale = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: "easeOut",
            },
        },
    };

    const buttonHover = {
        rest: { scale: 1 },
        hover: {
            scale: 1.05,
            transition: { duration: 0.2 },
        },
        tap: { scale: 0.95 },
    };

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
            <motion.section
                className="relative h-[40vh]"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
            >
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
                <motion.div
                    className="absolute inset-0 z-20 flex items-center justify-center text-center px-4"
                    variants={heroTextVariants}
                >
                    <div className="max-w-3xl">
                        <motion.h1
                            className={`text-4xl md:text-5xl font-extrabold text-white mb-4 ${playfair.className}`}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                        >
                            Tentang Kami
                        </motion.h1>
                        <motion.p
                            className="text-lg md:text-xl text-white"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                        >
                            Perjalanan kami dalam menghadirkan cita rasa
                            nusantara yang autentik
                        </motion.p>
                    </div>
                </motion.div>
            </motion.section>

            {/* Our Story Section */}
            <motion.section
                className="py-16 px-4 bg-white"
                ref={storyRef}
                initial="hidden"
                animate={storyInView ? "visible" : "hidden"}
                variants={fadeInUp}
            >
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        <motion.div className="lg:w-1/2" variants={imgScale}>
                            <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-xl">
                                <Image
                                    src="/images/about-story.jpg"
                                    alt="Kisah Cita Nusa Resto"
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                        </motion.div>
                        <motion.div className="lg:w-1/2" variants={fadeInUp}>
                            <motion.h2
                                className={`text-3xl font-bold text-amber-900 mb-6 ${playfair.className}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={
                                    storyInView
                                        ? { opacity: 1, x: 0 }
                                        : { opacity: 0, x: -20 }
                                }
                                transition={{ delay: 0.2, duration: 0.6 }}
                            >
                                Kisah Kami
                            </motion.h2>
                            <motion.p
                                className="text-gray-700 mb-4"
                                initial={{ opacity: 0 }}
                                animate={
                                    storyInView
                                        ? { opacity: 1 }
                                        : { opacity: 0 }
                                }
                                transition={{ delay: 0.3, duration: 0.6 }}
                            >
                                Cita Nusa Resto didirikan pada tahun 2018 dengan
                                sebuah misi sederhana namun mendalam:
                                melestarikan dan memperkenalkan kekayaan kuliner
                                Indonesia kepada masyarakat luas.
                            </motion.p>
                            <motion.p
                                className="text-gray-700 mb-4"
                                initial={{ opacity: 0 }}
                                animate={
                                    storyInView
                                        ? { opacity: 1 }
                                        : { opacity: 0 }
                                }
                                transition={{ delay: 0.4, duration: 0.6 }}
                            >
                                Berawal dari kecintaan keluarga Santoso terhadap
                                masakan nusantara, Cita Nusa hadir sebagai wadah
                                untuk berbagi cita rasa autentik Indonesia yang
                                kaya akan rempah dan kenangan. Kami percaya
                                bahwa setiap hidangan memiliki cerita dan
                                warisan budaya yang patut dilestarikan.
                            </motion.p>
                            <motion.p
                                className="text-gray-700 mb-4"
                                initial={{ opacity: 0 }}
                                animate={
                                    storyInView
                                        ? { opacity: 1 }
                                        : { opacity: 0 }
                                }
                                transition={{ delay: 0.5, duration: 0.6 }}
                            >
                                Nama {"Cita Nusa"} sendiri merupakan perwujudan
                                dari cita-cita kami untuk mengangkat cita rasa
                                kuliner nusantara ke panggung yang lebih luas,
                                tetap mempertahankan keasliannya namun disajikan
                                dengan sentuhan modern.
                            </motion.p>
                            <motion.p
                                className="text-gray-700"
                                initial={{ opacity: 0 }}
                                animate={
                                    storyInView
                                        ? { opacity: 1 }
                                        : { opacity: 0 }
                                }
                                transition={{ delay: 0.6, duration: 0.6 }}
                            >
                                Setiap hidangan yang kami sajikan merupakan
                                hasil dari riset mendalam, pemilihan bahan
                                berkualitas, dan dedikasi untuk mempersembahkan
                                yang terbaik bagi para tamu. Inilah yang menjadi
                                fondasi Cita Nusa Resto hingga saat ini.
                            </motion.p>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Values Section */}
            <motion.section
                className="py-16 px-4 bg-amber-50"
                ref={valuesRef}
                initial="hidden"
                animate={valuesInView ? "visible" : "hidden"}
                variants={fadeInUp}
            >
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        className="text-center mb-12"
                        variants={fadeInUp}
                    >
                        <motion.h2
                            className={`text-3xl font-bold text-amber-900 mb-4 ${playfair.className}`}
                            initial={{ opacity: 0 }}
                            animate={
                                valuesInView ? { opacity: 1 } : { opacity: 0 }
                            }
                            transition={{ duration: 0.6 }}
                        >
                            Nilai-Nilai Kami
                        </motion.h2>
                        <motion.p
                            className="text-gray-700 max-w-2xl mx-auto"
                            initial={{ opacity: 0 }}
                            animate={
                                valuesInView ? { opacity: 1 } : { opacity: 0 }
                            }
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            Prinsip yang memandu kami dalam menyajikan
                            pengalaman kuliner terbaik
                        </motion.p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                        variants={staggerContainer}
                    >
                        <motion.div
                            className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                            variants={cardVariants}
                            whileHover={{
                                y: -10,
                                transition: { duration: 0.3 },
                            }}
                        >
                            <motion.div
                                className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-4"
                                whileHover={{ rotate: 5, scale: 1.1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Award className="h-8 w-8 text-amber-700" />
                            </motion.div>
                            <h3 className="text-xl font-semibold text-amber-900 mb-2 text-center">
                                Keaslian
                            </h3>
                            <p className="text-gray-600 text-center">
                                Kami berkomitmen untuk menyajikan hidangan
                                dengan resep autentik dan teknik tradisional
                                Indonesia.
                            </p>
                        </motion.div>

                        <motion.div
                            className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                            variants={cardVariants}
                            whileHover={{
                                y: -10,
                                transition: { duration: 0.3 },
                            }}
                        >
                            <motion.div
                                className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-4"
                                whileHover={{ rotate: 5, scale: 1.1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Utensils className="h-8 w-8 text-amber-700" />
                            </motion.div>
                            <h3 className="text-xl font-semibold text-amber-900 mb-2 text-center">
                                Kualitas
                            </h3>
                            <p className="text-gray-600 text-center">
                                Hanya bahan-bahan terbaik dan terbaru yang kami
                                gunakan untuk menciptakan hidangan berkualitas
                                tinggi.
                            </p>
                        </motion.div>

                        <motion.div
                            className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                            variants={cardVariants}
                            whileHover={{
                                y: -10,
                                transition: { duration: 0.3 },
                            }}
                        >
                            <motion.div
                                className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-4"
                                whileHover={{ rotate: 5, scale: 1.1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Users className="h-8 w-8 text-amber-700" />
                            </motion.div>
                            <h3 className="text-xl font-semibold text-amber-900 mb-2 text-center">
                                Keramahan
                            </h3>
                            <p className="text-gray-600 text-center">
                                Kami percaya bahwa keramahan dan pelayanan yang
                                tulus adalah bagian penting dari pengalaman
                                bersantap.
                            </p>
                        </motion.div>

                        <motion.div
                            className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                            variants={cardVariants}
                            whileHover={{
                                y: -10,
                                transition: { duration: 0.3 },
                            }}
                        >
                            <motion.div
                                className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-4"
                                whileHover={{ rotate: 5, scale: 1.1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Calendar className="h-8 w-8 text-amber-700" />
                            </motion.div>
                            <h3 className="text-xl font-semibold text-amber-900 mb-2 text-center">
                                Inovasi
                            </h3>
                            <p className="text-gray-600 text-center">
                                Kami terus berinovasi dan berkembang, tetapi
                                tetap menghormati akar dan tradisi kuliner
                                Indonesia.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Milestones Section */}
            <motion.section
                className="py-16 px-4 bg-white"
                ref={milestonesRef}
                initial="hidden"
                animate={milestonesInView ? "visible" : "hidden"}
                variants={fadeInUp}
            >
                <div className="container mx-auto max-w-4xl">
                    <motion.div
                        className="text-center mb-12"
                        variants={fadeInUp}
                    >
                        <motion.h2
                            className={`text-3xl font-bold text-amber-900 mb-4 ${playfair.className}`}
                            initial={{ opacity: 0 }}
                            animate={
                                milestonesInView
                                    ? { opacity: 1 }
                                    : { opacity: 0 }
                            }
                            transition={{ duration: 0.6 }}
                        >
                            Perjalanan Kami
                        </motion.h2>
                        <motion.p
                            className="text-gray-700 max-w-2xl mx-auto"
                            initial={{ opacity: 0 }}
                            animate={
                                milestonesInView
                                    ? { opacity: 1 }
                                    : { opacity: 0 }
                            }
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            Tonggak penting dalam perjalanan Cita Nusa Resto
                            hingga saat ini
                        </motion.p>
                    </motion.div>

                    <motion.div
                        className="space-y-8"
                        variants={staggerContainer}
                    >
                        {milestones.map((milestone, index) => (
                            <motion.div
                                key={index}
                                className="flex flex-col md:flex-row items-start md:items-center gap-4"
                                variants={cardVariants}
                                initial={{
                                    opacity: 0,
                                    x: index % 2 === 0 ? -50 : 50,
                                }}
                                animate={
                                    milestonesInView
                                        ? { opacity: 1, x: 0 }
                                        : {
                                              opacity: 0,
                                              x: index % 2 === 0 ? -50 : 50,
                                          }
                                }
                                transition={{
                                    delay: 0.2 + index * 0.1,
                                    duration: 0.6,
                                }}
                                whileHover={{
                                    scale: 1.02,
                                    transition: { duration: 0.2 },
                                }}
                            >
                                <motion.div
                                    className="bg-amber-100 text-amber-900 px-4 py-2 rounded-lg font-bold text-xl min-w-[100px] text-center"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    {milestone.year}
                                </motion.div>
                                <div className="bg-amber-50 rounded-lg p-6 shadow-sm flex-1">
                                    <h3 className="text-xl font-semibold text-amber-900 mb-2">
                                        {milestone.title}
                                    </h3>
                                    <p className="text-gray-700">
                                        {milestone.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>

            {/* Our Team Section */}
            <motion.section
                className="py-16 px-4 bg-amber-50"
                ref={teamRef}
                initial="hidden"
                animate={teamInView ? "visible" : "hidden"}
                variants={fadeInUp}
            >
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        className="text-center mb-12"
                        variants={fadeInUp}
                    >
                        <motion.h2
                            className={`text-3xl font-bold text-amber-900 mb-4 ${playfair.className}`}
                            initial={{ opacity: 0 }}
                            animate={
                                teamInView ? { opacity: 1 } : { opacity: 0 }
                            }
                            transition={{ duration: 0.6 }}
                        >
                            Tim Kami
                        </motion.h2>
                        <motion.p
                            className="text-gray-700 max-w-2xl mx-auto"
                            initial={{ opacity: 0 }}
                            animate={
                                teamInView ? { opacity: 1 } : { opacity: 0 }
                            }
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            Inilah orang-orang berbakat di balik hidangan lezat
                            Cita Nusa Resto
                        </motion.p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                        variants={staggerContainerTeam}
                        initial="hidden"
                        animate="show"
                    >
                        {teamMembers.map((member) => (
                            <TeamMemberCard
                                key={member.id}
                                member={
                                    member as unknown as Record<string, string>
                                }
                            />
                        ))}
                    </motion.div>
                </div>
            </motion.section>

            {/* Reservation CTA */}
            <motion.section
                className="py-12 bg-amber-900 text-white"
                ref={ctaRef}
                initial={{ opacity: 0, y: 50 }}
                animate={
                    ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                }
                transition={{ duration: 0.8 }}
            >
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <motion.h2
                            className={`text-3xl font-bold mb-6 ${playfair.className}`}
                            initial={{ opacity: 0 }}
                            animate={
                                ctaInView ? { opacity: 1 } : { opacity: 0 }
                            }
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            Rasakan Pengalaman Bersantap Bersama Kami
                        </motion.h2>
                        <motion.p
                            className="text-amber-100 mb-8 text-lg"
                            initial={{ opacity: 0 }}
                            animate={
                                ctaInView ? { opacity: 1 } : { opacity: 0 }
                            }
                            transition={{ delay: 0.4, duration: 0.6 }}
                        >
                            Kami menantikan kehadiran Anda untuk menikmati
                            beragam cita rasa nusantara di Cita Nusa Resto.
                        </motion.p>
                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                            initial={{ opacity: 0 }}
                            animate={
                                ctaInView ? { opacity: 1 } : { opacity: 0 }
                            }
                            transition={{ delay: 0.6, duration: 0.6 }}
                        >
                            <motion.div
                                variants={buttonHover}
                                initial="rest"
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <Link
                                    href="/booking/new"
                                    className="bg-white hover:bg-gray-100 text-amber-900 px-6 py-3 rounded-md text-lg font-medium transition-colors duration-200 inline-flex items-center justify-center"
                                >
                                    <motion.span
                                        className="flex items-center"
                                        initial={{ x: -5 }}
                                        animate={{ x: 0 }}
                                        transition={{
                                            delay: 0.8,
                                            duration: 0.3,
                                        }}
                                    >
                                        <Calendar className="mr-2 h-5 w-5" />
                                        Reservasi Sekarang
                                    </motion.span>
                                </Link>
                            </motion.div>
                            <motion.div
                                variants={buttonHover}
                                initial="rest"
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <Link
                                    href="/menu"
                                    className="bg-transparent hover:bg-amber-800 text-white border border-white px-6 py-3 rounded-md text-lg font-medium transition-colors duration-200 inline-flex items-center justify-center"
                                >
                                    <motion.span
                                        className="flex items-center"
                                        initial={{ x: -5 }}
                                        animate={{ x: 0 }}
                                        transition={{
                                            delay: 0.9,
                                            duration: 0.3,
                                        }}
                                    >
                                        <Utensils className="mr-2 h-5 w-5" />
                                        Lihat Menu Kami
                                    </motion.span>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>
        </Layout>
    );
};

export default AboutPage;
