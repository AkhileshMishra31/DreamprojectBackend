// src/controllers/userController.ts

import { Request, Response } from 'express';

import { catchAsync } from '../middlewares/applymiddleware';
// import SignupValidation from '../validations/authvalidation';
import { AppError } from '../util/AppError';
import { emailVerificationValidation } from '../validations/userotpverification';
import { user_otp_service } from '../services/user_otp_verification.service';





const emailOtpverification = async (req: Request, res: Response) => {
    const { value, error } = emailVerificationValidation(req.body)
    if (error) {
        throw new AppError(error.message, 400)
    }
    const user_otp_verification = await user_otp_service.emailOtpverification(value)

    return res.json({
        success: true,
        data: user_otp_verification
    })
}

// export const getOneUser = async (req: Request, res: Response) => {
//     const userId = req.params.userId;

//     const user = await auth_service.getOneUser(userId);
//     res.json(user);
// };

export const user_otp_controller = {
    emailOtpverification: catchAsync(emailOtpverification)
};

