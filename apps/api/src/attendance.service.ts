import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async clockIn(userId: string) {
    const existing = await this.prisma.attendance.findFirst({
      where: { userId, endedAt: null },
      select: { id: true, startedAt: true },
    });
    if (existing) throw new ConflictException('Already clocked in without clock-out.');

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

  async clockOut(userId: string) {
    // 未退勤レコードを検索
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
      select: { id: true, userId: true, startedAt: true, endedAt: true, breakMinutes: true },
    });

    // （任意）ここで労働時間の分計算を付けることも可能
    // const workedMs = +updated.endedAt! - +updated.startedAt - updated.breakMinutes * 60_000;
    // const workedMinutes = Math.max(0, Math.floor(workedMs / 60_000));

    return {
      id: updated.id,
      userId: updated.userId,
      clockInAt: updated.startedAt,
      clockOutAt: updated.endedAt,
      breakMinutes: updated.breakMinutes,
      // workedMinutes, // ← 表示したければ返す
      message: `User ${updated.userId} clocked out.`,
    };
  }
}
