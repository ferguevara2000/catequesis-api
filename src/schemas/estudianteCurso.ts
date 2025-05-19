// src/schemas/estudianteCurso.schema.ts
import { z } from "zod";

// Definir el estado como un enum
export const estadoEnum = z.enum(["activo", "retirado", "aprobado"]);

// Schema para la validación
export const estudianteCursoSchema = z.object({
  usuario_ids: z.array(z.string().uuid({ message: "ID de usuario inválido" })).nonempty({
    message: "Debe proporcionar al menos un ID de estudiante",
  }),
  curso_id: z.string().uuid({ message: "ID de curso inválido" }),
  estado: estadoEnum
});

export const estudianteCursoUpdateSchema = z.object({
  usuario_id: z.number().int().positive(),
  curso_id: z.number().int().positive(),
  estado: estadoEnum
});
