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

const generarContrasenaTemporal = (longitud = 10): string => {
  const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let contrasena = "";
  for (let i = 0; i < longitud; i++) {
    contrasena += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return contrasena;
};

export const enviarCorreoRecuperacion = async (correo: string): Promise<string | null> => {
  try {
    const contrasenaTemporal = generarContrasenaTemporal();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const asunto = "Recuperación de contraseña - Parroquia Montalvo";
    const mensajeHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Hola,</h2>
        <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
        <p>Tu nueva contraseña temporal es:</p>
        <p style="font-size: 18px; font-weight: bold; color: #2c3e50;">${contrasenaTemporal}</p>
        <p>Por favor, inicia sesión y cámbiala lo antes posible.</p>
        <hr />
        <p style="font-size: 12px; color: #888;">Si no solicitaste este cambio, ignora este correo.</p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"Parroquia Montalvo" <${process.env.EMAIL_USER}>`,
      to: correo,
      subject: asunto,
      html: mensajeHtml,
    });

    console.log("✅ Correo enviado a:", correo);
    console.log("📩 ID del mensaje:", info.messageId);

    return contrasenaTemporal; // puedes guardar esta contraseña temporal en la base de datos
  } catch (error) {
    console.error("❌ Error al enviar el correo de recuperación:", error);
    return null;
  }
};
