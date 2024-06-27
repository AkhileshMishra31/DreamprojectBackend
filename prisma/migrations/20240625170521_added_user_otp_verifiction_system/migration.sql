-- CreateEnum
CREATE TYPE "Verification_type" AS ENUM ('EMAIL_VERIFICATION', 'LOGIN_OTP_VERIFICATION');

-- CreateTable
CREATE TABLE "UserOTPVerification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
    "verification_code" TEXT,
    "verification_code_at" TIMESTAMP(3),
    "verification_type" "Verification_type" NOT NULL DEFAULT 'EMAIL_VERIFICATION',
    "is_phone_number_verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserOTPVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserOTPVerification_userId_key" ON "UserOTPVerification"("userId");

-- AddForeignKey
ALTER TABLE "UserOTPVerification" ADD CONSTRAINT "UserOTPVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
