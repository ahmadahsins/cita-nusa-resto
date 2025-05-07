import { MenuCategory } from "@prisma/client";
import { hash } from "bcryptjs";

/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // Seed users
    await seedUsers();

    // Seed menu categories
    const categories = await seedMenuCategories();

    // Seed menus
    await seedMenus(categories);

    // Seed tables
    await seedTables();

    console.log("✅ Seeding completed!");
}

async function seedUsers() {
    console.log('Seeding users...');
    
    // Create admin user
    const adminPassword = await hash('admin123', 10);
    await prisma.user.upsert({
      where: { email: 'admin@citanusa.com' },
      update: {},
      create: {
        name: 'Admin Cita Nusa',
        email: 'admin@citanusa.com',
        password: adminPassword,
        phone: '081234567890',
        role: 'ADMIN',
      },
    });
  
    // Create staff user
    const staffPassword = await hash('staff123', 10);
    await prisma.user.upsert({
      where: { email: 'staff@citanusa.com' },
      update: {},
      create: {
        name: 'Staff Cita Nusa',
        email: 'staff@citanusa.com',
        password: staffPassword,
        phone: '081234567891',
        role: 'STAFF',
      },
    });
  
    // Create customer user
    const customerPassword = await hash('customer123', 10);
    await prisma.user.upsert({
      where: { email: 'customer@example.com' },
      update: {},
      create: {
        name: 'Pelanggan Setia',
        email: 'customer@example.com',
        password: customerPassword,
        phone: '081234567892',
        role: 'CUSTOMER',
      },
    });
  }

async function seedMenuCategories() {
    console.log("Seeding menu categories...");

    const categories = [
        { name: "Makanan Pembuka" },
        { name: "Hidangan Utama" },
        { name: "Hidangan Nusantara" },
        { name: "Hidangan Bali" },
        { name: "Hidangan Laut" },
        { name: "Minuman" },
        { name: "Dessert" },
    ];

    const categoryPromises = categories.map(async (category) => {
        return prisma.menuCategory.upsert({
            where: { name: category.name },
            update: {},
            create: {
                name: category.name,
            },
        });
    });

    return Promise.all(categoryPromises);
}

