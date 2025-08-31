import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async clockIn(userId: string) {
    const now = new Date();
    const record = await this.prisma.attendance.create({
      data: {
        userId,
        startedAt: now,
        status: 'WORKING',
      },
    });

    return {
      id: record.id,
      userId: record.userId,
      clockInAt: record.startedAt,
      message: `User ${record.userId} clocked in.`,
    };
  }
}
