import { Router } from 'express';
import {
  getCertificaciones,
  getCertificacionById,
  createCertificacion,
  updateCertificacion,
  deleteCertificacion,
  getCertificacionesByUsuarioId
} from '../controllers/certificaciones.controller';

const router = Router();

router.get('/', getCertificaciones as any);
router.get('/usuario/:usuario_id', getCertificacionesByUsuarioId as any);
router.get('/:id', getCertificacionById as any);
router.post('/', createCertificacion as any);
router.put('/:id', updateCertificacion as any);
router.delete('/:id', deleteCertificacion as any);

export default router;
