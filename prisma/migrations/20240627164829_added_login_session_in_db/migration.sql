-- CreateTable
CREATE TABLE "UserLoginSession" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "session" TEXT NOT NULL,

    CONSTRAINT "UserLoginSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserLoginSession_userId_key" ON "UserLoginSession"("userId");

-- AddForeignKey
ALTER TABLE "UserLoginSession" ADD CONSTRAINT "UserLoginSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
