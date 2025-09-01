-- DropIndex
DROP INDEX "public"."Attendance_userId_idx";

-- AlterTable
ALTER TABLE "public"."Attendance" ADD COLUMN     "breakStartedAt" TIMESTAMP(3);
