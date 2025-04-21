import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export function useAuth(redirectTo = "/auth/login") {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const [isHydrated, setIsHydrated] = useState(false);

    // Efek untuk menandai bahwa hydration sudah selesai
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        // Hanya lakukan redirect jika hydration sudah selesai
        if (isHydrated && !isAuthenticated) {
            router.push(redirectTo);
        }
    }, [isAuthenticated, router, redirectTo, isHydrated]);

    return { isAuthenticated, isHydrated };
}

export function useAdmin(redirectTo = "/") {
    const router = useRouter();
    const { isAuthenticated, user } = useAuthStore();
    const [isHydrated, setIsHydrated] = useState(false);

    // Efek untuk menandai bahwa hydration sudah selesai
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        // Hanya lakukan redirect jika hydration sudah selesai
        if (!isHydrated) return;

        if (!isAuthenticated) {
            router.push("/auth/login");
            return;
        }

        if (user?.role !== "admin") {
            router.push(redirectTo);
        }
    }, [isAuthenticated, user, router, redirectTo, isHydrated]);

    return { isAuthenticated, isAdmin: user?.role === "admin", isHydrated };
}
