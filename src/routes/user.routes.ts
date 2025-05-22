import { Router } from 'express';
import * as UsuarioController from '../controllers/user.controller';
import {getUsuarios} from '../controllers/user.controller';

const router = Router();

router.get('/', UsuarioController.getUsuarios as any);
router.get('/catequistas', UsuarioController.getCatequistas as any)
router.get('/estudiantes', UsuarioController.getEstudiantes as any)
router.get('/:id', UsuarioController.getUsuarioById as any);
router.post('/', UsuarioController.createUsuario as any);
router.put('/:id', UsuarioController.updateUsuario as any);
router.delete('/:id', UsuarioController.deleteUsuario as any);
router.patch('/:id/password', UsuarioController.updatePassword as any);
router.patch('/:id/userpassword', UsuarioController.updatePasswordWithVerification as any);

export default router;
