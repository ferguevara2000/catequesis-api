// src/schemas/defuncion.schema.ts
import { z } from "zod";

export const defuncionSchema = z.object({
  nombres: z.string().min(1, "El nombre es obligatorio"),
  apellidos: z.string().min(1, "El apellido es obligatorio"),
  fecha_nacimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato inválido (YYYY-MM-DD)").optional(),
  sexo: z.enum(["Mujer", "Varón"], {
    errorMap: () => ({ message: "El sexo debe ser 'Mujer' o 'Varón'" }),
  }),
  fecha_defuncion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato inválido (YYYY-MM-DD)"),
  cedula: z.string().optional(),
  padre: z.string().optional(),
  madre: z.string().optional(),
  estado_civil: z.enum(["Casado/a", "Divorciado/a", "Soltero/a", "Unido/a", "Viudo/a"])
    .optional(),
  conyuge: z.string().optional()
});
