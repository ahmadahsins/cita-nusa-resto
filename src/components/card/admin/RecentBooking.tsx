const RecentBooking = ({
    name,
    date,
    time,
    guests,
    status,
}: {
    name: string;
    date: string;
    time: string;
    guests: number;
    status: string;
}) => {
    const statusColors: Record<string, string> = {
        PENDING: "bg-yellow-100 text-yellow-800",
        CONFIRMED: "bg-green-100 text-green-800",
        CANCELLED: "bg-red-100 text-red-800",
        COMPLETED: "bg-blue-100 text-blue-800",
    };

    return (
        <div className="flex items-center justify-between py-3">
            <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-medium">
                    {name.charAt(0)}
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{name}</p>
                    <p className="text-xs text-gray-500">
                        {date} • {time} • {guests} orang
                    </p>
                </div>
            </div>
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}
            >
                {status === "PENDING"
                    ? "Menunggu"
                    : status === "CONFIRMED"
                    ? "Terkonfirmasi"
                    : status === "CANCELLED"
                    ? "Dibatalkan"
                    : "Selesai"}
            </span>
        </div>
    );
};

export default RecentBooking;
