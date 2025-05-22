// routes/notificaciones.routes.ts
import {
  eliminarNotificacionUsuario,
  getNotificacionesPorUsuario,
  marcarNotificacionComoLeida,
} from "../controllers/notificaciones.controller";
import { Router } from "express";

const router = Router();

router.get("/usuario/:usuarioId", getNotificacionesPorUsuario as any);
router.patch("/:id", marcarNotificacionComoLeida as any);
router.delete("/:id", eliminarNotificacionUsuario as any);

export default router;
