// src/services/userService.ts

import { Prisma, UserOTPVerification } from "@prisma/client";
import prisma from "../util/db";
import { AppError } from "../util/AppError";
import { EmailVerificationPayload } from "../interfaces/common";
import { user_service } from "./user.service";

const { userOTPVerification: UserOTPVerification } = prisma



export const generateVerificationOtponSignup = async (otp_data: UserOTPVerification) => {
    // Your logic to fetch a single user
    return await UserOTPVerification.create({
        data: {
            ...otp_data
        }
    })
};


export const emailOtpverification = async (value: EmailVerificationPayload) => {
    const user = await user_service.findUser(value.email);
    if (!user) {
        throw new AppError("No user Found ", 400)
    }
    // check for otp_details
    const user_related_query = { userId: user.id }
    const user_otp_details = await UserOTPVerification.findFirst({
        where: {
            ...user_related_query
        }
    })
    if (!user_otp_details || !user_otp_details?.verification_code_at) {
        throw new AppError("No Otp is sent for this account ", 400)
    }
    // check for expiry
    if (parseInt(value.otp) != parseInt(user_otp_details.verification_code as string)) {
        throw new AppError("this otp is not valid", 400)
    }

    const currentTimestamp = new Date();
    const verificationTimestamp = user_otp_details.verification_code_at;

    // Calculate the difference in milliseconds
    const timeDifference = currentTimestamp.getTime() - verificationTimestamp.getTime();
    const timeDifferenceMinutes = timeDifference / (1000 * 60); // Convert milliseconds to minutes

    if (timeDifferenceMinutes > 5) {
        throw new AppError("this otp is expired", 400)
    }

    if (value.type != user_otp_details.verification_type) {
        throw new AppError("this otp is not valid", 400)
    }

    const verification_details = await UserOTPVerification.update({
        where: {
            id: user.id
        },
        data: {
            is_email_verified: true,
            verification_code: undefined,
            verification_code_at: undefined,
            email_verified_at: new Date(),
            verification_type: undefined
        }
    })
    return {
        ...verification_details
    }

}

const getOtpverificationInfo=async(user_id:number)=>{
      const otp_details= await UserOTPVerification.findFirst({
         where:{
            userId:user_id
         }
      })

      return otp_details
}

export const user_otp_service = {
    generateVerificationOtponSignup,
    emailOtpverification,
    getOtpverificationInfo
};


