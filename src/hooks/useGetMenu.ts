import axiosInstance from "@/lib/axios";
import { Menu, MenuCategory } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

interface MenuWithCategory extends Menu {
    category: MenuCategory;
}

export const useGetMenu = () => {
    return useQuery({
        queryKey: ["menu"],
        queryFn: async () => {
            const response = await axiosInstance.get("/menus");
            return response.data.data as MenuWithCategory[];
        },
    });
};
