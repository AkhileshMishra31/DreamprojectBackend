import express from 'express';
import { Router } from 'express';

import userRoutes from './userRoutes';
import userOtpRoutes from './userOtpRoutes'
// import postRoutes from './postRoutes';

const router: Router = Router();

// Mount user routes
router.use('/users', userRoutes);
router.use('/otp',userOtpRoutes)

// Mount post routes
// router.use('/posts', postRoutes);

export default router;
