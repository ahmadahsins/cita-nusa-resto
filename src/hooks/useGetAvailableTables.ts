import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetAvailableTables = ({
    formattedDate,
    formattedTime,
    watchGuestCount,
}: {
    formattedDate: string;
    formattedTime: string;
    watchGuestCount: number;
}) => {
    return useQuery({
        queryKey: [
            "availableTables",
            formattedDate,
            formattedTime,
            watchGuestCount,
        ],
        queryFn: async () => {
            const response = await axiosInstance.get(
                "/tables/available?date=${formattedDate}&time=${formattedTime}&guestCount=${watchGuestCount}"
            );
            return response.data;
        },
    });
};
