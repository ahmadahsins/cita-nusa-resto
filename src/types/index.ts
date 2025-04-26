import { BookingStatus, Order } from "@prisma/client";

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
    recentOrders: Array<{
        id: string;
        dateTime: string;
        totalPrice: number;
        itemCount: number;
        status: string;
    }>;
}
