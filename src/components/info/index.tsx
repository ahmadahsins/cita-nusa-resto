import { Booking } from "@/types";

const BookingInfo = ({
    bookings,
    booking,
}: {
    bookings?: Booking[];
    booking?: Booking;
}) => {
    if (
        bookings === undefined &&
        booking !== undefined &&
        booking.status !== "PENDING"
    )
        return null;
    return (
        <div
            className={`${bookings !== undefined ? "bg-white" : "bg-amber-50"} p-6 rounded-lg mb-8`}
        >
            <h2 className="text-xl font-semibold text-amber-800 mb-4">
                Informasi Penting
            </h2>
            <ul className="text-gray-700 space-y-2 text-left">
                {bookings === undefined &&
                    (booking === undefined ||
                        booking?.status === "PENDING") && (
                        <li className="flex items-start">
                            <span className="text-amber-600 mr-2">•</span>
                            <span>
                                Silahkan melakukan check-in terlebih dahulu
                                menggunakan ID reservasi Anda yang kami kirimkan
                                lewat email.
                            </span>
                        </li>
                    )}
                <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span>
                        Saat check-in, Anda dapat langsung melakukan pemesanan
                        menu melalui staff kami.
                    </span>
                </li>
                <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span>Mohon datang 10 menit sebelum waktu reservasi.</span>
                </li>
                <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span>
                        Jika Anda ingin membatalkan atau mengubah reservasi,
                        silakan lakukan minimal 3 jam sebelum waktu reservasi.
                    </span>
                </li>
            </ul>
        </div>
    );
};

export default BookingInfo;
