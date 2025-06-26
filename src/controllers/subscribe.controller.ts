import { Request, Response } from "express";
import { supabase } from "../lib/supabase";

export const subscribePush = async (req: Request, res: Response) => {
  const { subscription } = req.body;

  if (!subscription) {
    return res.status(400).json({ error: "subscription es requerida" });
  }

  // Guarda la suscripción (sin usuario_id)
  const { error } = await supabase
    .from("push_subscriptions")
    .insert([{ subscription }]);

  if (error) {
    return res.status(500).json({ error: "Error al guardar la suscripción", detalles: error });
  }

  return res.status(201).json({ mensaje: "Suscripción guardada correctamente" });
};