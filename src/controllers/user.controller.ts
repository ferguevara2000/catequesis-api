import { Request, Response } from "express";
import { usuarioSchema } from "../schemas/user.schema";
import { supabase } from "../lib/supabase";
import bcrypt from "bcryptjs";
import { enviarCorreoRecuperacion } from "../utils/emailTest";

// Crear usuario
export const createUsuario = async (req: Request, res: Response) => {
  try {
    const parsed = usuarioSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.format() });
    }

    const { nombre, apellidos, usuario, rol, contraseña, email, phone, barrio_id, representante } = parsed.data;

    const { data: existingUser } = await supabase
      .from("usuario")
      .select("id")
      .eq("usuario", usuario)
      .maybeSingle();

    if (existingUser) {
      return res.status(409).json({ error: "El nombre de usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const { error: insertError } = await supabase.from("usuario").insert([
      {
        nombre: nombre.trim(),
        apellidos: apellidos.trim(),
        usuario: usuario.trim(),
        rol,
        contraseña: hashedPassword,
        email: email.trim(),
        phone: phone.trim(),
        barrio_id: barrio_id,
        representante: representante
      },
    ]);

    if (insertError) {
      return res.status(500).json({ error: "Error al guardar usuario" });
    }

    return res.status(201).json({ message: "Usuario creado correctamente" });
  } catch (error) {
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

// Obtener todos los usuarios
export const getUsuarios = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("usuario")
      .select("id, nombre, apellidos, usuario, rol, email, phone, barrio_id, representante, barrio:barrios (*)");

    if (error) {
      return res.status(500).json({ error: "Error al obtener usuarios" });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

// Obtener usuario por ID
export const getUsuarioById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("usuario")
      .select("id, nombre, apellidos, usuario, rol, email, phone, barrio_id, representante, barrio:barrios (*)")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return res.status(500).json({ error: "Error al buscar usuario" });
    }

    if (!data) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

// Actualizar usuario
export const updateUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const parsed = usuarioSchema.partial({ contraseña: true }).safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.format() });
    }

    const { nombre, apellidos, usuario, rol, contraseña, email, phone, barrio_id, representante } = parsed.data;

    const updates: any = {
      nombre: nombre?.trim(),
      apellidos: apellidos?.trim(),
      usuario: usuario?.trim(),
      rol,
      email: email?.trim(),
      phone: phone?.trim(),
      barrio_id: barrio_id,
      representante: representante
    };

    if (contraseña) {
      updates.contraseña = await bcrypt.hash(contraseña, 10);
    }

    if (usuario) {
      const { data: existingUser } = await supabase
        .from("usuario")
        .select("id")
        .eq("usuario", usuario)
        .neq("id", id)
        .maybeSingle();

      if (existingUser) {
        return res.status(409).json({ error: "El nombre de usuario ya está en uso" });
      }
    }

    const { error: updateError } = await supabase
      .from("usuario")
      .update(updates)
      .eq("id", id);

    if (updateError) {
      return res.status(500).json({ error: "Error al actualizar usuario" });
    }

    return res.json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

// Eliminar usuario
export const deleteUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("usuario").delete().eq("id", id);

    if (error) {
      return res.status(500).json({ error: "Error al eliminar usuario" });
    }

    return res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

// Actualizar solo la contraseña
export const updatePassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { contraseña } = req.body;

    // Usamos el schema solo para validar la contraseña
    const parsed = usuarioSchema.pick({ contraseña: true }).safeParse({ contraseña });

    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.format() });
    }

    const hashedPassword = await bcrypt.hash(contraseña.trim(), 10);

    const { error } = await supabase
      .from("usuario")
      .update({ contraseña: hashedPassword })
      .eq("id", id);

    if (error) {
      return res.status(500).json({ error: "Error al actualizar contraseña" });
    }

    return res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

export const updatePasswordWithVerification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { contraseña_actual, nueva_contraseña } = req.body;

    // 1. Validar nueva contraseña
    const parsed = usuarioSchema.pick({ contraseña: true }).safeParse({ contraseña: nueva_contraseña });

    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.format() });
    }

    // 2. Buscar usuario actual
    const { data: usuario, error: userError } = await supabase
      .from("usuario")
      .select("id, contraseña") // ¡IMPORTANTE!
      .eq("id", id)
      .single();

    if (userError || !usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // 3. Comparar contraseñas
    const passwordValida = await bcrypt.compare(contraseña_actual, (usuario as any).contraseña);

    if (!passwordValida) {
      return res.status(401).json({ code: "CONTRASEÑA_INCORRECTA", error: "La contraseña actual es incorrecta" });
    }

    // 4. Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(nueva_contraseña.trim(), 10);

    const { error: updateError } = await supabase
      .from("usuario")
      .update({ contraseña: hashedPassword })
      .eq("id", id);

    if (updateError) {
      return res.status(500).json({ error: "Error al actualizar contraseña" });
    }

    return res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

export const getCatequistas = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("usuario")
      .select("id, nombre")
      .eq("rol", "Catequista");

    if (error) {
      return res.status(500).json({ error: "Error al obtener catequistas" });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

export const getEstudiantes = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("usuario")
      .select("id, nombre")
      .eq("rol", "Estudiante");

    if (error) {
      return res.status(500).json({ error: "Error al obtener los estudiantes" });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

export const recuperarContrasena = async (req: Request, res: Response) => {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ message: "El correo es obligatorio" })
  }

  try {
    // Verificar si existe el usuario
    const { data: usuario, error } = await supabase
      .from("usuario")
      .select("*")
      .eq("email", email)
      .single()

    if (error || !usuario) {
      return res.status(404).json({ message: "No existe una cuenta asociada a este correo" })
    }

    // Enviar correo y obtener contraseña temporal
    const contrasenaTemporal = await enviarCorreoRecuperacion(email)

    if (!contrasenaTemporal) {
      return res.status(500).json({ message: "Error al enviar el correo de recuperación" })
    }

    // Hashear la nueva contraseña
    const hash = await bcrypt.hash(contrasenaTemporal, 10)

    // Actualizar la contraseña en Supabase
    const { error: updateError } = await supabase
      .from("usuario")
      .update({ contraseña: hash })
      .eq("email", email)

    if (updateError) {
      return res.status(500).json({ message: "Error al actualizar la contraseña" })
    }

    return res.status(200).json({ message: "Correo enviado y contraseña actualizada" })
  } catch (error) {
    console.error("❌ Error al recuperar contraseña:", error)
    return res.status(500).json({ message: "Error en el servidor" })
  }
}
