import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  // 出勤打刻
  async clockIn(userId: string) {
    const existing = await this.prisma.attendance.findFirst({
      where: { userId, endedAt: null },
      select: { id: true, startedAt: true },
    });
    if (existing) {
      throw new ConflictException('Already clocked in without clock-out.');
    }

    const now = new Date();
    const record = await this.prisma.attendance.create({
      data: { userId, startedAt: now, status: 'WORKING' },
      select: { id: true, userId: true, startedAt: true },
    });

    return {
      id: record.id,
      userId: record.userId,
      clockInAt: record.startedAt,
      message: `User ${record.userId} clocked in.`,
    };
  }

  // 退勤打刻
  async clockOut(userId: string) {
    const open = await this.prisma.attendance.findFirst({
      where: { userId, endedAt: null },
      select: { id: true, startedAt: true, breakMinutes: true },
      orderBy: { startedAt: 'desc' },
    });
    if (!open) {
      throw new NotFoundException('No active attendance to clock-out.');
    }

    const end = new Date();
    const updated = await this.prisma.attendance.update({
      where: { id: open.id },
      data: {
        endedAt: end,
        status: 'OFF',
      },
      select: {
        id: true,
        userId: true,
        startedAt: true,
        endedAt: true,
        breakMinutes: true,
      },
    });

    return {
      id: updated.id,
      userId: updated.userId,
      clockInAt: updated.startedAt,
      clockOutAt: updated.endedAt,
      breakMinutes: updated.breakMinutes,
      message: `User ${updated.userId} clocked out.`,
    };
  }

  // 休憩開始
  async breakStart(userId: string) {
    const open = await this.prisma.attendance.findFirst({
      where: { userId, endedAt: null },
    });
    if (!open) {
      throw new NotFoundException('No active attendance to start break.');
    }
    if (open.breakStartedAt) {
      throw new ConflictException('Already on break.');
    }

    const updated = await this.prisma.attendance.update({
      where: { id: open.id },
      data: { breakStartedAt: new Date(), status: 'BREAK' },
      select: { id: true, userId: true, breakStartedAt: true },
    });

    return {
      id: updated.id,
      userId: updated.userId,
      breakStartedAt: updated.breakStartedAt,
      message: `User ${userId} started break.`,
    };
  }

  // 休憩終了
  async breakEnd(userId: string) {
    const open = await this.prisma.attendance.findFirst({
      where: { userId, endedAt: null },
    });
    if (!open) {
      throw new NotFoundException('No active attendance to end break.');
    }
    if (!open.breakStartedAt) {
      throw new BadRequestException('Break not started.');
    }

    const breakMinutes =
      open.breakMinutes + Math.floor((Date.now() - +open.breakStartedAt) / 60000);

    const updated = await this.prisma.attendance.update({
      where: { id: open.id },
      data: { breakStartedAt: null, breakMinutes, status: 'WORKING' },
      select: {
        id: true,
        userId: true,
        breakMinutes: true,
      },
    });

    return {
      id: updated.id,
      userId: updated.userId,
      breakMinutes: updated.breakMinutes,
      message: `User ${userId} ended break.`,
    };
  }
}
