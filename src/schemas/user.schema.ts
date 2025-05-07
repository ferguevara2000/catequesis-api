import { z } from "zod";

export const usuarioSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .max(100, { message: "El nombre es demasiado largo" })
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/, {
      message: "El nombre solo debe contener letras y espacios",
    }),

  usuario: z
    .string()
    .trim()
    .min(5, { message: "El usuario debe tener mínimo 5 caracteres" })
    .max(30, { message: "El usuario debe tener máximo 30 caracteres" })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: "El usuario solo puede contener letras, números, guion o guion bajo",
    }),

  email: z
    .string()
    .trim()
    .email({ message: "El correo electrónico no es válido" }),

    phone: z
    .string()
    .optional()
    .transform((val) => val?.trim() ?? "")
    .refine((val) => !val || /^\d{10}$/.test(val), {
      message: "El número de teléfono debe tener exactamente 10 dígitos",
    }),

  rol: z.enum(["Administrador", "Catequista", "Estudiante", "Parroco", "Tesorero"], {
    errorMap: () => ({ message: "Rol inválido" }),
  }),

  contraseña: z
    .string()
    .trim()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    .regex(/[A-Z]/, {
      message: "La contraseña debe contener al menos una letra mayúscula",
    })
    .regex(/[0-9]/, {
      message: "La contraseña debe contener al menos un número",
    }),
});
