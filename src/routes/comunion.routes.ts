// src/routes/comuniones.routes.ts
import { Router } from "express";
import {
  getComuniones,
  getComunionById,
  createComunion,
  updateComunion,
  deleteComunion,
} from "../controllers/comunion.controller";

const router = Router();

router.get("/", getComuniones as any);
router.get("/:id", getComunionById as any);
router.post("/", createComunion as any);
router.put("/:id", updateComunion as any);
router.delete("/:id", deleteComunion as any);

export default router;
