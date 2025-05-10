// src/controllers/comuniones.controller.ts
import { Request, Response } from "express";
import { supabase } from "../lib/supabase";
import { comunionSchema } from "../schemas/comunion.schema";

// Obtener todas las comuniones ordenadas por fecha descendente
export const getComuniones = async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("comuniones")
    .select("*")
    .order("fecha", { ascending: false });

  if (error) return res.status(500).json({ error: "Error al obtener comuniones" });
  return res.json(data);
};

// Obtener una comunión por ID
export const getComunionById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("comuniones")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return res.status(500).json({ error: `Error al obtener comunión con ID ${id}` });
  return res.json(data);
};

// Crear una nueva comunión
export const createComunion = async (req: Request, res: Response) => {
  const parsed = comunionSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  const { data, error } = await supabase
    .from("comuniones")
    .insert([parsed.data]);

  if (error) return res.status(500).json({ error: "Error al registrar comunión" });

  return res.status(201).json({ message: "Comunión registrada correctamente", data });
};

// Actualizar una comunión
export const updateComunion = async (req: Request, res: Response) => {
  const { id } = req.params;
  const parsed = comunionSchema.partial().safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  const { data, error } = await supabase
    .from("comuniones")
    .update(parsed.data)
    .eq("id", id);

  if (error) return res.status(500).json({ error: `Error al actualizar comunión con ID ${id}` });

  return res.json({ message: "Comunión actualizada correctamente", data });
};

// Eliminar una comunión
export const deleteComunion = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("comuniones")
    .delete()
    .eq("id", id);

  if (error) return res.status(500).json({ error: `Error al eliminar comunión con ID ${id}` });

  return res.json({ message: "Comunión eliminada correctamente", data });
};
