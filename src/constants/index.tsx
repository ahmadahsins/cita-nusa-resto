import {
    LayoutDashboard,
    Users,
    BookOpen,
    CalendarClock,
    ShoppingCart,
    Table2,
} from "lucide-react";

const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    CONFIRMED: "bg-green-100 text-green-800 border-green-200",
    CANCELLED: "bg-red-100 text-red-800 border-red-200",
    COMPLETED: "bg-blue-100 text-blue-800 border-blue-200",
};

const statusLabels: Record<string, string> = {
    PENDING: "Menunggu Konfirmasi",
    CONFIRMED: "Dikonfirmasi",
    CANCELLED: "Dibatalkan",
    COMPLETED: "Selesai",
};

// Filter for booking status
const statusFilters = [
    { value: "", label: "Semua" },
    { value: "PENDING", label: "Menunggu Konfirmasi" },
    { value: "CONFIRMED", label: "Dikonfirmasi" },
    { value: "CANCELLED", label: "Dibatalkan" },
    { value: "COMPLETED", label: "Selesai" },
];

const dashboardNavItems = [
    {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
        title: "Pengguna",
        href: "/admin/users",
        icon: <Users className="h-5 w-5" />,
    },
    {
        title: "Menu",
        href: "/admin/menu",
        icon: <BookOpen className="h-5 w-5" />,
    },
    {
        title: "Reservasi",
        href: "/admin/bookings",
        icon: <CalendarClock className="h-5 w-5" />,
    },
    {
        title: "Pesanan",
        href: "/admin/orders",
        icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
        title: "Meja",
        href: "/admin/tables",
        icon: <Table2 className="h-5 w-5" />,
    },
];

const bestSellerMenu = [
    {
        id: "dummy-rendang-sapi",
        name: "Rendang Sapi",
        description:
            "Daging sapi yang dimasak dengan santan dan bumbu rendang khas Padang",
        price: 70000,
        image: "rendang-sapi.jpg",
        categoryId: "e5f8bae5-4273-44cf-a446-11f129d7a7f0",
        isAvailable: true,
        createdAt: "2025-04-21T03:23:44.893Z",
        updatedAt: "2025-04-21T03:23:44.893Z",
        category: {
            id: "e5f8bae5-4273-44cf-a446-11f129d7a7f0",
            name: "Hidangan Nusantara",
            createdAt: "2025-04-21T03:23:44.623Z",
            updatedAt: "2025-04-21T03:23:44.623Z",
        },
    },
    {
        id: "dummy-kakap-bakar-jimbaran",
        name: "Kakap Bakar Jimbaran",
        description: "Ikan kakap segar dibakar dengan bumbu Jimbaran khas Bali",
        price: 95000,
        image: "kakap-bakar.jpg",
        categoryId: "e951732e-bf99-4455-83a9-5017e945684a",
        isAvailable: true,
        createdAt: "2025-04-21T03:23:44.977Z",
        updatedAt: "2025-04-21T03:23:44.977Z",
        category: {
            id: "e951732e-bf99-4455-83a9-5017e945684a",
            name: "Hidangan Laut",
            createdAt: "2025-04-21T03:23:44.623Z",
            updatedAt: "2025-04-21T03:23:44.623Z",
        },
    },
    {
        id: "dummy-bebek-betutu",
        name: "Bebek Betutu",
        description:
            "Bebek yang dimasak dengan bumbu betutu dan dibungkus daun pisang",
        price: 90000,
        image: "bebek-betutu.jpg",
        categoryId: "f1657a12-55a3-4ee6-be27-c610cb8bd786",
        isAvailable: true,
        createdAt: "2025-04-21T03:23:44.940Z",
        updatedAt: "2025-04-21T03:23:44.940Z",
        category: {
            id: "f1657a12-55a3-4ee6-be27-c610cb8bd786",
            name: "Hidangan Bali",
            createdAt: "2025-04-21T03:23:44.623Z",
            updatedAt: "2025-04-21T03:23:44.623Z",
        },
    },
];

export {
    statusColors,
    statusLabels,
    statusFilters,
    dashboardNavItems,
    bestSellerMenu,
};
