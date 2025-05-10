// src/schemas/confirmacion.schema.ts
import { z } from "zod";

export const confirmacionSchema = z.object({
  nombres: z.string().min(1, "El nombre es obligatorio"),
  apellidos: z.string().min(1, "Los apellidos son obligatorios"),
  sexo: z.enum(["Mujer", "Varón"]),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),
  sacerdote: z.string().min(1, "El nombre del sacerdote es obligatorio"),
  padrino: z.string().optional(),
  madrina: z.string().optional(),
  padre: z.string().optional(),
  madre: z.string().optional(),
});
