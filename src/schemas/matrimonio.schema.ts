// src/schemas/matrimonio.schema.ts
import { z } from "zod";

export const matrimonioSchema = z.object({
  fecha_matrimonio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha de matrimonio inválido"),
  sacerdote: z.string().min(1, "El nombre del sacerdote es obligatorio"),
  nombre_novio: z.string().min(1, "El nombre del novio es obligatorio"),
  apellidos_novio: z.string().min(1, "Los apellidos del novio son obligatorios"),
  padre_novio: z.string().optional(),
  madre_novio: z.string().optional(),
  nombre_novia: z.string().min(1, "El nombre de la novia es obligatorio"),
  apellidos_novia: z.string().min(1, "Los apellidos de la novia son obligatorios"),
  padre_novia: z.string().optional(),
  madre_novia: z.string().optional(),
  padrino: z.string().optional(),
  madrina: z.string().optional(),
});
