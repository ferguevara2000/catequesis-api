// src/schemas/bautismo.schema.ts
import { z } from "zod";

export const bautismoSchema = z.object({
  partida: z.string(),
  apellidos: z.string().min(1),
  nombres: z.string().min(1),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido"), // YYYY-MM-DD
});
