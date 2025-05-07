import { Request, Response } from "express";
import { supabase } from "../lib/supabase";
import { asistenciaSchema } from "../schemas/asistencia.schema";

// Crear asistencia
export const createAsistencia = async (req: Request, res: Response) => {
  const parsed = asistenciaSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  const { fecha, estado, matricula_id } = parsed.data;

  const { error } = await supabase.from("asistencia").insert([
    { fecha, estado, matricula_id },
  ]);

  if (error?.code === "23505") {
    return res.status(409).json({ error: "Asistencia ya registrada para ese estudiante y fecha" });
  }

  if (error) {
    return res.status(500).json({ error: "Error al registrar asistencia" });
  }

  return res.status(201).json({ message: "Asistencia registrada correctamente" });
};

// Obtener todas las asistencias
export const getAsistencias = async (_req: Request, res: Response) => {
  const { data, error } = await supabase.from("asistencia").select("*");
  if (error) {
    return res.status(500).json({ error: "Error al obtener asistencias" });
  }
  return res.json(data);
};

// Obtener asistencia de un curso en una fecha específica
export const getAsistenciaPorCursoYFecha = async (req: Request, res: Response) => {
  const { curso_id, fecha } = req.body;

  if (!curso_id || !fecha) {
    return res.status(400).json({ error: "Se requiere curso_id y fecha" });
  }

  const { data, error } = await supabase
    .from("asistencia")
    .select(`
      id,
      estado,
      fecha,
      estudiante:estudiantes_cursos (
        id,
        curso_id,
        usuario:usuario (
          id,
          nombre
        )
      )
    `)
    .eq("fecha", fecha)
    .eq("estudiante.curso_id", curso_id)
    .eq("estudiante.estado", "activo");

  if (error) {
    return res.status(500).json({ error: `Error al obtener asistencia del curso: ${error.message}` });
  }

  return res.json(data);
};

// Actualizar asistencia
export const updateAsistencia = async (req: Request, res: Response) => {
  const { id } = req.params;
  const parsed = asistenciaSchema.partial().safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  const { error } = await supabase
    .from("asistencia")
    .update(parsed.data)
    .eq("id", id);

  if (error?.code === "23505") {
    return res.status(409).json({ error: "Conflicto: asistencia duplicada" });
  }

  if (error) {
    return res.status(500).json({ error: "Error al actualizar asistencia" });
  }

  return res.json({ message: "Asistencia actualizada correctamente" });
};

// Eliminar asistencia
export const deleteAsistencia = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error } = await supabase.from("asistencia").delete().eq("id", id);

  if (error) {
    return res.status(500).json({ error: "Error al eliminar asistencia" });
  }

  return res.json({ message: "Asistencia eliminada correctamente" });
};
