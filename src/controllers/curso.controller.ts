import { Request, Response } from "express";
import { cursoSchema } from "../schemas/curso.schema";
import { supabase } from "../lib/supabase";

// Crear curso
export const createCurso = async (req: Request, res: Response) => {
  try {
    const parsed = cursoSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.format() });
    }

    const { nombre, descripcion, nivel_id, fecha_inicio, fecha_fin, horario, catequista_id } = parsed.data;

    const { error } = await supabase.from("cursos").insert([
      {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        nivel_id,
        fecha_inicio,
        fecha_fin,
        horario,
        catequista_id,
      },
    ]);

    if (error) {
      return res.status(500).json({ error: "Error al crear curso" });
    }

    return res.status(201).json({ message: "Curso creado exitosamente" });
  } catch (error) {
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

// Obtener todos los cursos (con nombre del nivel y catequista)
export const getCursos = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("cursos")
      .select(`
        id,
        nombre,
        descripcion,
        fecha_inicio,
        fecha_fin,
        horario,
        nivel: niveles_catequesis (
          id,
          nombre
        ),
        catequista: usuario (
          id,
          nombre
        )
      `);

    if (error) {
      return res.status(500).json({ error: "Error al obtener cursos" });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

// Obtener curso por ID (con nombre del nivel y catequista)
export const getCursoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("cursos")
      .select(`
        id,
        nombre,
        descripcion,
        fecha_inicio,
        fecha_fin,
        horario,
        nivel: niveles_catequesis (
          id,
          nombre
        ),
        catequista: usuario (
          id,
          nombre
        )
      `)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return res.status(500).json({ error: "Error al buscar curso" });
    }

    if (!data) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

// Actualizar curso
export const updateCurso = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const parsed = cursoSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.format() });
    }

    const updates = parsed.data;

    const { error } = await supabase.from("cursos").update(updates).eq("id", id);

    if (error) {
      return res.status(500).json({ error: "Error al actualizar curso" });
    }

    return res.json({ message: "Curso actualizado correctamente" });
  } catch (error) {
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

// Eliminar curso
export const deleteCurso = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("cursos").delete().eq("id", id);

    if (error) {
      return res.status(500).json({ error: "Error al eliminar curso" });
    }

    return res.json({ message: "Curso eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

// Obtener niveles de catequesis
export const getNivelesCatequesis = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("niveles_catequesis")
      .select("id, nombre")
      .order("id", { ascending: true });

    if (error) {
      return res.status(500).json({ error: "Error al obtener los niveles" });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: "Error en el servidor" });
  }
};
