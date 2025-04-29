import { OrderItem } from "@/types";

export function formatRupiah(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

export const calculateOrderTotal = (items: OrderItem[] | undefined) => {
    if (!items) return 0;
    return items.reduce((total, item) => {
        return total + item.menu.price * item.quantity;
    }, 0);
};
