import { z } from "zod";

export const movimientoSchema = z.object({
  finanza_id: z.number(),
  tipo: z.enum(["Ingreso", "Egreso"]),
  monto: z.number().positive("El monto debe ser mayor a 0"),
  descripcion: z.string().min(1, "La descripción es requerida"),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe estar en formato YYYY-MM-DD"),
  registrado_por: z.string().min(1, "Debe indicar quién registró el movimiento"),
});
