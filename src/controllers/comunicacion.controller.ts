import { Request, Response } from "express";
import { supabase } from "../lib/supabase";
import { comunicacionSchema } from "../schemas/comunicacion.schema";
import { enviarCorreoNotificacion } from "../utils/emailTest";
import webpush from "web-push";

// Configura tus claves VAPID (puedes ponerlas en variables de entorno)
webpush.setVapidDetails(
  "mailto:ferguevara3c@gmail.com",
  "BIiF29te7oMuYrMajQS6vztjRsrEFWSpWANnF0lqmVKsNSIXuVgY3m_y13Q-rDcypkcJikpFj46M0ijGmKIXhqc",
  "bzC1-BMlbEc1_7NGy6UVtyPSx3FmdgOXxTAZMMbXhjI"
);

export const createComunicacion = async (req: Request, res: Response) => {
  const parsed = comunicacionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Validación fallida",
      detalles: parsed.error.errors,
    });
  }

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

  const mapDirigidoARol: Record<string, string> = {
    Catequistas: "Catequista",
    Estudiantes: "Estudiante",
  };

  const rolesFiltrados = dirigidoA
    .filter((rol) => rol !== "Todos")
    .map((rol) => mapDirigidoARol[rol])
    .filter(Boolean);

  let usuariosQuery = supabase.from("usuario").select("id, email");

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

  await enviarCorreoNotificacion({
    destinatarios: usuarios.map((u) => u.email), // asegúrate de que estés consultando los emails
    asunto: "Nueva comunicación de la parroquia",
    mensajeHtml: `<p>${comunicacion.titulo}</p><p>${comunicacion.mensaje}</p>`,
  });

  // OBTENER SUSCRIPCIONES PUSH DE LOS USUARIOS
    const { data: subs, error: subsError } = await supabase
    .from("push_subscriptions")
    .select("*");

  if (!subsError && subs) {
    const payload = JSON.stringify({
      title: "Nuevo comunicado de la parroquia",
      body: comunicacion.titulo,
      url: "http://localhost:3000/comunicados/" + comunicacion.id,
    });

    for (const sub of subs) {
      try {
        await webpush.sendNotification(sub.subscription, payload);
      } catch (err) {
        // Puedes loguear el error si la suscripción ya no es válida
        console.error("Error enviando push:", err);
      }
    }
  }

  return res.status(201).json({
    mensaje: "Comunicación creada, notificaciones guardadas y correos enviados",
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

export const getComunicacionById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("comunicaciones")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(404).json({
      error: "No se pudo encontrar el comunicado",
      detalles: error.message,
    });
  }

  return res.json(data);
};

export const getComunicadosParaTodos = async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("comunicaciones")
    .select("*")
    .contains("dirigido_a", ["Todos"])
    .order("fecha", { ascending: false });

  if (error) return res.status(500).json(error);
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
  