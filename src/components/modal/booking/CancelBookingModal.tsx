import { format } from "date-fns";
import { Loader2, X } from "lucide-react";
import { id } from "date-fns/locale";
import { BookingDetail } from "@/types";
import { Dispatch, SetStateAction } from "react";

const CancelBookingModal = ({
    setShowCancelModal,
    booking,
    handleCancelBooking,
    isPending,
}: {
    setShowCancelModal: Dispatch<SetStateAction<boolean>>;
    booking: BookingDetail;
    handleCancelBooking: () => void;
    isPending: boolean;
}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-xl font-extrabold text-amber-900`}>
                        Konfirmasi Pembatalan
                    </h3>
                    <button
                        onClick={() => setShowCancelModal(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="mb-6">
                    <p className="text-gray-700 mb-4">
                        Apakah Anda yakin ingin membatalkan reservasi ini?
                        Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <div className="bg-yellow-50 p-3 rounded-md text-yellow-800 text-sm mb-2">
                        <p>
                            Tanggal:{" "}
                            {format(
                                new Date(booking?.dateTime),
                                "dd MMMM yyyy",
                                { locale: id }
                            )}
                        </p>
                        <p>
                            Waktu:{" "}
                            {format(new Date(booking?.dateTime), "HH:mm", {
                                locale: id,
                            })}{" "}
                            WIB
                        </p>
                        <p>
                            Meja #{booking?.table.tableNumber} untuk{" "}
                            {booking?.guestCount} orang
                        </p>
                    </div>
                </div>
                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                    <button
                        onClick={() => setShowCancelModal(false)}
                        className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 py-2 px-4 rounded-md font-medium"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleCancelBooking}
                        disabled={isPending}
                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium flex items-center justify-center"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                <span>Memproses...</span>
                            </>
                        ) : (
                            "Ya, batalkan reservasi"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancelBookingModal;
