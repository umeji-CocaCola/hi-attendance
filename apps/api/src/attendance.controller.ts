import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt.guard';
import { AttendanceService } from './attendance.service';

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
}
