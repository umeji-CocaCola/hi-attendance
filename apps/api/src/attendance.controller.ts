import { Controller, Post, Body, UseGuards, Request, Get, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from './auth/jwt.guard';
import { GetSummaryDto } from './dto/get-summary.dto';

@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('clock-in')
  async clockIn(@Request() req: any) {
    return this.attendanceService.clockIn(req.user.userId);
  }
  @Post('clock-out')
  async clockOut(@Request() req: any) {
    return this.attendanceService.clockOut(req.user.userId);
  }
  @Post('break-start')
  async breakStart(@Request() req: any) {
    return this.attendanceService.breakStart(req.user.userId);
  }
  @Post('break-end')
  async breakEnd(@Request() req: any) {
    return this.attendanceService.breakEnd(req.user.userId);
  }

  @Get('summary')
  async getSummary(@Request() req: any, @Query() q: GetSummaryDto) {
    return this.attendanceService.getMonthlySummary(req.user.userId, q.month);
  }
}
