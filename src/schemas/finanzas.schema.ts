// src/schemas/finanzas.schema.ts
import { z } from "zod";

export const finanzaSchema = z.object({
  barrio_id: z.number(),
  total_ingresos: z.number().nonnegative(),
  total_egresos: z.number().nonnegative(),
  saldo: z.number(),
  actualizado_en: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),
});
