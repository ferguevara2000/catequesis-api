import { Router } from "express";
import { subscribePush } from "../controllers/subscribe.controller";

const router = Router();

router.post("/subscribe", subscribePush as any);

export default router;