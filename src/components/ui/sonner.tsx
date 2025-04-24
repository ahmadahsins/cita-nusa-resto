import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "system" } = useTheme();

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group"
            closeButton
            toastOptions={{
                classNames: {
                    toast: "group border-2 border-amber-200 bg-amber-50 text-amber-900 font-medium",
                    title: "text-amber-900 font-bold",
                    description: "text-amber-800",
                    actionButton: "bg-amber-600 text-white hover:bg-amber-700",
                    cancelButton:
                        "bg-white text-amber-900 border border-amber-200 hover:bg-amber-50",
                    closeButton: "text-amber-700 hover:text-amber-900",
                    success: "border-green-200 bg-green-50 text-green-800",
                    error: "border-red-200 bg-red-50 text-red-800",
                    info: "border-blue-200 bg-blue-50 text-blue-800",
                    warning: "border-yellow-200 bg-yellow-50 text-yellow-800",
                },
                duration: 4000,
            }}
            {...props}
        />
    );
};

export { Toaster };
