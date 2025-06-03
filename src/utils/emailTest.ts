// enviarCorreoNotificacion.ts
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Cargar variables del .env

export const enviarCorreoNotificacion = async ({
  destinatarios,
  asunto,
  mensajeHtml,
}: {
  destinatarios: string[];
  asunto: string;
  mensajeHtml: string;
}) => {
  try {
    console.log("📨 Enviando correo a:", destinatarios);
    console.log("📧 Asunto:", asunto);
    console.log("📝 Contenido HTML:", mensajeHtml);

    // Verifica que las variables de entorno estén cargadas
    console.log("🔐 EMAIL_USER:", process.env.EMAIL_USER);
    console.log("🔐 EMAIL_PASS existe:", !!process.env.EMAIL_PASS);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("🚚 Transportador creado, enviando mensaje...");

    const info = await transporter.sendMail({
      from: `"Parroquia Montalvo" <${process.env.EMAIL_USER}>`,
      to: destinatarios.join(", "),
      subject: asunto,
      html: mensajeHtml,
    });

    console.log("✅ Correo enviado correctamente");
    console.log("📩 ID del mensaje:", info.messageId);
    console.log("📤 Respuesta completa:", info);
  } catch (error) {
    console.error("❌ Error al enviar el correo:", error);
  }
};
