// src/routes/finanzas.routes.ts
import { Router } from "express";
import {
  createFinanza,
  getFinanzas,
  getFinanzaByBarrio,
  updateFinanza,
  deleteFinanza,
  getAllBarrios,
  getFinanzasPorBarrio,
} from "../controllers/finanzas.controller";

const router = Router();

router.post("/", createFinanza as any);
router.get("/barrios", getAllBarrios as any);
router.get("/barrio/:barrioId", getFinanzasPorBarrio as any)
router.get("/", getFinanzas as any);
router.get("/:barrio_id", getFinanzaByBarrio as any);
router.put("/:id", updateFinanza as any);
router.delete("/:id", deleteFinanza as any);

export default router;
