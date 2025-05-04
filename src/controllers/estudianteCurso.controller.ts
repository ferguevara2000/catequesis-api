// src/controllers/estudianteCurso.controller.ts
import { Request, Response } from "express";
import { estudianteCursoSchema } from "../schemas/estudianteCurso";
import { supabase } from "../lib/supabase";

// Crear estudiante en curso
export const createEstudianteCurso = async (req: Request, res: Response) => {
    try {
      const parsed = estudianteCursoSchema.safeParse(req.body);
  
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.format() });
      }
  
      const { usuario_id, curso_id, estado } = parsed.data;
  
      const { error } = await supabase.from("estudiantes_cursos").insert([
        { usuario_id, curso_id, estado },
      ]);
  
      if (error) {
        // Manejo de error por restricción única
        if (error.code === "23505" || error.message.includes("duplicate key")) {
          return res.status(409).json({
            error: "El estudiante ya está asignado a este curso.",
          });
        }
  
        return res.status(500).json({
          error: "Error al asignar estudiante al curso",
          detalle: error.message,
        });
      }
  
      return res.status(201).json({
        message: "Estudiante asignado al curso exitosamente",
      });
    } catch (error) {
      return res.status(500).json({ error: "Error en el servidor" });
    }
  };  

// Obtener todos los estudiantes en cursos
export const getEstudiantesCursos = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from("estudiantes_cursos").select(
      `
      id,
      estado,
      usuario: usuario_id (id, nombre), 
      curso: curso_id (id, nombre)
      `
    );

    if (error) {
      return res.status(500).json({ error: "Error al obtener estudiantes en cursos" });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

export const getEstudiantesByCursoId = async (req: Request, res: Response) => {
    try {
      const { cursoId } = req.params;
  
      const { data, error } = await supabase
        .from("estudiantes_cursos")
        .select(`
          id,
          estado,
          usuario: usuario (
            id,
            nombre,
            email
          )
        `)
        .eq("curso_id", cursoId);
  
      if (error) {
        return res.status(500).json({ error: "Error al obtener estudiantes del curso" });
      }
  
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ error: "Error en el servidor" });
    }
  };

// Obtener un estudiante en curso por ID
export const getEstudianteCursoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("estudiantes_cursos")
      .select(
        `
        id,
        estado,
        usuario: usuario_id (id, nombre), 
        curso: curso_id (id, nombre)
        `
      )
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return res.status(500).json({ error: "Error al obtener estudiante del curso" });
    }

    if (!data) {
      return res.status(404).json({ error: "Estudiante en curso no encontrado" });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

// Actualizar estado del estudiante en curso
export const updateEstudianteCurso = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
  
      const parsed = estudianteCursoSchema.partial().safeParse(req.body);
  
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.format() });
      }
  
      const updates = parsed.data;
  
      const { error } = await supabase
        .from("estudiantes_cursos")
        .update(updates)
        .eq("id", id);
  
      if (error) {
        // Detecta error por restricción UNIQUE
        if (error.code === "23505" || error.message.includes("duplicate key")) {
          return res.status(409).json({
            error: "Ya existe otro registro con el mismo estudiante y curso.",
          });
        }
  
        return res.status(500).json({
          error: "Error al actualizar estado del estudiante en curso",
          detalle: error.message,
        });
      }
  
      return res.json({ message: "Estado de estudiante actualizado correctamente" });
    } catch (error) {
      return res.status(500).json({ error: "Error en el servidor" });
    }
  };  

// Eliminar estudiante de curso
export const deleteEstudianteCurso = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("estudiantes_cursos").delete().eq("id", id);

    if (error) {
      return res.status(500).json({ error: "Error al eliminar estudiante de curso" });
    }

    return res.json({ message: "Estudiante eliminado del curso correctamente" });
  } catch (error) {
    return res.status(500).json({ error: "Error en el servidor" });
  }
};
