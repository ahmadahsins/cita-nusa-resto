import { ChevronRight } from "lucide-react";
import Link from "next/link";

// Dashboard stat card component
const StatCard = ({
    title,
    value,
    icon,
    iconBg,
    link,
}: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    iconBg: string;
    link: string;
}) => (
    <Link href={link}>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                        {value}
                    </p>
                </div>
                <div className={`p-3 rounded-full ${iconBg}`}>{icon}</div>
            </div>
            <div className="mt-4 flex items-center text-sm text-amber-600 font-medium">
                <span>Lihat detail</span>
                <ChevronRight className="ml-1 h-4 w-4" />
            </div>
        </div>
    </Link>
);

export default StatCard;
