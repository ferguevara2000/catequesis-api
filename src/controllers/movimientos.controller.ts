import { Request, Response } from "express";
import { supabase } from "../lib/supabase";
import { movimientoSchema } from "../schemas/movimientos.schema";

// Crear movimiento
export const createMovimiento = async (req: Request, res: Response) => {
  const parsed = movimientoSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Datos inválidos", details: parsed.error.format() });
  }

  const { finanza_id, tipo, monto, descripcion, fecha, registrado_por } = parsed.data;

  const { data, error } = await supabase
    .from("movimientos")
    .insert([{ finanza_id, tipo, monto, descripcion, fecha, registrado_por }])
    .select("*")
    .single();

  if (error) return res.status(500).json({ error: "Error al crear movimiento", details: error });

  return res.status(201).json(data);
};

// Obtener todos los movimientos
export const getMovimientos = async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("movimientos")
    .select(`
      *,
      finanzas (
        *,
        barrios (*)
      )
    `)
    .order("fecha", { ascending: false });

  if (error) {
    return res.status(500).json({ error: "Error al obtener movimientos", details: error });
  }

  return res.json(data);
};

// Obtener por ID
export const getMovimientoById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("movimientos")
    .select("*, finanzas(*)")
    .eq("id", id)
    .single();

  if (error) return res.status(404).json({ error: "Movimiento no encontrado", details: error });

  return res.json(data);
};

export const getMovimientosByBarrioId = async (req: Request, res: Response) => {
  const { barrio_id } = req.params;

  if (!barrio_id) {
    return res.status(400).json({ error: "Se requiere el parámetro barrio_id en la URL" });
  }

  const { data, error } = await supabase
    .from("movimientos")
    .select(`
      *,
      finanzas!inner ( 
        *,
        barrios (*)
      )
    `)
    .order("fecha", { ascending: false })
    .eq("finanzas.barrio_id", barrio_id);

  if (error) {
    return res.status(500).json({ error: "Error al obtener movimientos", details: error });
  }

  return res.json(data);
};

// Actualizar
export const updateMovimiento = async (req: Request, res: Response) => {
  const { id } = req.params;

  const parsed = movimientoSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Datos inválidos", details: parsed.error.format() });
  }

  const { finanza_id, tipo, monto, descripcion, fecha, registrado_por } = parsed.data;

  const { data, error } = await supabase
    .from("movimientos")
    .update({ finanza_id, tipo, monto, descripcion, fecha, registrado_por })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: "Error al actualizar movimiento", details: error });

  return res.json(data);
};

// Eliminar
export const deleteMovimiento = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error } = await supabase.from("movimientos").delete().eq("id", id);

  if (error) return res.status(500).json({ error: "Error al eliminar movimiento", details: error });

  return res.status(204).send();
};
