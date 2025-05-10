// src/controllers/confirmaciones.controller.ts
import { Request, Response } from "express";
import { supabase } from "../lib/supabase";
import { confirmacionSchema } from "../schemas/confirmacion.schema";

// Obtener todas las confirmaciones
export const getConfirmaciones = async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("confirmaciones")
    .select("*")
    .order("fecha", { ascending: false });

  if (error) return res.status(500).json({ error: "Error al obtener confirmaciones" });
  return res.json(data);
};

// Obtener confirmación por ID
export const getConfirmacionById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("confirmaciones")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return res.status(500).json({ error: `Error al obtener la confirmación con ID ${id}` });
  return res.json(data);
};

// Crear nueva confirmación
export const createConfirmacion = async (req: Request, res: Response) => {
  const parsed = confirmacionSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  const { data, error } = await supabase
    .from("confirmaciones")
    .insert([parsed.data]);

  if (error) return res.status(500).json({ error: "Error al registrar la confirmación" });

  return res.status(201).json({ message: "Confirmación registrada exitosamente", data });
};

// Actualizar confirmación por ID
export const updateConfirmacion = async (req: Request, res: Response) => {
  const { id } = req.params;
  const parsed = confirmacionSchema.partial().safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  const { data, error } = await supabase
    .from("confirmaciones")
    .update(parsed.data)
    .eq("id", id);

  if (error) return res.status(500).json({ error: `Error al actualizar la confirmación con ID ${id}` });

  return res.json({ message: "Confirmación actualizada correctamente", data });
};

// Eliminar confirmación
export const deleteConfirmacion = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("confirmaciones")
    .delete()
    .eq("id", id);

  if (error) return res.status(500).json({ error: `Error al eliminar la confirmación con ID ${id}` });

  return res.json({ message: "Confirmación eliminada correctamente", data });
};
