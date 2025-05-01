import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
import { z } from "zod";

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Validation schema
const contactSchema = z.object({
    name: z.string().min(2, "Nama harus minimal 2 karakter"),
    email: z.string().email("Format email tidak valid"),
    subject: z.string().min(3, "Subjek harus minimal 3 karakter"),
    message: z.string().min(10, "Pesan harus minimal 10 karakter"),
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Only allow POST method
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        // Validate request body
        const validatedData = contactSchema.parse(req.body);
        const { name, email, subject, message } = validatedData;

        // Send email using Resend
        const { data, error } = await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: "ahmadahsin006@gmail.com",
            replyTo: email,
            subject: `[Contact Form] ${subject}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #b45309;">Pesan dari Form Kontak Website</h2>
          <p><strong>Nama:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subjek:</strong> ${subject}</p>
          <hr style="border: 1px solid #f3f4f6; margin: 20px 0;" />
          <div>
            <p><strong>Pesan:</strong></p>
            <p style="white-space: pre-line;">${message}</p>
          </div>
          <hr style="border: 1px solid #f3f4f6; margin: 20px 0;" />
          <p style="font-size: 12px; color: #6b7280;">
            Pesan ini dikirim dari form kontak website Cita Nusa Resto.
          </p>
        </div>
      `,
        });

        if (error) {
            console.error("Resend API Error:", error);
            return res.status(500).json({
                message: "Gagal mengirim email. Silakan coba lagi nanti.",
                error: error.message,
            });
        }

        // Success response
        return res.status(200).json({
            message: "Pesan berhasil dikirim",
            id: data?.id,
        });
    } catch (error) {
        // Handle zod validation errors
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: "Validasi gagal",
                errors: error.errors,
            });
        }

        // Handle other errors
        console.error("Contact form error:", error);
        return res.status(500).json({
            message: "Terjadi kesalahan. Silakan coba lagi nanti.",
        });
    }
}
