// src/schemas/defuncion.schema.ts
import { z } from "zod";

export const defuncionSchema = z.object({
  nombres: z.string().min(1, "El nombre es obligatorio"),
  apellidos: z.string().min(1, "El apellido es obligatorio"),
  fecha_nacimiento: z.union([
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato inválido (YYYY-MM-DD)"),
    z.literal(""),
  ]).optional().nullable(),  
  sexo: z.enum(["Mujer", "Varón"], {
    errorMap: () => ({ message: "El sexo debe ser 'Mujer' o 'Varón'" }),
  }),
  fecha_defuncion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato inválido (YYYY-MM-DD)"),
  cedula: z.string().optional(),
  padre: z.string().optional(),
  madre: z.string().optional(),
  estado_civil: z
  .union([
    z.enum(["Casado", "Casada", "Divorciado", "Divorciada" ,"Soltero", "Soltera", "Unido", "Unida", "Viudo", "Viuda"]),
    z.literal(""),
  ])
  .optional()
  .refine(
    (val) =>
      val === "" ||
    ["Casado", "Casada", "Divorciado", "Divorciada" ,"Soltero", "Soltera", "Unido", "Unida", "Viudo", "Viuda"].includes(val!.toString()),
    { message: "Estado civil no válido" }
  ),
  
  conyuge: z.string().optional()
});
