import { OrderStatus } from "@prisma/client";

const RecentOrder = ({
    name,
    date,
    time,
    items,
    total,
    status,
}: {
    name: string;
    date: string;
    time: string;
    items: number;
    total: number;
    status: OrderStatus;
}) => {
    const statusColors: Record<OrderStatus, string> = {
        PENDING: "bg-yellow-100 text-yellow-800",
        PREPARING: "bg-blue-100 text-blue-800",
        COMPLETED: "bg-green-100 text-green-800",
        CANCELLED: "bg-red-100 text-red-800",
    };

    return (
        <div className="flex items-center justify-between py-3">
            <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-medium">
                    {name.substring(0, 1)}
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{name}</p>
                    <p className="text-xs text-gray-500">
                        {date} • {time} • {items} item •{" "}
                        {total.toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                        })}
                    </p>
                </div>
            </div>
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}
            >
                {status === "PENDING"
                    ? "Menunggu"
                    : status === "PREPARING"
                      ? "Diproses"
                      : status === "COMPLETED"
                        ? "Selesai"
                        : "Dibatalkan"}
            </span>
        </div>
    );
};

export default RecentOrder;
