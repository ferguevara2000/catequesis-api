import { Router } from "express";
import {
  createMovimiento,
  getMovimientos,
  getMovimientoById,
  updateMovimiento,
  deleteMovimiento,
  getMovimientosByBarrioId,
} from "../controllers/movimientos.controller";

const router = Router();

router.post("/", createMovimiento as any);
router.get("/", getMovimientos as any);
router.get("/:id", getMovimientoById as any);
router.get("/barrio/:barrio_id", getMovimientosByBarrioId as any);
router.put("/:id", updateMovimiento as any);
router.delete("/:id", deleteMovimiento as any);

export default router;
