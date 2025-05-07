import { z } from "zod";

export const asistenciaSchema = z.object({
  fecha: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Fecha inválida",
  }),
  estado: z.enum(["Presente", "Falta", "Justificado"]),
  matricula_id: z.number({ required_error: "matricula_id es requerido" }),
});
