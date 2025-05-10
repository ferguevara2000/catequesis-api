// src/controllers/defunciones.controller.ts
import { Request, Response } from "express";
import { supabase } from "../lib/supabase";
import { defuncionSchema } from "../schemas/defuncionesSchema";

// Obtener todas las defunciones ordenadas por fecha_defuncion descendente
export const getDefunciones = async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("defunciones")
    .select("*")
    .order("fecha_defuncion", { ascending: false });

  if (error) return res.status(500).json({ error: "Error al obtener defunciones" });
  return res.json(data);
};

// Obtener una defunción por ID
export const getDefuncionById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("defunciones")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return res.status(404).json({ error: `Defunción con ID ${id} no encontrada` });
  return res.json(data);
};

// Crear una defunción
export const createDefuncion = async (req: Request, res: Response) => {
  const parsed = defuncionSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  const { data, error } = await supabase
    .from("defunciones")
    .insert([parsed.data]);

  if (error) return res.status(500).json({ error: "Error al crear defunción" });

  return res.status(201).json({ message: "Defunción registrada correctamente", data });
};

// Actualizar una defunción
export const updateDefuncion = async (req: Request, res: Response) => {
  const { id } = req.params;
  const parsed = defuncionSchema.partial().safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  const { data, error } = await supabase
    .from("defunciones")
    .update(parsed.data)
    .eq("id", id);

  if (error) return res.status(500).json({ error: `Error al actualizar defunción con ID ${id}` });

  return res.json({ message: "Defunción actualizada correctamente", data });
};

// Eliminar una defunción
export const deleteDefuncion = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("defunciones")
    .delete()
    .eq("id", id);

  if (error) return res.status(500).json({ error: `Error al eliminar defunción con ID ${id}` });

  return res.json({ message: "Defunción eliminada correctamente" });
};
