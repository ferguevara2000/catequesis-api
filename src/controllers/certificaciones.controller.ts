import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';

// Obtener todas las certificaciones
export const getCertificaciones = async (_req: Request, res: Response) => {
  const { data, error } = await supabase.from('certificaciones').select('*');
  if (error) return res.status(500).json({ message: 'Error al obtener certificaciones', error });
  res.json(data);
};

// Obtener certificación por ID
export const getCertificacionById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('certificaciones').select('*').eq('id', id).single();
  if (error) return res.status(500).json({ message: 'Error al obtener certificación', error });
  res.json(data);
};

// Crear certificación
export const createCertificacion = async (req: Request, res: Response) => {
  const { matricula_id, porcentaje_asistencia } = req.body;
  const { data, error } = await supabase.from('certificaciones').insert({
    matricula_id,
    porcentaje_asistencia,
    fecha: new Date().toISOString()
  }).select().single();
  if (error) return res.status(500).json({ message: 'Error al crear certificación', error });
  res.status(201).json(data);
};

// Actualizar certificación
export const updateCertificacion = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { matricula_id, porcentaje_asistencia } = req.body;
  const { data, error } = await supabase.from('certificaciones').update({
    matricula_id,
    porcentaje_asistencia
  }).eq('id', id).select().single();
  if (error) return res.status(500).json({ message: 'Error al actualizar certificación', error });
  res.json(data);
};

// Eliminar certificación
export const deleteCertificacion = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { error } = await supabase.from('certificaciones').delete().eq('id', id);
  if (error) return res.status(500).json({ message: 'Error al eliminar certificación', error });
  res.status(204).send();
};
