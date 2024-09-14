-- CreateTable
CREATE TABLE "hero-image" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "hero-image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monthly-deal" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "days" TEXT,
    "hours" TEXT,
    "minutes" TEXT,
    "seconds" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "monthly-deal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserReview" (
    "id" TEXT NOT NULL,
    "fullName" TEXT,
    "rating" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "city" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserReview_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserReview" ADD CONSTRAINT "UserReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
