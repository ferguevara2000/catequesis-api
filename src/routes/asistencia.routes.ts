import { Router } from "express";
import {
  createAsistencia,
  getAsistencias,
  updateAsistencia,
  deleteAsistencia,
  getAsistenciaPorCursoYFecha,
  getFechasAsistenciaPorCurso,
} from "../controllers/asistencia.controller";

const router = Router();

router.get("/", getAsistencias as any);
router.get("/fechas/:cursoId", getFechasAsistenciaPorCurso as any);
router.post("/:matricula_id", getAsistenciaPorCursoYFecha as any);
router.post("/", createAsistencia as any);
router.put("/:id", updateAsistencia as any);
router.delete("/:id", deleteAsistencia as any);

export default router;
