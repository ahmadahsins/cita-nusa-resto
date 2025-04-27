import axiosInstance from "@/lib/axios";
import { DashboardStats } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useGetDashboardStats = ({
    isAuthenticated,
}: {
    isAuthenticated: boolean;
}) => {
    return useQuery<DashboardStats>({
        queryKey: ["dashboardStats"],
        queryFn: async () => {
            const response = await axiosInstance.get("/admin/dashboard-stats");
            return response.data.data;
        },
        enabled: isAuthenticated,
        placeholderData: {
            totalUsers: 0,
            totalBookings: 0,
            totalOrders: 0,
            totalMenuItems: 0,
            totalTables: 0,
            recentBookings: [],
            recentOrders: [],
        },
    });
};
