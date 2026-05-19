-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('anonymous', 'kakao');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "token" UUID NOT NULL,
    "nickname" VARCHAR(20) NOT NULL,
    "authProvider" "AuthProvider" NOT NULL DEFAULT 'anonymous',
    "kakaoId" VARCHAR(64),
    "email" VARCHAR(255),
    "profileImageUrl" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "hostId" INTEGER NOT NULL,
    "friendName" VARCHAR(20) NOT NULL,
    "birthday" DATE NOT NULL,
    "greeting" VARCHAR(60) NOT NULL,
    "color" CHAR(7) NOT NULL,
    "photoUrl" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "pageId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "photoUrl" TEXT,
    "cardColor" CHAR(7),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_token_key" ON "User"("token");

-- CreateIndex
CREATE UNIQUE INDEX "User_kakaoId_key" ON "User"("kakaoId");

-- CreateIndex
CREATE UNIQUE INDEX "Page_code_key" ON "Page"("code");

-- CreateIndex
CREATE INDEX "Page_hostId_idx" ON "Page"("hostId");

-- CreateIndex
CREATE INDEX "Message_pageId_createdAt_idx" ON "Message"("pageId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
