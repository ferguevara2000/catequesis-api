// enviarCorreoNotificacion.ts
import nodemailer from "nodemailer";

// Función para enviar notificaciones por correo usando Ethereal (modo prueba)
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
    // Crear cuenta temporal para pruebas
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true para 465, false para otros
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: `"Parroquia Montalvo" <parroquia@prueba.com>`,
      to: destinatarios.join(", "),
      subject: asunto,
      html: mensajeHtml,
    });

    console.log("✅ Correo enviado:", info.messageId);
    console.log("📬 Vista previa:", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("❌ Error al enviar el correo:", error);
  }
};
