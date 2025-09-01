import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  // 出勤打刻
  async clockIn(userId: string) {
    // すでに出勤中ならエラー
    const existing = await this.prisma.attendance.findFirst({
      where: { userId, endedAt: null },
    });
    if (existing) {
      throw new ConflictException('すでに出勤中です');
    }

    const now = new Date();
    const record = await this.prisma.attendance.create({
      data: {
        userId,
        startedAt: now,
        breakMinutes: 0,
        status: 'WORKING', // ★ 必須フィールドを付与
      },
    });

    return { userId, clockInAt: record.startedAt, message: `User ${userId} clocked in.` };
  }

  // 休憩開始
  async breakStart(userId: string) {
    const record = await this.prisma.attendance.findFirst({
      where: { userId, endedAt: null, breakStartedAt: null },
    });
    if (!record) {
      throw new NotFoundException('出勤中レコードが見つからない、または休憩中です');
    }

    const updated = await this.prisma.attendance.update({
      where: { id: record.id },
      data: {
        breakStartedAt: new Date(),
        status: 'BREAK', // ★ 状態遷移（任意だが推奨）
      },
    });

    return {
      userId,
      breakStartedAt: updated.breakStartedAt,
      message: `User ${userId} break started.`,
    };
  }

  // 休憩終了
  async breakEnd(userId: string) {
    const record = await this.prisma.attendance.findFirst({
      where: { userId, endedAt: null, NOT: { breakStartedAt: null } },
    });
    if (!record || !record.breakStartedAt) {
      throw new NotFoundException('休憩中のレコードが見つかりません');
    }

    const now = new Date();
    const breakMinutes =
      record.breakMinutes + Math.ceil((now.getTime() - record.breakStartedAt.getTime()) / 60_000);

    const updated = await this.prisma.attendance.update({
      where: { id: record.id },
      data: {
        breakMinutes,
        breakStartedAt: null,
        status: 'WORKING', // ★ 元に戻す
      },
    });

    return { userId, breakMinutes, message: `User ${userId} break ended.` };
  }

  // 退勤打刻
  async clockOut(userId: string) {
    const record = await this.prisma.attendance.findFirst({
      where: { userId, endedAt: null },
    });
    if (!record) {
      throw new NotFoundException('出勤中レコードが見つかりません');
    }

    const now = new Date();

    // 退勤時に休憩中だったら自動で休憩終了
    let breakMinutes = record.breakMinutes;
    if (record.breakStartedAt) {
      breakMinutes += Math.ceil((now.getTime() - record.breakStartedAt.getTime()) / 60_000);
    }

    const updated = await this.prisma.attendance.update({
      where: { id: record.id },
      data: {
        endedAt: now,
        breakMinutes,
        breakStartedAt: null,
        status: 'OFF', // ★ 退勤状態
      },
    });

    // ★ totalMinutes 計算に now を使って nullable 回避
    const totalMinutes = Math.max(
      0,
      Math.ceil((now.getTime() - updated.startedAt.getTime()) / 60_000),
    );
    const workedMinutes = Math.max(0, totalMinutes - updated.breakMinutes);

    return {
      userId,
      clockInAt: updated.startedAt,
      clockOutAt: now,
      workedMinutes,
      breakMinutes: updated.breakMinutes,
      message: `User ${userId} clocked out.`,
    };
  }

  /** JSTで YYYY-MM-DD を作る */
  private toJstDateKey(d: Date): string {
    const jst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
    const yyyy = jst.getUTCFullYear();
    const mm = String(jst.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(jst.getUTCDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  /** 指定月（JST換算）の開始・終了（[start,end)） */
  private getMonthRangeUtc(month?: string): { start: Date; end: Date; monthText: string } {
    const now = new Date();
    const [y, m] = month
      ? month.split('-').map((v) => Number(v))
      : [now.getUTCFullYear(), now.getUTCMonth() + 1];

    const startJst = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0));
    const startUtc = new Date(startJst.getTime() - 9 * 60 * 60 * 1000);
    const endUtc = new Date(Date.UTC(y, m, 1, 0, 0, 0) - 9 * 60 * 60 * 1000);

    return {
      start: startUtc,
      end: endUtc,
      monthText: `${String(y)}-${String(m).padStart(2, '0')}`,
    };
  }

  // 月次サマリ（本人）
  async getMonthlySummary(userId: string, month?: string) {
    const { start, end, monthText } = this.getMonthRangeUtc(month);

    const records = await this.prisma.attendance.findMany({
      where: { userId, startedAt: { gte: start, lt: end }, NOT: { endedAt: null } },
      orderBy: { startedAt: 'asc' },
    });

    const days: Record<string, { workedMinutes: number; breakMinutes: number }> = {};
    let totalWorked = 0;
    let totalBreak = 0;

    for (const r of records) {
      if (!r.endedAt) continue;
      const totalMinutes = Math.max(
        0,
        Math.ceil((r.endedAt.getTime() - r.startedAt.getTime()) / 60_000),
      );
      const worked = Math.max(0, totalMinutes - r.breakMinutes);
      const key = this.toJstDateKey(r.startedAt);

      if (!days[key]) days[key] = { workedMinutes: 0, breakMinutes: 0 };
      days[key].workedMinutes += worked;
      days[key].breakMinutes += r.breakMinutes;
      totalWorked += worked;
      totalBreak += r.breakMinutes;
    }

    const dayList = Object.entries(days)
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([date, v]) => ({ date, ...v }));

    return {
      userId,
      month: monthText,
      days: dayList,
      totalWorkedMinutes: totalWorked,
      totalBreakMinutes: totalBreak,
    };
  }
}
