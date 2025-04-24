import AuthCard from "@/components/auth/AuthCard";
import axiosInstance from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

const registerSchema = z
    .object({
        name: z.string().min(3, "Nama minimal 3 karakter"),
        email: z.string().email("Email tidak valid"),
        password: z.string().min(6, "Password minimal 6 karakter"),
        confirmPassword: z
            .string()
            .min(6, "Konfirmasi password minimal 6 karakter"),
        phone: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Password dan konfirmasi password tidak sama",
        path: ["confirmPassword"],
    });

type RegisterFormData = z.infer<typeof registerSchema>;

const Register: NextPage = () => {
    const router = useRouter();
    const { login } = useAuthStore();

    const { handleSubmit, register, formState } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const { mutate: registerMutate, isPending } = useMutation({
        mutationFn: async (data: RegisterFormData) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { confirmPassword, ...registerData } = data;
            const response = await axiosInstance.post(
                "/auth/register",
                registerData
            );
            return response.data;
        },
        onSuccess: (data) => {
            login(data.user, data.token);
            router.push("/");
            toast.success("Login sukses");
        },
        onError: (error) => {
            console.error("Registration error:", error);
            toast.error("Register gagal");
        },
    });

    const onSubmit = (data: RegisterFormData) => {
        registerMutate(data);
    };

    return (
        <>
            <Head>
                <title>Daftar</title>
            </Head>

            <AuthCard title="Daftar Akun Baru">
                <form
                    className="mt-8 space-y-6"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="-space-y-px">
                        <div className="mb-4">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Nama Lengkap
                            </label>
                            <input
                                id="name"
                                type="text"
                                autoComplete="name"
                                {...register("name")}
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                                placeholder="Nama Lengkap"
                            />
                            {formState.errors.name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {formState.errors.name.message}
                                </p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                {...register("email")}
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                                placeholder="Email"
                            />
                            {formState.errors.email && (
                                <p className="mt-1 text-sm text-red-600">
                                    {formState.errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="phone"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Nomor Telepon (Opsional)
                            </label>
                            <input
                                id="phone"
                                type="text"
                                autoComplete="tel"
                                {...register("phone")}
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                                placeholder="Nomor Telepon"
                            />
                            {formState.errors.phone && (
                                <p className="mt-1 text-sm text-red-600">
                                    {formState.errors.phone.message}
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
                                id="password"
                                type="password"
                                autoComplete="new-password"
                                {...register("password")}
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                            {formState.errors.password && (
                                <p className="mt-1 text-sm text-red-600">
                                    {formState.errors.password.message}
                                </p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Konfirmasi Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                {...register("confirmPassword")}
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                                placeholder="Konfirmasi Password"
                            />
                            {formState.errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">
                                    {formState.errors.confirmPassword.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                        >
                            {isPending ? "Loading..." : "Daftar"}
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Sudah punya akun?{" "}
                            <Link
                                href="/auth/login"
                                className="font-medium text-amber-600 hover:text-amber-500"
                            >
                                Login di sini
                            </Link>
                        </p>
                    </div>
                </form>
            </AuthCard>
        </>
    );
};

export default Register;
