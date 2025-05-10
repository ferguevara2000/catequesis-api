// src/controllers/matrimonios.controller.ts
import { Request, Response } from "express";
import { supabase } from "../lib/supabase"; // Asegúrate de tener la conexión configurada correctamente
import { matrimonioSchema } from "../schemas/matrimonio.schema";

// Obtener todos los matrimonios
export const getMatrimonios = async (_req: Request, res: Response) => {
  const { data, error } = await supabase.from("matrimonios").select("*").order("fecha_matrimonio", { ascending: false });
  if (error) return res.status(500).json({ error: "Error al obtener matrimonios" });
  return res.json(data);
};

// Obtener un matrimonio por ID
export const getMatrimonioById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("matrimonios").select("*").eq("id", id).single();
  if (error) return res.status(500).json({ error: `Error al obtener matrimonio con ID: ${id}` });
  return res.json(data);
};

// Crear un nuevo matrimonio
export const createMatrimonio = async (req: Request, res: Response) => {
  try {
    const parsed = matrimonioSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.format() });
    }

    const { data, error } = await supabase
      .from("matrimonios")
      .insert([parsed.data]);

    if (error) {
      return res.status(500).json({ error: "Error al insertar el matrimonio" });
    }

    return res.status(201).json({ message: "Matrimonio registrado exitosamente", data });
  } catch (error) {
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

// Actualizar matrimonio por ID
export const updateMatrimonio = async (req: Request, res: Response) => {
  const { id } = req.params;
  const parsed = matrimonioSchema.partial().safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  const { data, error } = await supabase.from("matrimonios").update(parsed.data).eq("id", id);

  if (error) {
    return res.status(500).json({ error: `Error al actualizar el matrimonio con ID: ${id}` });
  }

  return res.json({ message: "Matrimonio actualizado correctamente", data });
};

// Eliminar matrimonio por ID
export const deleteMatrimonio = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("matrimonios").delete().eq("id", id);

  if (error) {
    return res.status(500).json({ error: `Error al eliminar el matrimonio con ID: ${id}` });
  }

  return res.json({ message: "Matrimonio eliminado correctamente", data });
};
