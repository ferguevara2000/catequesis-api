import { Request, Response } from "express";
import { supabase } from "../lib/supabase";
import { comunicacionSchema } from "../schemas/comunicacion.schema";

export const createComunicacion = async (req: Request, res: Response) => {
  const parsed = comunicacionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Validación fallida",
      detalles: parsed.error.errors,
    });
  }

  // Insertar la comunicación
  const { data, error } = await supabase
    .from("comunicaciones")
    .insert([parsed.data])
    .select()
    .single();

  if (error) {
    return res.status(500).json({
      error: "Error al insertar comunicación",
      detalles: error,
    });
  }

  const comunicacion = data;
  const dirigidoA: string[] = comunicacion.dirigido_a;

  // Mapeo para convertir los valores del frontend a los valores reales del campo "rol"
  const mapDirigidoARol: Record<string, string> = {
    Catequistas: "Catequista",
    Estudiantes: "Estudiante",
  };

  const rolesFiltrados = dirigidoA
    .filter((rol) => rol !== "Todos")
    .map((rol) => mapDirigidoARol[rol])
    .filter(Boolean); // Por si acaso hay alguno no mapeado

  let usuariosQuery = supabase.from("usuario").select("id");

  if (!dirigidoA.includes("Todos")) {
    usuariosQuery = usuariosQuery.in("rol", rolesFiltrados);
  }

  const { data: usuarios, error: usuariosError } = await usuariosQuery;

  if (usuariosError) {
    return res.status(500).json({
      error: "Error al obtener usuarios",
      detalles: usuariosError,
    });
  }

  // Crear las notificaciones
  const notificaciones = usuarios.map((usuario) => ({
    comunicacion_id: comunicacion.id,
    usuario_id: usuario.id,
    leida: false,
  }));

  const { error: errorNotificaciones } = await supabase
    .from("notificaciones_usuario")
    .insert(notificaciones);

  if (errorNotificaciones) {
    return res.status(500).json({
      error: "Error al insertar notificaciones",
      detalles: errorNotificaciones,
    });
  }

  return res.status(201).json({
    mensaje: "Comunicación creada y notificaciones enviadas",
    comunicacion,
  });
};

export const getComunicaciones = async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("comunicaciones")
    .select("*")
    .order("fecha", { ascending: false });

  if (error) {
    return res.status(500).json({ error: "Error al obtener comunicaciones", detalles: error });
  }

  return res.json(data);
};

export const updateComunicacion = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }
  
    const parsed = comunicacionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validación fallida", detalles: parsed.error.errors });
    }
  
    const { data, error } = await supabase
      .from("comunicaciones")
      .update(parsed.data)
      .eq("id", id)
      .select();
  
    if (error) {
      return res.status(500).json({ error: "Error al actualizar la comunicación", detalles: error });
    }
  
    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Comunicación no encontrada" });
    }
  
    return res.json(data[0]);
  };

  export const deleteComunicacion = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }
  
    const { error } = await supabase.from("comunicaciones").delete().eq("id", id);
  
    if (error) {
      return res.status(500).json({ error: "Error al eliminar la comunicación", detalles: error });
    }
  
    return res.json({ mensaje: "Comunicación eliminada correctamente" });
  };
  