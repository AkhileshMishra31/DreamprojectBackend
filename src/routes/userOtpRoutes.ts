// src/routes/postRoutes.ts
import { Router, Request, Response } from 'express';
// import { auth_controller } from '../controllers/auth.controller';
import { user_otp_controller } from '../controllers/user_otp_verification.controller';

const router: Router = Router();

router.post('/email-verification',user_otp_controller.emailOtpverification);

export default router;
