// src/schemas/estudianteCurso.schema.ts
import { z } from "zod";

// Definir el estado como un enum
export const estadoEnum = z.enum(["activo", "retirado", "aprovado"]);

// Schema para la validación
export const estudianteCursoSchema = z.object({
  usuario_id: z.number().int().positive(),
  curso_id: z.number().int().positive(),
  estado: estadoEnum,
});
