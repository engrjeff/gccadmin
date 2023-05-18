/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "MemberType" AS ENUM ('KIDS', 'MEN', 'WOMEN', 'YOUTH', 'YOUNGPRO');

-- CreateEnum
CREATE TYPE "ProcessLevel" AS ENUM ('NEW', 'PREENC', 'ENCOUNTER', 'LEADERSHIP1', 'LEADERSHIP2', 'LEADERSHIP3');

-- CreateEnum
CREATE TYPE "CellType" AS ENUM ('SOULWINNING', 'OPEN', 'DISCIPLESHIP');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "Disciple" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "member_type" "MemberType" NOT NULL,
    "process_level" "ProcessLevel" NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isMyPrimary" BOOLEAN NOT NULL DEFAULT false,
    "leaderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userAccountId" TEXT,

    CONSTRAINT "Disciple_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonSeries" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonSeries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "file_url" TEXT,
    "scripture_references" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "discipleId" TEXT,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CellReport" (
    "id" TEXT NOT NULL,
    "type" "CellType" NOT NULL,
    "venue" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "has_custom_lesson" BOOLEAN NOT NULL DEFAULT false,
    "lessonId" TEXT,
    "lessonName" TEXT NOT NULL,
    "leaderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CellReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CellReportAttendees" (
    "cell_report_id" TEXT NOT NULL,
    "disciple_id" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    CONSTRAINT "CellReportAttendees_pkey" PRIMARY KEY ("cell_report_id","disciple_id")
);

-- AddForeignKey
ALTER TABLE "Disciple" ADD CONSTRAINT "Disciple_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "Disciple"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_discipleId_fkey" FOREIGN KEY ("discipleId") REFERENCES "Disciple"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CellReport" ADD CONSTRAINT "CellReport_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CellReport" ADD CONSTRAINT "CellReport_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "Disciple"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CellReportAttendees" ADD CONSTRAINT "CellReportAttendees_cell_report_id_fkey" FOREIGN KEY ("cell_report_id") REFERENCES "CellReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CellReportAttendees" ADD CONSTRAINT "CellReportAttendees_disciple_id_fkey" FOREIGN KEY ("disciple_id") REFERENCES "Disciple"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
