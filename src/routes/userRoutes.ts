// src/routes/postRoutes.ts
import { Router, Request, Response } from 'express';
import { auth_controller } from '../controllers/auth.controller';

const router: Router = Router();

router.post('/signup',auth_controller.signup);
router.post("/login-session", auth_controller.loginSession)
router.post("/login", auth_controller.login)

export default router;
