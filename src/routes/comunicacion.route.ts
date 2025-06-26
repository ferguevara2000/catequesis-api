import { Router } from "express";
import {
    createComunicacion,
    getComunicaciones,
    updateComunicacion,
    deleteComunicacion,
    getComunicadosParaTodos,
    getComunicacionById
  } from "../controllers/comunicacion.controller";

  const router = Router();

  router.post("/", createComunicacion as any);
  router.get("/", getComunicaciones as any);
  router.get("/todos", getComunicadosParaTodos as any);
  router.get("/:id", getComunicacionById as any);
  router.put("/:id", updateComunicacion as any);
  router.delete("/:id", deleteComunicacion as any);

  export default router;