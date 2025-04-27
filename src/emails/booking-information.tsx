import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Button,
    Hr,
    Link,
} from "@react-email/components";
import * as React from "react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface BookingConfirmationEmailProps {
    bookingId: string;
    customerName: string;
    dateTime: string;
    tableNumber: number;
    guestCount: number;
    duration: number;
    specialRequest?: string;
}

export const BookingConfirmationEmail = ({
    bookingId,
    customerName,
    dateTime,
    tableNumber,
    guestCount,
    duration,
    specialRequest,
}: BookingConfirmationEmailProps) => {
    const formattedDate = format(new Date(dateTime), "EEEE, dd MMMM yyyy", {
        locale: localeId,
    });
    const formattedTime = format(new Date(dateTime), "HH:mm", {
        locale: localeId,
    });

    return (
        <Html>
            <Head />
            <Preview>Konfirmasi Reservasi Anda di Cita Nusa Resto</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={header}>Cita Nusa Resto</Heading>
                    <Section style={section}>
                        <Heading as="h2" style={subheader}>
                            Reservasi Anda Telah Dikonfirmasi!
                        </Heading>
                        <Text style={text}>Halo {customerName},</Text>
                        <Text style={text}>
                            Kami ingin memberitahu bahwa reservasi Anda di Cita
                            Nusa Resto telah dikonfirmasi. Berikut adalah detail
                            reservasi Anda:
                        </Text>

                        <Section style={detailsSection}>
                            <Text style={detailRow}>
                                <strong>ID Reservasi:</strong>{" "}
                                {bookingId.substring(0, 8).toUpperCase()}
                            </Text>
                            <Text style={detailRow}>
                                <strong>Tanggal:</strong> {formattedDate}
                            </Text>
                            <Text style={detailRow}>
                                <strong>Waktu:</strong> {formattedTime} WIB
                            </Text>
                            <Text style={detailRow}>
                                <strong>Meja:</strong> #{tableNumber}
                            </Text>
                            <Text style={detailRow}>
                                <strong>Jumlah Tamu:</strong> {guestCount} orang
                            </Text>
                            <Text style={detailRow}>
                                <strong>Durasi:</strong> {duration} menit
                            </Text>
                            {specialRequest && (
                                <Text style={detailRow}>
                                    <strong>Permintaan Khusus:</strong>{" "}
                                    {specialRequest}
                                </Text>
                            )}
                        </Section>

                        <Hr style={hr} />

                        <Text style={text}>
                            Mohon tiba tepat waktu. Jika Anda perlu mengubah
                            atau membatalkan reservasi, silakan hubungi kami
                            minimal 3 jam sebelum waktu kedatangan Anda.
                        </Text>

                        <Button
                            style={button}
                            href="https://citanusaresto.com/reservasi"
                        >
                            Kelola Reservasi Anda
                        </Button>

                        <Text style={text}>
                            Kami berterima kasih atas kepercayaan Anda dan tidak
                            sabar menyambut Anda di Cita Nusa Resto!
                        </Text>

                        <Text style={regards}>Salam hangat,</Text>
                        <Text style={signature}>Tim Cita Nusa Resto</Text>
                    </Section>
                    <Hr style={hr} />
                    <Text style={footer}>
                        Jl. Nusa Indah No. 123, Jakarta Selatan • 021-12345678
                    </Text>
                    <Text style={footer}>
                        <Link href="https://citanusaresto.com">
                            citanusaresto.com
                        </Link>
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

// Styles
const main = {
    backgroundColor: "#f5f2ed",
    fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
    margin: "0 auto",
    padding: "20px 0",
    maxWidth: "600px",
};

const header = {
    backgroundColor: "#8B4513",
    color: "#ffffff",
    padding: "20px",
    textAlign: "center" as const,
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0",
};

const section = {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "5px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
};

const subheader = {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#8B4513",
    marginBottom: "20px",
};

const text = {
    fontSize: "16px",
    lineHeight: "26px",
    color: "#333",
};

const detailsSection = {
    backgroundColor: "#f9f5f0",
    padding: "15px",
    borderRadius: "5px",
    margin: "20px 0",
};

const detailRow = {
    margin: "8px 0",
    fontSize: "15px",
};

const button = {
    backgroundColor: "#D2691E",
    color: "#ffffff",
    padding: "12px 20px",
    borderRadius: "4px",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "bold",
    display: "inline-block",
    margin: "20px 0",
};

const hr = {
    borderColor: "#E5E5E5",
    margin: "20px 0",
};

const regards = {
    fontSize: "16px",
    color: "#333",
    marginBottom: "5px",
};

const signature = {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#8B4513",
};

const footer = {
    fontSize: "14px",
    color: "#666666",
    textAlign: "center" as const,
    margin: "5px 0",
};

export default BookingConfirmationEmail;
