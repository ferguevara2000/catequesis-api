// src/routes/confirmaciones.routes.ts
import { Router } from "express";
import {
  getConfirmaciones,
  getConfirmacionById,
  createConfirmacion,
  updateConfirmacion,
  deleteConfirmacion,
} from "../controllers/confirmacion.controller";

const router = Router();

router.get("/", getConfirmaciones as any);
router.get("/:id", getConfirmacionById as any);
router.post("/", createConfirmacion as any);
router.put("/:id", updateConfirmacion as any);
router.delete("/:id", deleteConfirmacion as any);

export default router;
