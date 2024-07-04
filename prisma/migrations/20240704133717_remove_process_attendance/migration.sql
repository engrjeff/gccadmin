/*
  Warnings:

  - You are about to drop the `DiscipleProcessAttendanceRecord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProcessAttendance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProcessAttendanceEntry` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DiscipleProcessAttendanceRecord" DROP CONSTRAINT "DiscipleProcessAttendanceRecord_discipleId_fkey";

-- DropForeignKey
ALTER TABLE "DiscipleProcessAttendanceRecord" DROP CONSTRAINT "DiscipleProcessAttendanceRecord_processAttendanceId_fkey";

-- DropForeignKey
ALTER TABLE "ProcessAttendanceEntry" DROP CONSTRAINT "ProcessAttendanceEntry_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "ProcessAttendanceEntry" DROP CONSTRAINT "ProcessAttendanceEntry_teacherId_fkey";

-- DropTable
DROP TABLE "DiscipleProcessAttendanceRecord";

-- DropTable
DROP TABLE "ProcessAttendance";

-- DropTable
DROP TABLE "ProcessAttendanceEntry";
