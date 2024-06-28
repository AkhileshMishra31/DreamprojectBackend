// src/controllers/userController.ts

import { Request, Response } from 'express';
import { auth_service } from '../services/auth.service';
import { catchAsync } from '../middlewares/applymiddleware';
// import SignupValidation from '../validations/authvalidation';
import { AppError } from '../util/AppError';
import { LoginValidation, SignupValidation, logInSessionValidation } from '../validations/authvalidation';


export const signup = async (req: Request, res: Response) => {

    const { value, error } = SignupValidation(req.body)
    if (error) {
        throw new AppError(error.message, 400)
    }
    const users = await auth_service.signup(value);


    return res.json({
        success: true,
        data: users
    })

};

const loginSession = async (req: Request, res: Response) => {
    const { value, error } = logInSessionValidation(req.body)
    if (error) {
        throw new AppError(error.message, 400)
    }
    const loginSession = await auth_service.loginSession(value);

    return res.json({
        success: true,
        data: loginSession
    })

}

export const login = async (req: Request, res: Response) => {
    const { value, error } = LoginValidation(req.body)
    if (error) {
        throw new AppError(error.message, 400)
    }
    const user = await auth_service.login(value);
    res.json(user);
};

export const auth_controller = {
    signup: catchAsync(signup),
    loginSession: catchAsync(loginSession),
    login: catchAsync(login)
};

