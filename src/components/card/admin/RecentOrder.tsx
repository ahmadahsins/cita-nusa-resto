const RecentOrder = ({
    orderNumber,
    date,
    time,
    items,
    total,
    status,
}: {
    orderNumber: string;
    date: string;
    time: string;
    items: number;
    total: string;
    status: string;
}) => {
    const statusColors: Record<string, string> = {
        PENDING: "bg-yellow-100 text-yellow-800",
        PROCESSING: "bg-blue-100 text-blue-800",
        SERVED: "bg-green-100 text-green-800",
        PAID: "bg-indigo-100 text-indigo-800",
        CANCELLED: "bg-red-100 text-red-800",
    };

    return (
        <div className="flex items-center justify-between py-3">
            <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-medium">
                    #{orderNumber.substring(0, 2)}
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                        Order #{orderNumber}
                    </p>
                    <p className="text-xs text-gray-500">
                        {date} • {time} • {items} item • {total}
                    </p>
                </div>
            </div>
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}
            >
                {status === "PENDING"
                    ? "Menunggu"
                    : status === "PROCESSING"
                    ? "Diproses"
                    : status === "SERVED"
                    ? "Disajikan"
                    : status === "PAID"
                    ? "Dibayar"
                    : "Dibatalkan"}
            </span>
        </div>
    );
};

export default RecentOrder;