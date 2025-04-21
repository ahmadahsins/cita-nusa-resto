import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { LoaderCircle } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const profileSchema = z.object({
    name: z.string().min(3, "Nama minimal 3 karakter"),
    email: z.string().email("Email tidak valid"),
    phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfileForm = ({
    user,
}: {
    user: { name: string; email: string; phone: string };
}) => {
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const { updateUser } = useAuthStore();

    const { register, handleSubmit, formState, reset } =
        useForm<ProfileFormData>({
            resolver: zodResolver(profileSchema),
            defaultValues: {
                name: "",
                email: "",
                phone: "",
            },
        });

    // Update form ketika data user berubah
    useEffect(() => {
        if (user) {
            reset({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
            });
        }
    }, [user, reset]);

    const { mutate: profileMutate, isPending } = useMutation({
        mutationFn: async (data: ProfileFormData) => {
            const response = await axiosInstance.patch("/profile", data);
            return response.data;
        },
        onSuccess: (data) => {
            setIsEdit(false);
            if (data.user) {
                updateUser({
                    name: data.user.name,
                    email: data.user.email,
                    phone: data.user.phone,
                });
            }
            toast.success("Profil berhasil diperbarui");
        },
        onError: () => {
            toast.error("Profil gagal diperbarui");
        },
    });

    const onSubmit = (data: ProfileFormData) => {
        profileMutate(data);
    };

    return (
        <>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                    <div className="mb-4">
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Nama Lengkap
                        </label>
                        <input
                            type="text"
                            id="name"
                            autoComplete="name"
                            readOnly={!isEdit}
                            {...register("name")}
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                            placeholder="Email"
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
                            type="email"
                            id="email"
                            autoComplete="email"
                            readOnly={!isEdit}
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
                            Nomor Telepon
                        </label>
                        <input
                            type="text"
                            id="phone"
                            readOnly={!isEdit}
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
                </div>

                <div className="mt-8">
                    {isEdit && (
                        <button
                            type="submit"
                            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded"
                        >
                            {isPending ? (
                                <LoaderCircle className="animate-spin" />
                            ) : (
                                "Simpan Perubahan"
                            )}
                        </button>
                    )}
                </div>
            </form>
            {!isEdit && (
                <button
                    type="button"
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded"
                    onClick={() => setIsEdit(true)}
                >
                    Edit Profil
                </button>
            )}
        </>
    );
};

export default ProfileForm;
