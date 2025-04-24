import axiosInstance from "@/lib/axios";
import { MenuCategory } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export const useGetCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const response = await axiosInstance.get("/menu/categories");
            return response.data.data as MenuCategory[];
        },
    });
};
