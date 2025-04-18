import { RequestHandler, Router } from 'express';
import { login, logout } from '../controllers/auth.controller'; 
const router = Router();

router.post('/login', login as RequestHandler);
router.post('/logout', logout)

export default router;
