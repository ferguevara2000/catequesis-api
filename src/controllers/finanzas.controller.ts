// src/controllers/finanzas.controller.ts
import { Request, Response } from "express";
import { supabase } from "../lib/supabase";
import { finanzaSchema } from "../schemas/finanzas.schema";

// Crear registro de finanzas
export const createFinanza = async (req: Request, res: Response) => {
  const result = finanzaSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.format() });
  }

  const { data, error } = await supabase.from("finanzas").insert([result.data]).select().single();
  if (error) {
    return res.status(500).json({ error: "Error al crear registro de finanzas" });
  }

  return res.status(201).json(data);
};

// Obtener todas las finanzas con el objeto completo del barrio
export const getFinanzas = async (_req: Request, res: Response) => {
  try {
    // Obtener registros de finanzas con relación a barrios
    const { data: finanzas, error } = await supabase
      .from("finanzas")
      .select(`
        *,
        barrios:barrios (
          *
        )
      `);

    if (error) {
      return res
        .status(500)
        .json({ error: "Error al obtener registros de finanzas", detalle: error.message });
    }

    if (!finanzas) {
      return res.json([]);
    }

    // Para cada registro, buscar el tesorero correspondiente
    const resultadosConTesorero = await Promise.all(
      finanzas.map(async (registro) => {
        const { data: tesorero, error: errorTesorero } = await supabase
          .from("usuario")
          .select("id, nombre, apellidos, barrio_id, rol")
          .eq("rol", "Tesorero")
          .eq("barrio_id", registro.barrio_id)
          .maybeSingle();

        return {
          ...registro,
          tesorero: tesorero || null,
        };
      })
    );

    return res.json(resultadosConTesorero);
  } catch (error: any) {
    return res.status(500).json({
      error: "Error en el servidor",
      detalle: error.message ?? error,
    });
  }
};

export const getAllBarrios = async (_req: Request, res: Response) => {
    const { data, error } = await supabase.from("barrios").select("*");
    if (error) {
      return res.status(500).json({ error: "Error al obtener registros de los barrios" });
    }
  
    return res.json(data);
  };

// Obtener finanza por barrio_id
export const getFinanzaByBarrio = async (req: Request, res: Response) => {
  const { barrio_id } = req.params;

  const { data, error } = await supabase
    .from("finanzas")
    .select("*")
    .eq("barrio_id", barrio_id)
    .single();

  if (error) {
    return res.status(404).json({ error: "Registro no encontrado para el barrio" });
  }

  return res.json(data);
};

// Actualizar finanza
export const updateFinanza = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = finanzaSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.format() });
  }

  const { data, error } = await supabase
    .from("finanzas")
    .update(result.data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: "Error al actualizar registro de finanzas" });
  }

  return res.json(data);
};

// Eliminar registro de finanza
export const deleteFinanza = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error } = await supabase.from("finanzas").delete().eq("id", id);
  if (error) {
    return res.status(500).json({ error: "Error al eliminar el registro" });
  }

  return res.json({ message: "Registro eliminado correctamente" });
};
