// src/routes/bautismo.routes.ts
import { Router } from "express";
import {
  getBautismos,
  getBautismo,
  createBautismo,
  updateBautismo,
  deleteBautismo,
} from "../controllers/bautismo.controller";

const router = Router();

router.get("/", getBautismos as any);
router.get("/:id", getBautismo as any);
router.post("/", createBautismo as any);
router.put("/:id", updateBautismo as any);
router.delete("/:id", deleteBautismo as any);

export default router;
