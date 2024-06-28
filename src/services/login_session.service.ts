// src/services/userService.ts

import { Prisma, UserOTPVerification } from "@prisma/client";
import prisma from "../util/db";
import { AppError } from "../util/AppError";
import { EmailVerificationPayload } from "../interfaces/common";
import { user_service } from "./user.service";

const { userLoginSession: UserLoginSession } = prisma



export const getLoginSessionStatus = async (session: string) => {
    // Your logic to fetch a single user
    return await UserLoginSession.findFirst({
        where: {
            session
        }
    })
    
};



export const user_otp_service = {
    getLoginSessionStatus,
};


