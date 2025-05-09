// src/controllers/bautismo.controller.ts
import { Request, Response } from "express";
import { supabase } from "../lib/supabase";
import { bautismoSchema } from "../schemas/bautismo.schema";

// Obtener todos
export const getBautismos = async (_req: Request, res: Response) => {
  const { data, error } = await supabase.from("bautismos").select("*");
  if (error) return res.status(500).json({ error: "Error al obtener bautismos" });
  return res.json(data);
};

// Obtener uno
export const getBautismo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("bautismos").select("*").eq("id", id).single();
  if (error) return res.status(404).json({ error: "Bautismo no encontrado" });
  return res.json(data);
};

// Crear
export const createBautismo = async (req: Request, res: Response) => {
  const parsed = bautismoSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.format() });

  const { data, error } = await supabase.from("bautismos").insert(parsed.data).select().single();
  if (error) return res.status(500).json({ error: "Error al registrar bautismo" });
  return res.status(201).json(data);
};

// Actualizar
export const updateBautismo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const parsed = bautismoSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.format() });

  const { error } = await supabase.from("bautismos").update(parsed.data).eq("id", id);
  if (error) return res.status(500).json({ error: "Error al actualizar bautismo" });
  return res.json({ message: "Bautismo actualizado correctamente" });
};

// Eliminar
export const deleteBautismo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { error } = await supabase.from("bautismos").delete().eq("id", id);
  if (error) return res.status(500).json({ error: "Error al eliminar bautismo" });
  return res.json({ message: "Bautismo eliminado correctamente" });
};
