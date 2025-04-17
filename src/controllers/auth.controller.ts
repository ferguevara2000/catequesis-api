// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../lib/supabase';

export const login = async (req: Request, res: Response) => {
  const { usuario, password } = req.body;

  const { data: users, error } = await supabase
    .from('usuario')
    .select('*')
    .eq('usuario', usuario)
    .limit(1);

  if (error || !users || users.length === 0) {
    return res.status(401).json({ message: 'Usuario no encontrado' });
  }

  const user = users[0];

  const valid = await bcrypt.compare(password, user.contraseña);
  if (!valid) {
    return res.status(401).json({ message: 'Contraseña incorrecta' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '1d' }
  );

  // Guardamos JWT como cookie segura
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24, // 1 día
  });

  res.json({ message: 'Login exitoso' });
};
