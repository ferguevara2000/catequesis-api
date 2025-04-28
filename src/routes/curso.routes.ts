// src/routes/curso.routes.ts
import { Router } from "express";
import {
  createCurso,
  getCursos,
  getCursoById,
  updateCurso,
  deleteCurso,
} from "../controllers/curso.controller";

const router = Router();

// Rutas principales (suponiendo que usarás /api/cursos)
router.get("/", getCursos as any);
router.get("/:id", getCursoById as any);
router.post("/", createCurso as any);
router.put("/:id", updateCurso as any);
router.delete("/:id", deleteCurso as any);

export default router;
