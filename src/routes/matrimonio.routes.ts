// src/routes/matrimonios.routes.ts
import { Router } from "express";
import {
  getMatrimonios,
  getMatrimonioById,
  createMatrimonio,
  updateMatrimonio,
  deleteMatrimonio,
} from "../controllers/matrimonio.controller";

const router = Router();

router.get("/", getMatrimonios as any); // Obtener todos los matrimonios
router.get("/:id", getMatrimonioById as any); // Obtener matrimonio por ID
router.post("/", createMatrimonio as any); // Crear un nuevo matrimonio
router.put("/:id", updateMatrimonio as any); // Actualizar matrimonio por ID
router.delete("/:id", deleteMatrimonio as any); // Eliminar matrimonio por ID

export default router;
