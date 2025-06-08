// src/routes/estudianteCurso.routes.ts
import express from "express";
import {
  createEstudianteCurso,
  getEstudiantesSinCurso,
  getEstudianteCursoById,
  updateEstudianteCurso,
  deleteEstudianteCurso,
  getEstudiantesByCursoId,
  getEstudiantesCursos,
  getCursoByEstudianteId,
} from "../controllers/estudianteCurso.controller";

const router = express.Router();

// Rutas para estudiantes en cursos
router.get("/", getEstudiantesCursos as any);
router.get("/estudiantes", getEstudiantesSinCurso as any);
router.get("/estudiante/:usuarioId", getCursoByEstudianteId as any);
router.get("/curso/:cursoId", getEstudiantesByCursoId as any);
router.get("/:id", getEstudianteCursoById as any);
router.post("/", createEstudianteCurso as any);
router.put("/:id", updateEstudianteCurso as any);
router.delete("/:id", deleteEstudianteCurso as any);

export default router;
