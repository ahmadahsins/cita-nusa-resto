import { Resend } from "resend";
import BookingConfirmationEmail from "@/emails/booking-information";

interface SendBookingConfirmationParams {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    booking: any;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingConfirmationEmail({
    booking,
}: SendBookingConfirmationParams) {
    const { user, table } = booking;

    try {
        // Validasi environment variables
        if (!process.env.RESEND_API_KEY) {
            throw new Error("RESEND_API_KEY is not defined");
        }

        if (!process.env.EMAIL_FROM) {
            throw new Error("EMAIL_FROM is not defined");
        }

        // Untuk testing dan development, kirim ke email sendiri
        // Untuk production, kirim ke email pelanggan
        const emailTo =
            process.env.NODE_ENV === "production"
                ? user.email
                : "ahmadahsin006@gmail.com"; // Ganti dengan email Anda

        const data = await resend.emails.send({
            to: emailTo,
            from: process.env.EMAIL_FROM,
            subject: "Konfirmasi Reservasi - Cita Nusa Resto",
            react: (
                <BookingConfirmationEmail
                    bookingId={booking.id}
                    customerName={user.name}
                    dateTime={booking.dateTime.toString()}
                    tableNumber={table.tableNumber}
                    guestCount={booking.guestCount}
                    duration={booking.duration}
                    specialRequest={booking.specialRequest || undefined}
                />
            ),
        });

        console.log("Email sent successfully:", data);
        return { success: true, data };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error };
    }
}
