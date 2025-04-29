import { BookingStatus, Menu, OrderStatus } from "@prisma/client";

export interface BookingDetail {
    id: string;
    dateTime: string;
    status: BookingStatus;
    guestCount: number;
    specialRequest?: string;
    duration: number;
    createdAt: string;
    updatedAt: string;
    userId: string;
    tableId: string;
    user: {
        id: string;
        name: string;
        email: string;
        phone: string;
    };
    table: {
        id: string;
        tableNumber: number;
        capacity: number;
    };
    orders: Order[];
}

// Type for booking
export interface Booking {
    id: string;
    dateTime: string;
    status: BookingStatus;
    guestCount: number;
    duration: number;
    specialRequest?: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    tableId: string;
    user: {
        id: string;
        name: string;
        email: string;
        phone: string;
    };
    table: {
        id: string;
        tableNumber: number;
        capacity: number;
    };
}

export type BookingWithRelations = Booking & {
    user: {
        id: string;
        name: string;
        email: string;
        phone: string | null;
    };
    table: {
        id: string;
        tableNumber: number;
        capacity: number;
        createdAt?: Date;
        updatedAt?: Date;
    };
};

export type MenuItem = Menu & {
    category: {
        id: string;
        name: string;
        createdAt?: Date;
        updatedAt?: Date;
    };
};

export type Order = {
    id: string;
    status: OrderStatus;
    createdAt: string;
    updatedAt: string;
    booking: {
        id: string;
        dateTime: string;
        guestCount: number;
        table: {
            id: string;
            tableNumber: number;
            capacity: number;
        };
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
    };
    items: OrderItem[];
};

export type OrderItem = {
    id: string;
    quantity: number;
    notes?: string;
    menu: {
        id: string;
        name: string;
        price: number;
        description: string;
        image: string;
        isAvailable: boolean;
    };
};

export interface DashboardStats {
    totalUsers: number;
    totalBookings: number;
    totalOrders: number;
    totalMenuItems: number;
    totalTables: number;
    recentBookings: Array<{
        id: string;
        user: {
            name: string;
        };
        dateTime: string;
        guestCount: number;
        status: string;
    }>;
    recentOrders: Order[];
}
