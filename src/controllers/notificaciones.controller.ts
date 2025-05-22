import { Request, Response } from "express";
import { supabase } from "../lib/supabase";

export const getNotificacionesPorUsuario = async (req: Request, res: Response) => {
  const usuarioId = req.params.usuarioId;

  if (!usuarioId) {
    return res.status(400).json({ error: "Se requiere el ID del usuario" });
  }

  const { data, error } = await supabase
    .from("notificaciones_usuario")
    .select(`
      id,
      leida,
      comunicacion_id,
      comunicaciones (
        titulo,
        fecha,
        mensaje,
        enviado_por
      )
    `)
    .eq("usuario_id", usuarioId)
    .order("fecha_leido", { ascending: false }); // O usa fecha si prefieres

  if (error) {
    return res.status(500).json({
      error: "Error al obtener notificaciones",
      detalles: error,
    });
  }

  return res.status(200).json(data);
};

export const marcarNotificacionComoLeida = async (req: Request, res: Response) => {
  const notificacionId = req.params.id;

  if (!notificacionId) {
    return res.status(400).json({ error: "Se requiere el ID de la notificación" });
  }

  const { error } = await supabase
    .from("notificaciones_usuario")
    .update({ leida: true })
    .eq("id", notificacionId);

  if (error) {
    return res.status(500).json({
      error: "Error al actualizar notificación",
      detalles: error,
    });
  }

  return res.status(200).json({ mensaje: "Notificación marcada como leída" });
};

export const eliminarNotificacionUsuario = async (req: Request, res: Response) => {
  const notificacionId = req.params.id;

  if (!notificacionId) {
    return res.status(400).json({ error: "Se requiere el ID de la notificación" });
  }

  const { error } = await supabase
    .from("notificaciones_usuario")
    .delete()
    .eq("id", notificacionId);

  if (error) {
    return res.status(500).json({
      error: "Error al eliminar la notificación",
      detalles: error,
    });
  }

  return res.status(200).json({ mensaje: "Notificación eliminada correctamente" });
};


