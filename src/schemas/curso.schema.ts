// src/schemas/curso.schema.ts
import { z } from "zod";

export const cursoSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .max(100, { message: "El nombre es demasiado largo" }),
  
  descripcion: z
    .string()
    .trim()
    .min(10, { message: "La descripción debe tener al menos 10 caracteres" })
    .max(500, { message: "La descripción es demasiado larga" }),

  nivel_id: z
    .number({ invalid_type_error: "El nivel es obligatorio" })
    .int({ message: "El nivel debe ser un número entero" }),

  catequista_id: z
    .number({ invalid_type_error: "El catequista es obligatorio" })
    .int({ message: "El catequista debe ser un número entero" }),

  fecha_inicio: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Formato de fecha de inicio inválido (YYYY-MM-DD)" }),

  fecha_fin: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Formato de fecha de fin inválido (YYYY-MM-DD)" }),

    horario: z
    .string()
    .regex(
      /^(Lunes|Martes|Miércoles|Jueves|Viernes|Sábado|Domingo),\s(1[0-2]|0?[1-9]):[0-5][0-9]\s?(am|pm)$/i,
      { message: "Formato de horario inválido (Ej: Domingo, 8:00 am)" }
    ),
});
