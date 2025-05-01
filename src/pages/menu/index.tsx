import { useEffect, useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Menu, MenuCategory } from "@prisma/client";
import Layout from "@/components/layout/Layout";
import { useGetMenu } from "@/hooks/useGetMenu";
import { useGetCategories } from "@/hooks/useGetCategories";
import { playfair } from "../_app";
import { motion, AnimatePresence } from "framer-motion";

interface MenuWithCategory extends Menu {
    category: MenuCategory;
}

const MenuPage: NextPage = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);

    const { data: menuItems, isLoading } = useGetMenu();
    const { data: categories } = useGetCategories();

    const filteredMenuItems =
        selectedCategory === "all"
            ? menuItems
            : menuItems?.filter(
                  (item: MenuWithCategory) =>
                      item.categoryId === selectedCategory
              );

    const menuPerPage = 6;

    const totalPages = Math.ceil(
        (filteredMenuItems?.length as number) / menuPerPage
    );
    const paginatedMenuItems = filteredMenuItems?.slice(
        (currentPage - 1) * menuPerPage,
        currentPage * menuPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 },
        },
        exit: {
            y: -20,
            opacity: 0,
            transition: { duration: 0.3 },
        },
    };

    const fadeInVariant = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.6 },
        },
    };

    const heroTextVariant = {
        hidden: { y: -30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.7,
                delay: 0.2,
            },
        },
    };

    return (
        <Layout>
            <Head>
                <title>Menu - Cita Nusa Resto</title>
                <meta
                    name="description"
                    content="Menu makanan dan minuman dari Cita Nusa Resto - Sajian autentik Indonesia"
                />
            </Head>

            {/* Hero Section */}
            <section className="relative h-[40vh]">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0 bg-black/50 z-10"
                />
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.2 }}
                    className="relative h-full"
                >
                    <Image
                        src="/images/menu-hero.jpg"
                        alt="Menu Cita Nusa Resto"
                        layout="fill"
                        objectFit="cover"
                        priority
                    />
                </motion.div>
                <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-4">
                    <div className="max-w-3xl">
                        <motion.h1
                            variants={heroTextVariant}
                            initial="hidden"
                            animate="visible"
                            className={`text-4xl md:text-5xl font-extrabold text-white mb-4 ${playfair.className}`}
                        >
                            Menu Kami
                        </motion.h1>
                        <motion.p
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                            className="text-lg md:text-xl text-white"
                        >
                            Nikmati berbagai hidangan autentik Nusantara yang
                            menggugah selera
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Menu Content */}
            <motion.section
                initial="hidden"
                animate="visible"
                variants={fadeInVariant}
                className="pt-12 pb-24 px-4 bg-amber-50"
            >
                <div className="container mx-auto">
                    {/* Category Filter */}
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-10"
                    >
                        <h2
                            className={`text-3xl font-bold text-amber-900 text-center mb-8 ${playfair.className}`}
                        >
                            Pilih Kategori
                        </h2>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="flex flex-nowrap overflow-x-auto whitespace-nowrap gap-3 px-2 scrollbar-hide"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedCategory("all")}
                                className={`px-5 py-2 rounded-md text-sm font-medium transition-colors 
                                ${
                                    selectedCategory === "all"
                                        ? "bg-amber-600 text-white"
                                        : "bg-white text-amber-800 hover:bg-amber-100"
                                }`}
                            >
                                Semua Menu
                            </motion.button>

                            {categories?.map((category) => (
                                <motion.button
                                    key={category.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() =>
                                        setSelectedCategory(category.id)
                                    }
                                    className={`px-5 py-2 rounded-md text-sm font-medium transition-colors 
                                    ${
                                        selectedCategory === category.id
                                            ? "bg-amber-600 text-white"
                                            : "bg-white text-amber-800 hover:bg-amber-100"
                                    }`}
                                >
                                    {category.name}
                                </motion.button>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Menu Items with AnimatePresence for smooth transitions */}
                    {isLoading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-amber-600 border-t-transparent"></div>
                            <p className="mt-4 text-amber-800">
                                Memuat menu...
                            </p>
                        </motion.div>
                    ) : (paginatedMenuItems as MenuWithCategory[]).length ===
                      0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-amber-600 border-t-transparent"></div>
                            <p className="mt-4 text-amber-800">
                                Memuat menu...
                            </p>
                        </motion.div>
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedCategory + currentPage}
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            >
                                {(paginatedMenuItems as MenuWithCategory[]).map(
                                    (menu, index) => (
                                        <motion.div
                                            layout
                                            key={menu.id}
                                            variants={itemVariants}
                                            whileHover={{
                                                y: -8,
                                                scale: 1.02,
                                                transition: {
                                                    duration: 0.2,
                                                },
                                            }}
                                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                                        >
                                            <div className="relative h-64 w-full">
                                                {menu.image ? (
                                                    <Image
                                                        src={`/images/menu/${menu.image}`}
                                                        alt={menu.name}
                                                        layout="fill"
                                                        objectFit="cover"
                                                    />
                                                ) : (
                                                    <div className="h-full bg-amber-200 flex items-center justify-center">
                                                        <span className="text-amber-800">
                                                            No Image
                                                        </span>
                                                    </div>
                                                )}
                                                <motion.div
                                                    initial={{
                                                        x: 20,
                                                        opacity: 0,
                                                    }}
                                                    animate={{
                                                        x: 0,
                                                        opacity: 1,
                                                    }}
                                                    transition={{
                                                        delay:
                                                            0.2 + index * 0.1,
                                                        duration: 0.5,
                                                    }}
                                                    className="absolute top-4 right-4 bg-amber-600 text-white px-3 py-1 rounded-full text-sm"
                                                >
                                                    {menu.category.name}
                                                </motion.div>
                                            </div>
                                            <div className="p-5">
                                                <h3 className="text-xl font-bold text-amber-900">
                                                    {menu.name}
                                                </h3>
                                                <p className="text-gray-600 mt-2 text-sm line-clamp-2">
                                                    {menu.description}
                                                </p>
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{
                                                        delay:
                                                            0.3 + index * 0.1,
                                                    }}
                                                    className="mt-4 flex items-center justify-between"
                                                >
                                                    <span className="text-lg font-bold text-amber-700">
                                                        {`Rp. ${menu.price.toLocaleString(
                                                            "id-ID"
                                                        )}`}
                                                    </span>
                                                    <motion.span
                                                        whileHover={{
                                                            scale: 1.1,
                                                        }}
                                                        className={`px-2 py-1 rounded text-xs ${
                                                            menu.isAvailable
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                        }`}
                                                    >
                                                        {menu.isAvailable
                                                            ? "Tersedia"
                                                            : "Habis"}
                                                    </motion.span>
                                                </motion.div>
                                            </div>
                                        </motion.div>
                                    )
                                )}
                            </motion.div>
                        </AnimatePresence>
                    )}

                    {/* Pagination with Animation */}
                    {totalPages > 1 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mt-6"
                        >
                            <motion.div
                                key={`info-${currentPage}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="text-sm text-gray-700"
                            >
                                Menampilkan{" "}
                                {(currentPage - 1) * menuPerPage + 1} -{" "}
                                {Math.min(
                                    currentPage * menuPerPage,
                                    filteredMenuItems?.length || 0
                                )}{" "}
                                dari {filteredMenuItems?.length} menu
                            </motion.div>
                            <div className="flex space-x-2">
                                <motion.button
                                    whileHover={
                                        currentPage !== 1 ? { scale: 1.05 } : {}
                                    }
                                    whileTap={
                                        currentPage !== 1 ? { scale: 0.95 } : {}
                                    }
                                    onClick={() =>
                                        setCurrentPage(currentPage - 1)
                                    }
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1 rounded ${
                                        currentPage === 1
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                                    }`}
                                >
                                    Sebelumnya
                                </motion.button>
                                <div className="flex items-center space-x-1">
                                    {Array.from({ length: totalPages }).map(
                                        (_, idx) => (
                                            <motion.button
                                                key={idx}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() =>
                                                    setCurrentPage(idx + 1)
                                                }
                                                className={`px-3 py-1 rounded ${
                                                    currentPage === idx + 1
                                                        ? "bg-amber-500 text-white"
                                                        : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                                                }`}
                                                initial={
                                                    currentPage === idx + 1
                                                        ? { scale: 1.1 }
                                                        : { scale: 1 }
                                                }
                                                animate={
                                                    currentPage === idx + 1
                                                        ? { scale: [1, 1.2, 1] }
                                                        : { scale: 1 }
                                                }
                                                transition={
                                                    currentPage === idx + 1
                                                        ? { duration: 0.5 }
                                                        : { duration: 0.2 }
                                                }
                                            >
                                                {idx + 1}
                                            </motion.button>
                                        )
                                    )}
                                </div>
                                <motion.button
                                    whileHover={
                                        currentPage !== totalPages
                                            ? { scale: 1.05 }
                                            : {}
                                    }
                                    whileTap={
                                        currentPage !== totalPages
                                            ? { scale: 0.95 }
                                            : {}
                                    }
                                    onClick={() =>
                                        setCurrentPage(currentPage + 1)
                                    }
                                    disabled={currentPage === totalPages}
                                    className={`px-3 py-1 rounded ${
                                        currentPage === totalPages
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                                    }`}
                                >
                                    Selanjutnya
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.section>
        </Layout>
    );
};

export default MenuPage;
