// utils/email.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function enviarCorreoNotificacion({
  destinatarios,
  titulo,
  mensaje,
}: {
  destinatarios: string[];
  titulo: string;
  mensaje: string;
}) {
  if (!destinatarios || destinatarios.length === 0) return;

  try {
    console.log("Enviando correos a:", destinatarios);
    await resend.emails.send({
      from: "Catequesis <no-reply@notificacion.parroquiamontalvo.org>", // Asegúrate que esté verificado
      to: destinatarios,
      subject: "Nueva comunicación de la parroquia",
      html: `
        <h3>Has recibido una nueva comunicación</h3>
        <p><strong>Título:</strong> ${titulo}</p>
        <p><strong>Mensaje:</strong> ${mensaje}</p>
        <p>Por favor revisa tu cuenta en el sistema de catequesis.</p>
      `,
    });
  } catch (error) {
    console.error("Error al enviar email:", error);
  }
}
