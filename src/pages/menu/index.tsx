import { useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Menu, MenuCategory } from "@prisma/client";
import { formatRupiah } from "@/utils";
import { playfair } from "../_app";
import Layout from "@/components/layout/Layout";
import { useGetMenu } from "@/hooks/useGetMenu";
import { useGetCategories } from "@/hooks/useGetCategories";

interface MenuWithCategory extends Menu {
    category: MenuCategory;
}

const MenuPage: NextPage = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    const { data: menuItems, isLoading } = useGetMenu();
    const { data: categories } = useGetCategories();

    const filteredMenuItems =
        selectedCategory === "all"
            ? menuItems
            : menuItems?.filter(
                  (item: MenuWithCategory) =>
                      item.categoryId === selectedCategory
              );

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
                <div className="absolute inset-0 bg-black/50 z-10" />
                <div className="relative h-full">
                    <Image
                        src="/images/menu-hero.jpg"
                        alt="Menu Cita Nusa Resto"
                        layout="fill"
                        objectFit="cover"
                        priority
                    />
                </div>
                <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-4">
                    <div className="max-w-3xl">
                        <h1
                            className={`text-4xl md:text-5xl font-bold text-white mb-4 ${playfair.className}`}
                        >
                            Menu Kami
                        </h1>
                        <p className="text-lg md:text-xl text-white">
                            Nikmati berbagai hidangan autentik Nusantara yang
                            menggugah selera
                        </p>
                    </div>
                </div>
            </section>

            {/* Menu Content */}
            <section className="pt-12 pb-24 px-4 bg-amber-50">
                <div className="container mx-auto">
                    {/* Category Filter */}
                    <div className="mb-10">
                        <h2
                            className={`text-3xl font-bold text-amber-900 text-center mb-8 ${playfair.className}`}
                        >
                            Pilih Kategori
                        </h2>
                        <div className="flex flex-wrap justify-center gap-3">
                            <button
                                onClick={() => setSelectedCategory("all")}
                                className={`px-5 py-2 rounded-md text-sm font-medium transition-colors 
                  ${
                      selectedCategory === "all"
                          ? "bg-amber-600 text-white"
                          : "bg-white text-amber-800 hover:bg-amber-100"
                  }`}
                            >
                                Semua Menu
                            </button>

                            {categories?.map((category) => (
                                <button
                                    key={category.id}
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
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Menu Items */}
                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-amber-600 border-t-transparent"></div>
                            <p className="mt-4 text-amber-800">
                                Memuat menu...
                            </p>
                        </div>
                    ) : (filteredMenuItems as MenuWithCategory[]).length ===
                      0 ? (
                        <div className="text-center py-12">
                            <p className="text-amber-800 text-lg">
                                Tidak ada menu yang tersedia dalam kategori ini.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {(filteredMenuItems as MenuWithCategory[]).map(
                                (menu) => (
                                    <div
                                        key={menu.id}
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
                                            <div className="absolute top-4 right-4 bg-amber-600 text-white px-3 py-1 rounded-full text-sm">
                                                {menu.category.name}
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <h3 className="text-xl font-bold text-amber-900">
                                                {menu.name}
                                            </h3>
                                            <p className="text-gray-600 mt-2 text-sm line-clamp-2">
                                                {menu.description}
                                            </p>
                                            <div className="mt-4 flex items-center justify-between">
                                                <span className="text-lg font-bold text-amber-700">
                                                    {formatRupiah(menu.price)}
                                                </span>
                                                <span
                                                    className={`px-2 py-1 rounded text-xs ${
                                                        menu.isAvailable
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {menu.isAvailable
                                                        ? "Tersedia"
                                                        : "Habis"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    );
};

export default MenuPage;
