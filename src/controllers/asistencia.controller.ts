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

export const getFechasAsistenciaPorCurso = async (req: Request, res: Response) => {
  const { cursoId } = req.params

  try {
    const { data, error } = await supabase
      .from("asistencia")
      .select("fecha, estudiantes_cursos!inner(curso_id)")
      .eq("estudiantes_cursos.curso_id", cursoId)

    if (error) {
      console.error("Error al consultar asistencias:", error)
      return res.status(500).json({ error: "Error al obtener fechas de asistencia" })
    }

    // Extraer y agrupar fechas únicas
    const fechasUnicas = Array.from(
      new Set(data.map((item) => item.fecha))
    ).sort((a, b) => b.localeCompare(a)) // Orden descendente por fecha

    res.json(fechasUnicas)
  } catch (err) {
    console.error("Error inesperado:", err)
    res.status(500).json({ error: "Error interno del servidor" })
  }
}

export async function getAsistenciaResumenPorCurso(req: Request, res: Response) {
  const curso_id = req.params.curso_id;

  try {
    const { data, error } = await supabase
      .from('estudiantes_cursos')
      .select(`
        id,
        usuario:usuario (
          nombre,
          apellidos
        ),
        asistencias:asistencia (
          estado
        )
      `)
      .eq('curso_id', curso_id);

    if (error) {
      return res.status(500).json({ message: "Error al obtener datos", error });
    }

    // Procesar para calcular porcentaje
    const resumen = data.map((matricula: any) => {
      const total = matricula.asistencias.length;
      const asistencias = matricula.asistencias.filter(
    (a: any) => a.estado === "Presente" || a.estado === "Justificado"
  ).length;
      const porcentaje = total > 0 ? +( (asistencias / total) * 100 ).toFixed(2) : 0;
      return {
        matricula_id: matricula.id,
        nombre: matricula.usuario.nombre + " " + matricula.usuario.apellidos,
        total_sesiones: total,
        asistencias,
        porcentaje_asistencia: porcentaje,
      };
    });

    return res.json(resumen);

  } catch (error) {
    return res.status(500).json({ message: "Error inesperado", error });
  }
}

