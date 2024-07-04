-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "MemberType" AS ENUM ('KIDS', 'MEN', 'WOMEN', 'YOUTH', 'YOUNGPRO');

-- CreateEnum
CREATE TYPE "ChurchStatus" AS ENUM ('NACS', 'ACS', 'REGULAR');

-- CreateEnum
CREATE TYPE "CellStatus" AS ENUM ('FIRST_TIMER', 'SECOND_TIMER', 'THIRD_TIMER', 'REGULAR');

-- CreateEnum
CREATE TYPE "ProcessLevel" AS ENUM ('NONE', 'PREENC', 'ENCOUNTER', 'LEADERSHIP_1', 'LEADERSHIP_2', 'LEADERSHIP_3');

-- CreateEnum
CREATE TYPE "CellType" AS ENUM ('SOULWINNING', 'OPEN', 'DISCIPLESHIP');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "isAlreadyLinked" BOOLEAN DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Disciple" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "member_type" "MemberType" NOT NULL,
    "process_level" "ProcessLevel" NOT NULL DEFAULT 'NONE',
    "cell_status" "CellStatus" NOT NULL DEFAULT 'FIRST_TIMER',
    "church_status" "ChurchStatus" NOT NULL DEFAULT 'NACS',
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
    "lesson_series_id" TEXT,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonsTakenByDisciple" (
    "lesson_id" TEXT NOT NULL,
    "disciple_id" TEXT NOT NULL,
    "lesson_taken_disciple_id" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LessonsTakenByDisciple_pkey" PRIMARY KEY ("lesson_taken_disciple_id")
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
    "lesson_name" TEXT,
    "scripture_references" TEXT[],
    "leaderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "assistant_id" TEXT,

    CONSTRAINT "CellReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CellReportAttendees" (
    "cell_report_id" TEXT NOT NULL,
    "disciple_id" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,
    "cell_report_attendee_id" TEXT NOT NULL,

    CONSTRAINT "CellReportAttendees_pkey" PRIMARY KEY ("cell_report_attendee_id")
);

-- CreateTable
CREATE TABLE "CellReportAssistant" (
    "disciple_id" TEXT NOT NULL,
    "disciple_report_id" TEXT NOT NULL,

    CONSTRAINT "CellReportAssistant_pkey" PRIMARY KEY ("disciple_report_id")
);

-- CreateTable
CREATE TABLE "CellGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "leaderId" TEXT NOT NULL,
    "members" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CellGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscipleProcessAttendanceRecord" (
    "discipleId" TEXT NOT NULL,
    "processAttendanceId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    CONSTRAINT "DiscipleProcessAttendanceRecord_pkey" PRIMARY KEY ("discipleId","processAttendanceId")
);

-- CreateTable
CREATE TABLE "ProcessAttendance" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcessAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessAttendanceEntry" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "lessonId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "attendees" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcessAttendanceEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Disciple_id_leaderId_idx" ON "Disciple"("id", "leaderId");

-- CreateIndex
CREATE INDEX "Disciple_leaderId_idx" ON "Disciple"("leaderId");

-- CreateIndex
CREATE INDEX "Disciple_userAccountId_idx" ON "Disciple"("userAccountId");

-- CreateIndex
CREATE INDEX "Lesson_lesson_series_id_idx" ON "Lesson"("lesson_series_id");

-- CreateIndex
CREATE INDEX "LessonsTakenByDisciple_disciple_id_idx" ON "LessonsTakenByDisciple"("disciple_id");

-- CreateIndex
CREATE INDEX "CellReport_leaderId_idx" ON "CellReport"("leaderId");

-- CreateIndex
CREATE INDEX "CellReport_assistant_id_idx" ON "CellReport"("assistant_id");

-- CreateIndex
CREATE INDEX "CellReport_lessonId_idx" ON "CellReport"("lessonId");

-- CreateIndex
CREATE INDEX "CellReportAttendees_cell_report_id_idx" ON "CellReportAttendees"("cell_report_id");

-- CreateIndex
CREATE INDEX "CellReportAttendees_disciple_id_idx" ON "CellReportAttendees"("disciple_id");

-- CreateIndex
CREATE INDEX "CellReportAssistant_disciple_id_idx" ON "CellReportAssistant"("disciple_id");

-- CreateIndex
CREATE INDEX "CellGroup_leaderId_idx" ON "CellGroup"("leaderId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disciple" ADD CONSTRAINT "Disciple_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "Disciple"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_lesson_series_id_fkey" FOREIGN KEY ("lesson_series_id") REFERENCES "LessonSeries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonsTakenByDisciple" ADD CONSTRAINT "LessonsTakenByDisciple_disciple_id_fkey" FOREIGN KEY ("disciple_id") REFERENCES "Disciple"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonsTakenByDisciple" ADD CONSTRAINT "LessonsTakenByDisciple_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CellReport" ADD CONSTRAINT "CellReport_assistant_id_fkey" FOREIGN KEY ("assistant_id") REFERENCES "CellReportAssistant"("disciple_report_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CellReport" ADD CONSTRAINT "CellReport_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "Disciple"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CellReport" ADD CONSTRAINT "CellReport_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CellReportAttendees" ADD CONSTRAINT "CellReportAttendees_cell_report_id_fkey" FOREIGN KEY ("cell_report_id") REFERENCES "CellReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CellReportAttendees" ADD CONSTRAINT "CellReportAttendees_disciple_id_fkey" FOREIGN KEY ("disciple_id") REFERENCES "Disciple"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CellReportAssistant" ADD CONSTRAINT "CellReportAssistant_disciple_id_fkey" FOREIGN KEY ("disciple_id") REFERENCES "Disciple"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CellGroup" ADD CONSTRAINT "CellGroup_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "Disciple"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscipleProcessAttendanceRecord" ADD CONSTRAINT "DiscipleProcessAttendanceRecord_discipleId_fkey" FOREIGN KEY ("discipleId") REFERENCES "Disciple"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscipleProcessAttendanceRecord" ADD CONSTRAINT "DiscipleProcessAttendanceRecord_processAttendanceId_fkey" FOREIGN KEY ("processAttendanceId") REFERENCES "ProcessAttendance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessAttendanceEntry" ADD CONSTRAINT "ProcessAttendanceEntry_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessAttendanceEntry" ADD CONSTRAINT "ProcessAttendanceEntry_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Disciple"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
