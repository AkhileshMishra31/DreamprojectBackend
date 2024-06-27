// userOTPVerification.ts

export interface UserOTPVerification {
    userId: number;
    is_email_verified: boolean;
    verification_code?: string | null;
    verification_code_at?: Date | null;
    verification_type: VerificationType;
    is_phone_number_verified: boolean;
}

export enum VerificationType {
    EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
    LOGIN_OTP_VERIFICATION = 'LOGIN_OTP_VERIFICATION',
}


export interface EmailVerificationPayload {
    email: string;
    otp: string;
    type:string
}