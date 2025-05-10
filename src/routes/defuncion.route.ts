// src/routes/defunciones.routes.ts
import { Router } from "express";
import {
  getDefunciones,
  getDefuncionById,
  createDefuncion,
  updateDefuncion,
  deleteDefuncion,
} from "../controllers/defuncion.controller";

const router = Router();

router.get("/", getDefunciones as any);
router.get("/:id", getDefuncionById as any);
router.post("/", createDefuncion as any);
router.put("/:id", updateDefuncion as any);
router.delete("/:id", deleteDefuncion as any);

export default router;
