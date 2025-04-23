import { supabase } from '../lib/supabase';

export const getAllUsuarios = async () => {
  const { data, error } = await supabase
    .from('usuario')
    .select('id, nombre, usuario, rol, email, phone');

  if (error) throw error;
  return data;
};

export const getUsuarioById = async (id: number) => {
  const { data, error } = await supabase
    .from('usuario')
    .select('id, nombre, usuario, rol, email, phone')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createUsuario = async (nombre: string, usuario: string, contraseña: string, rol: string, email:string, phone:string) => {
  const { data, error } = await supabase
    .from('usuario')
    .insert([{ nombre, usuario, contraseña, rol, email, phone }])
    .select('id, nombre, usuario, rol, email, phone')
    .single();

  if (error) throw error;
  return data;
};

export const updateUsuario = async (id: number, nombre: string, usuario: string, rol: string, email:string, phone:string) => {
  const { data, error } = await supabase
    .from('usuario')
    .update({ nombre, usuario, rol, email, phone })
    .eq('id', id)
    .select('id, nombre, usuario, rol, email, phone')
    .single();

  if (error) throw error;
  return data;
};

export const deleteUsuario = async (id: number) => {
  const { data, error } = await supabase
    .from('usuario')
    .delete()
    .eq('id', id)
    .select('id')
    .single();

  if (error) throw error;
  return data;
};
