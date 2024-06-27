-- AlterTable
ALTER TABLE "UserOTPVerification" ADD COLUMN     "email_verified_at" TIMESTAMP(3),
ADD COLUMN     "login_verified_at" TIMESTAMP(3),
ALTER COLUMN "verification_type" DROP NOT NULL;
