import { Router } from "express";
import {
    createComunicacion,
    getComunicaciones,
    updateComunicacion,
    deleteComunicacion
  } from "../controllers/comunicacion.controller";

  const router = Router();

  router.post("/", createComunicacion as any);
  router.get("/", getComunicaciones as any);
  router.put("/:id", updateComunicacion as any);
  router.delete("/:id", deleteComunicacion as any);

  export default router;