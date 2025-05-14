import { z } from "zod";

export const comunicacionSchema = z.object({
  titulo: z.string().min(1, "El título es obligatorio"),
  mensaje: z.string().min(1, "El mensaje es obligatorio"),
  dirigido_a: z
    .array(z.enum(["Todos", "Catequistas", "Estudiantes"]))
    .nonempty("Debe haber al menos un destinatario"),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha con formato inválido (YYYY-MM-DD)"),
  enviado_por: z.string().min(1, "El campo 'enviado_por' es obligatorio"),
});
