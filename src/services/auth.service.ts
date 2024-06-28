// src/services/userService.ts

import { Prisma } from "@prisma/client";
import { Iuser,LoginCredentialsData,LoginParams } from "../interfaces/auth.inteface";
import prisma from "../util/db";
import { AppError } from "../util/AppError";
import { generateAccessToken, generateOTP, generateReferralCode, generateRefreshToken, generateSessionString, hashPassword, verifyPassword } from "../util/common";
import { user_otp_service } from "./user_otp_verification.service";
import { UserOTPVerification, VerificationType } from "../interfaces/common";
import { user_service } from "./user.service";
import { getLoginSessionStatus } from "./login_session.service";

const { user: User } = prisma

export const signup = async (user_data: Iuser) => {
    const user = await User.findFirst({ where: { email: user_data.email } })
    console.log("this is services user", user)
    if (user) {
        throw new AppError('Email is already been used', 404);
    }

    const isphone_number_taken = await User.findFirst({ where: { phonenumber: user_data.phoneNumber } })
    if (isphone_number_taken) {
        throw new AppError('this number  is already been used', 404);
    }
    const is_username_used = await User.findFirst({ where: { username: user_data.username } });
    console.log("is_username_used", is_username_used);
    if (is_username_used) {
        throw new AppError('This username has already been used', 404);
    }

    if (user_data.referralCode) {
        // chech who referred him
        const referral_user = await User.findFirst({
            where: {
                referred_by: user_data.referralCode,
            }
        })
        if (!referral_user) {
            throw new AppError('refrerral code is wrong', 404);
        }
    }

    // generate hisn own refreral code
    let referralCodeExists = true;
    let referralcode_for_user;

    do {
        referralcode_for_user = generateReferralCode(user_data.username);
        const existingUser = await User.findFirst({
            where: {
                referral_code: referralcode_for_user
            }
        });

        referralCodeExists = !!existingUser;  // True if existingUser is not null

    } while (referralCodeExists);
    // generate hashed password
    const hashedPassword: string = await hashPassword(user_data.password, 10)
    const newUser = await User.create({
        data: {
            username: user_data.username,
            email: user_data.email,
            password: hashedPassword,
            authmethod: "custom", // Assuming this defaults to "custom"
            region: user_data.region,
            address: user_data.address,
            referred_by: user_data.referredBy,
            phonenumber: user_data.phoneNumber,
        },
        select: {
            id: true,
            email: true,
            authmethod: true,
            region: true,
            address: true,
            referred_by: true,
            phonenumber: true
        }
    });

    const otp = generateOTP(4);

    // const otp_verification= await
    const otp_payload: UserOTPVerification = {
        userId: newUser.id,
        is_email_verified: false,
        verification_code: otp,
        verification_code_at: new Date(),
        verification_type: VerificationType.EMAIL_VERIFICATION,
        is_phone_number_verified: false
    };

    const user_otp = await user_otp_service.generateVerificationOtponSignup(otp_payload as any)
    if (!user_otp) {
        // delete user 
        await User.delete({
            where: {
                id: newUser.id
            }
        })
        throw new AppError("failed to create user", 400)
    }
    let otp_expiry_time;
    if (user_otp.verification_code_at) {
        const otp_expiry_time = new Date(user_otp.verification_code_at);
        otp_expiry_time.setMinutes(otp_expiry_time.getMinutes() + 5);
    }
    return {
        ...newUser,
        otp_expiry_time: otp_expiry_time
    }
};

export const loginSession = async ({ email, password, username }: LoginParams) => {
    // Your logic to fetch a single user
    const user = await User.findFirst({ where: { email: email } })
    if (!user) {
        throw new AppError("No user  with such email is found", 400)
    }

    const matchpassword = verifyPassword(password, user.password)

    if (!matchpassword) {
        throw new AppError("password does not match", 400)
    }
    const user_otp_details = await prisma.userOTPVerification.findFirst({ where: { userId: user.id, } })

    if (!user_otp_details || !user_otp_details.is_email_verified) {
        // otp is notr genrate
        const otp = generateOTP(4);
        const new_otp_details = await prisma.userOTPVerification.upsert({
            where: {
                userId: user.id
            },
            update: {
                verification_code: otp,
                verification_code_at: new Date(),
                verification_type: VerificationType.EMAIL_VERIFICATION,

            },
            create: {
                userId: user.id,
                is_email_verified: false,
                verification_code: otp,
                verification_code_at: new Date(),
                verification_type: VerificationType.EMAIL_VERIFICATION,
                is_phone_number_verified: false
            },
        })

        let otp_expiry_time;
        if (new_otp_details.verification_code_at) {
            const otp_expiry_time = new Date(new_otp_details.verification_code_at);
            otp_expiry_time.setMinutes(otp_expiry_time.getMinutes() + 5);
        }

        return {
            id: user.id,
            username: user.username,
            isEmailverified: false,
            otp_expiry_time: otp_expiry_time,
            loginSession: null,
        }

    }

    // create login session and 
    let session = generateSessionString()
    const loginSession = await prisma.userLoginSession.create({
        data: {
            userId: user.id,
            session
        }
    })

    if (!loginSession) {
        throw new AppError("Can not add loginsession error", 400)
    }

    return {
        id: user.id,
        username: user.username,
        isEmailverified: user_otp_details.is_email_verified,
        loginSession: session,
    }
};

export const login = async (value: LoginCredentialsData) => {
    const { email, loginSession } = value
    const user = await user_service.findUser(email)
    if (!user) { throw new AppError("no user is found", 403) }

    // check for isemail_verified
    let user_email_status = await user_otp_service.getOtpverificationInfo(user.id)
    if (!user_email_status) {
        throw new AppError("something went wrong please Contact us", 400)
    }

    if (!user_email_status.is_email_verified) {
        throw new AppError("Unauthorized Session", 400)
    }

    const login_session = await getLoginSessionStatus(loginSession)

    if (!login_session) {
        throw new AppError("Unauthorized Session", 400)
    }

    if (user.id != login_session.userId) {
        throw new AppError("Unauthorized Session", 400)
    }

    if (loginSession !== login_session.session) {
        throw new AppError("Provided session is wrong", 400)
    }

    // dlete login sesiion
    await prisma.userLoginSession.delete({
        where: {
            userId: user.id,
            session: loginSession
        }
    })

    await prisma.userOTPVerification.update({
        where: {
            id: user_email_status.id
        },
        data: {
            is_logged_in_verified: true,
            login_verified_at: new Date()
        }
    })

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 2); // Set expiration 2 days ahead
    await prisma.refreshToken.create({
        data: {
            userId: user.id,
            token: refreshToken,
            expiresAt: expiresAt
        }
    })
    return {
        username: user.username,
        email: user.email,
        accessToken: accessToken,
        refreshToken: refreshToken
    }

}

export const logout=async()=>{
    
}



export const auth_service = {
    signup,
    loginSession,
    login
};