async function seedMenus(categories: MenuCategory[]) {
    console.log("Seeding menus...");

    // Mapping category names to IDs for easier reference
    const categoryMap = categories.reduce((map, category) => {
        map[category.name] = category.id;
        return map;
    }, {} as Record<string, string>);

    // Makanan Pembuka
    const appetizers = [
        {
            name: "Lumpia Semarang",
            description:
                "Lumpia dengan isian rebung dan udang segar khas Semarang",
            price: 35000,
            image: "lumpia-semarang.jpg",
            categoryId: categoryMap["Makanan Pembuka"],
            isAvailable: true,
        },
        {
            name: "Sate Lilit",
            description: "Sate ikan khas Bali yang dibumbui rempah tradisional",
            price: 45000,
            image: "sate-lilit.jpg",
            categoryId: categoryMap["Makanan Pembuka"],
            isAvailable: true,
        },
        {
            name: "Tahu Telor",
            description:
                "Tahu goreng dengan telur dan saus kacang khas Jawa Timur",
            price: 30000,
            image: "tahu-telor.jpg",
            categoryId: categoryMap["Makanan Pembuka"],
            isAvailable: true,
        },
        {
            name: "Siomay Bandung",
            description:
                "Siomay ikan tenggiri dengan pelengkap kentang, pare, dan tahu",
            price: 35000,
            image: "siomay-bandung.jpg",
            categoryId: categoryMap["Makanan Pembuka"],
            isAvailable: true,
        },
        {
            name: "Perkedel Jagung",
            description: "Bakwan jagung manis dengan campuran bumbu dan rempah",
            price: 25000,
            image: "perkedel-jagung.jpg",
            categoryId: categoryMap["Makanan Pembuka"],
            isAvailable: true,
        },
        {
            name: "Sambal Udang Petai",
            description:
                "Udang dan petai yang dimasak dengan sambal merah pedas",
            price: 50000,
            image: "sambal-udang-petai.jpg",
            categoryId: categoryMap["Makanan Pembuka"],
            isAvailable: true,
        },
    ];

    // Hidangan Utama
    const mainCourses = [
        {
            name: "Nasi Goreng Kambing",
            description:
                "Nasi goreng dengan daging kambing empuk dan rempah pilihan",
            price: 65000,
            image: "nasi-goreng-kambing.jpg",
            categoryId: categoryMap["Hidangan Utama"],
            isAvailable: true,
        },
        {
            name: "Buntut Bakar",
            description: "Buntut sapi bakar dengan bumbu khas dan sup kaldu",
            price: 95000,
            image: "buntut-bakar.jpg",
            categoryId: categoryMap["Hidangan Utama"],
            isAvailable: true,
        },
        {
            name: "Soto Ayam Lamongan",
            description: "Soto ayam khas Lamongan dengan bumbu kuning dan koya",
            price: 45000,
            image: "soto-ayam-lamongan.jpg",
            categoryId: categoryMap["Hidangan Utama"],
            isAvailable: true,
        },
        {
            name: "Mie Aceh",
            description: "Mie tebal dengan bumbu rempah khas Aceh dan seafood",
            price: 60000,
            image: "mie-aceh.jpg",
            categoryId: categoryMap["Hidangan Utama"],
            isAvailable: true,
        },
        {
            name: "Bebek Goreng Sambal Matah",
            description: "Bebek goreng renyah dengan sambal matah khas Bali",
            price: 75000,
            image: "bebek-goreng.jpg",
            categoryId: categoryMap["Hidangan Utama"],
            isAvailable: true,
        },
        {
            name: "Ikan Bakar Jimbaran",
            description: "Ikan bakar segar dengan bumbu Jimbaran dan sambal",
            price: 85000,
            image: "ikan-bakar-jimbaran.jpg",
            categoryId: categoryMap["Hidangan Utama"],
            isAvailable: true,
        },
    ];

    // Hidangan Nusantara
    const nusantaraFood = [
        {
            name: "Rendang Sapi",
            description:
                "Daging sapi yang dimasak dengan santan dan bumbu rendang khas Padang",
            price: 70000,
            image: "rendang-sapi.jpg",
            categoryId: categoryMap["Hidangan Nusantara"],
            isAvailable: true,
        },
        {
            name: "Gudeg Jogja",
            description:
                "Nangka muda yang dimasak dengan santan dan gula merah khas Yogyakarta",
            price: 55000,
            image: "gudeg-jogja.jpg",
            categoryId: categoryMap["Hidangan Nusantara"],
            isAvailable: true,
        },
        {
            name: "Pempek Palembang",
            description: "Pempek ikan dengan kuah cuka khas Palembang",
            price: 50000,
            image: "pempek-palembang.jpg",
            categoryId: categoryMap["Hidangan Nusantara"],
            isAvailable: true,
        },
        {
            name: "Ayam Betutu",
            description: "Ayam yang dimasak dengan bumbu betutu khas Bali",
            price: 65000,
            image: "ayam-betutu.jpg",
            categoryId: categoryMap["Hidangan Nusantara"],
            isAvailable: true,
        },
        {
            name: "Rawon Surabaya",
            description: "Sup daging dengan bumbu kluwek khas Surabaya",
            price: 60000,
            image: "rawon-surabaya.jpg",
            categoryId: categoryMap["Hidangan Nusantara"],
            isAvailable: true,
        },
        {
            name: "Sate Padang",
            description: "Sate daging sapi dengan kuah kuning khas Padang",
            price: 55000,
            image: "sate-padang.jpg",
            categoryId: categoryMap["Hidangan Nusantara"],
            isAvailable: true,
        },
    ];

    // Hidangan Bali
    const baliFood = [
        {
            name: "Babi Guling",
            description: "Babi utuh yang dipanggang dengan bumbu khas Bali",
            price: 85000,
            image: "babi-guling.jpg",
            categoryId: categoryMap["Hidangan Bali"],
            isAvailable: true,
        },
        {
            name: "Lawar",
            description:
                "Campuran sayuran, daging, dan rempah tradisional Bali",
            price: 60000,
            image: "lawar.jpg",
            categoryId: categoryMap["Hidangan Bali"],
            isAvailable: true,
        },
        {
            name: "Bebek Betutu",
            description:
                "Bebek yang dimasak dengan bumbu betutu dan dibungkus daun pisang",
            price: 90000,
            image: "bebek-betutu.jpg",
            categoryId: categoryMap["Hidangan Bali"],
            isAvailable: true,
        },
        {
            name: "Nasi Campur Bali",
            description:
                "Nasi dengan berbagai lauk khas Bali seperti ayam suwir, sate lilit, dan sambal matah",
            price: 65000,
            image: "nasi-campur-bali.jpg",
            categoryId: categoryMap["Hidangan Bali"],
            isAvailable: true,
        },
        {
            name: "Tum Ayam",
            description: "Ayam bumbu yang dibungkus daun pisang dan dikukus",
            price: 55000,
            image: "tum-ayam.jpg",
            categoryId: categoryMap["Hidangan Bali"],
            isAvailable: true,
        },
        {
            name: "Sate Plecing",
            description: "Sate ikan dengan bumbu plecing khas Bali",
            price: 60000,
            image: "sate-plecing.jpg",
            categoryId: categoryMap["Hidangan Bali"],
            isAvailable: true,
        },
    ];

    const seafood = [
        {
            name: "Cumi Bakar",
            description: "Cumi yang dibakar dengan bumbu khas laut",
            price: 70000,
            image: "cumi-bakar.jpg",
            categoryId: categoryMap["Hidangan Laut"],
            isAvailable: true,
        },
        {
            name: "Cumi Sambal Matah",
            description:
                "Cumi segar yang digoreng dengan sambal matah khas Bali",
            price: 75000,
            image: "cumi-sambal-matah.jpg",
            categoryId: categoryMap["Hidangan Laut"],
            isAvailable: true,
        },
        {
            name: "Udang Bakar",
            description: "Udang yang dibakar dengan bumbu khas laut",
            price: 65000,
            image: "udang-bakar.jpg",
            categoryId: categoryMap["Hidangan Laut"],
            isAvailable: true,
        },
        {
            name: "Udang Saus Padang",
            description:
                "Udang segar dimasak dengan saus padang pedas dan aromatik",
            price: 85000,
            image: "udang-saus-padang.jpg",
            categoryId: categoryMap["Hidangan Laut"],
            isAvailable: true,
        },
        {
            name: "Ikan Teri",
            description: "Ikan teri yang dimasak dengan bumbu khas laut",
            price: 60000,
            image: "ikan-teri.jpg",
            categoryId: categoryMap["Hidangan Laut"],
            isAvailable: true,
        },
        {
            name: "Kakap Bakar Jimbaran",
            description:
                "Ikan kakap segar dibakar dengan bumbu Jimbaran khas Bali",
            price: 95000,
            image: "kakap-bakar.jpg",
            categoryId: categoryMap["Hidangan Laut"],
            isAvailable: true,
        },
    ];

    // Minuman
    const drinks = [
        {
            name: "Es Daluman",
            description:
                "Minuman dingin khas Bali dengan cincau hijau dan sirup",
            price: 25000,
            image: "es-daluman.jpg",
            categoryId: categoryMap["Minuman"],
            isAvailable: true,
        },
        {
            name: "Jamu Kunyit Asam",
            description: "Minuman tradisional dari kunyit dan asam jawa",
            price: 20000,
            image: "jamu-kunyit.jpg",
            categoryId: categoryMap["Minuman"],
            isAvailable: true,
        },
        {
            name: "Es Cendol",
            description: "Minuman manis dengan cendol, santan, dan gula merah",
            price: 22000,
            image: "es-cendol.jpg",
            categoryId: categoryMap["Minuman"],
            isAvailable: true,
        },
        {
            name: "Kopi Bali",
            description: "Kopi hitam kental khas Bali dengan aroma khas",
            price: 18000,
            image: "kopi-bali.jpg",
            categoryId: categoryMap["Minuman"],
            isAvailable: true,
        },
        {
            name: "Teh Tarik",
            description: 'Teh susu yang "ditarik" hingga berbusa',
            price: 20000,
            image: "teh-tarik.jpg",
            categoryId: categoryMap["Minuman"],
            isAvailable: true,
        },
        {
            name: "Wedang Jahe",
            description: "Minuman jahe hangat dengan rempah dan gula merah",
            price: 18000,
            image: "wedang-jahe.jpg",
            categoryId: categoryMap["Minuman"],
            isAvailable: true,
        },
    ];

    // Dessert
    const desserts = [
        {
            name: "Klepon",
            description: "Kue bola dari tepung ketan dengan isian gula merah",
            price: 25000,
            image: "klepon.jpg",
            categoryId: categoryMap["Dessert"],
            isAvailable: true,
        },
        {
            name: "Kue Dadar Gulung",
            description:
                "Dadar gulung hijau dengan isian kelapa dan gula merah",
            price: 25000,
            image: "dadar-gulung.jpg",
            categoryId: categoryMap["Dessert"],
            isAvailable: true,
        },
        {
            name: "Pisang Goreng",
            description: "Pisang raja yang digoreng dengan tepung crispy",
            price: 22000,
            image: "pisang-goreng.jpg",
            categoryId: categoryMap["Dessert"],
            isAvailable: true,
        },
        {
            name: "Es Campur",
            description:
                "Campuran buah, cincau, dan jelly dengan sirup dan santan",
            price: 30000,
            image: "es-campur.jpg",
            categoryId: categoryMap["Dessert"],
            isAvailable: true,
        },
        {
            name: "Bubur Sumsum",
            description: "Bubur tepung beras dengan saus gula merah",
            price: 20000,
            image: "bubur-sumsum.jpg",
            categoryId: categoryMap["Dessert"],
            isAvailable: true,
        },
        {
            name: "Kue Lapis",
            description: "Kue lapis warna-warni dari tepung beras dan santan",
            price: 20000,
            image: "kue-lapis.jpg",
            categoryId: categoryMap["Dessert"],
            isAvailable: true,
        },
    ];

    // Combine all menus
    const allMenus = [
        ...appetizers,
        ...mainCourses,
        ...nusantaraFood,
        ...baliFood,
        ...seafood,
        ...drinks,
        ...desserts,
    ];

    // Seed menus
    for (const menu of allMenus) {
        await prisma.menu.upsert({
            where: {
                id: `dummy-${menu.name.toLowerCase().replace(/\s+/g, "-")}`,
            },
            update: {},
            create: {
                id: `dummy-${menu.name.toLowerCase().replace(/\s+/g, "-")}`,
                name: menu.name,
                description: menu.description,
                price: menu.price,
                image: menu.image,
                categoryId: menu.categoryId,
                isAvailable: menu.isAvailable,
            },
        });
    }
}

async function seedTables() {
    console.log("Seeding tables...");

    const tables = [
        { tableNumber: 1, capacity: 2, isAvailable: true },
        { tableNumber: 2, capacity: 2, isAvailable: true },
        { tableNumber: 3, capacity: 4, isAvailable: true },
        { tableNumber: 4, capacity: 4, isAvailable: true },
        { tableNumber: 5, capacity: 4, isAvailable: true },
        { tableNumber: 6, capacity: 6, isAvailable: true },
        { tableNumber: 7, capacity: 6, isAvailable: true },
        { tableNumber: 8, capacity: 8, isAvailable: true },
        { tableNumber: 9, capacity: 8, isAvailable: true },
        { tableNumber: 10, capacity: 10, isAvailable: true },
        { tableNumber: 11, capacity: 12, isAvailable: true },
        { tableNumber: 12, capacity: 4, isAvailable: true },
    ];

    for (const table of tables) {
        await prisma.table.upsert({
            where: { tableNumber: table.tableNumber },
            update: {},
            create: {
                tableNumber: table.tableNumber,
                capacity: table.capacity,
                isAvailable: table.isAvailable,
            },
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
