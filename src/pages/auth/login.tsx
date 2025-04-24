import { NextPage } from "next";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import AuthCard from "@/components/auth/AuthCard";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuthStore } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

const LoginSchema = z.object({
    email: z.string().email("Email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
});

type LoginFormData = z.infer<typeof LoginSchema>;

const Login: NextPage = () => {
    const router = useRouter();
    const { login } = useAuthStore();

    const { handleSubmit, register, formState } = useForm<LoginFormData>({
        resolver: zodResolver(LoginSchema),
    });

    const { mutate: loginMutate, isPending } = useMutation({
        mutationFn: async (data: LoginFormData) => {
            const response = await axiosInstance.post("/auth/login", data);
            return response.data;
        },
        onSuccess: (data) => {
            login(data.user, data.token);
            router.push("/");
            toast.success("Login sukses");
        },
        onError: (error) => {
            console.log("Login error", error);
            toast.error("Login gagal");
        },
    });

    const onSubmit = (data: LoginFormData) => {
        loginMutate(data);
    };

    return (
        <>
            <Head>
                <title>Login</title>
            </Head>

            <AuthCard title="Login ke Akun Anda">
                <form
                    className="mt-8 space-y-6"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="-space-y-px">
                        <div className="mb-4">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                autoComplete="email"
                                {...register("email")}
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                            />
                            {formState.errors.email && (
                                <p className="mt-1 text-sm text-red-600">
                                    {formState.errors.email.message}
                                </p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                {...register("password")}
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                            />
                            {formState.errors.password && (
                                <p className="mt-1 text-sm text-red-600">
                                    {formState.errors.password.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 mb-3"
                            >
                                {isPending ? "Loading..." : "Login"}
                            </button>
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Belum punya akun?{" "}
                                <Link
                                    href="/auth/register"
                                    className="font-medium text-amber-600 hover:text-amber-500"
                                >
                                    Daftar di sini
                                </Link>
                            </p>
                        </div>
                    </div>
                </form>
            </AuthCard>
        </>
    );
};

export default Login;
