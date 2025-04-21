import AuthCard from "@/components/auth/AuthCard";
import Layout from "@/components/layout/Layout";
import ProfileForm from "@/components/profile/ProfileForm";
import { useAuth } from "@/hooks/useAuth";
import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { NextPage } from "next";
import Head from "next/head";

const Profile: NextPage = () => {
    const { isAuthenticated } = useAuth();

    const { data: user } = useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const response = await axiosInstance.get("/profile");
            return response.data.user;
        },
        enabled: isAuthenticated,
    });

    if (!isAuthenticated) return null;

    return (
        <Layout>
            <Head>
                <title>Profil - Cita Nusa Resto</title>
            </Head>

            <AuthCard title="Profil Anda">
                <ProfileForm user={user} />
            </AuthCard>
        </Layout>
    );
};

export default Profile;
