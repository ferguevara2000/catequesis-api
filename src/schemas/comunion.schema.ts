// src/schemas/comunion.schema.ts
import { z } from "zod";

export const comunionSchema = z.object({
  nombres: z.string().min(1, "El nombre es obligatorio"),
  apellidos: z.string().min(1, "Los apellidos son obligatorios"),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),
  sacerdote: z.string().min(1, "El nombre del sacerdote es obligatorio"),
  padre: z.string().optional(),
  madre: z.string().optional(),
  padrino: z.string().optional(),
  madrina: z.string().optional(),
});
