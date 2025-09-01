import { Controller, Post, Body } from '@nestjs/common';
import { ClockInDto } from './dto/clock-in.dto';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('clock-in')
  async clockIn(@Body() body: ClockInDto) {
    return this.attendanceService.clockIn(body.userId);
  }

  @Post('clock-out')
  async clockOut(@Body() body: ClockInDto) {
    return this.attendanceService.clockOut(body.userId);
  }

  @Post('break-start')
  async breakStart(@Body() body: ClockInDto) {
    return this.attendanceService.breakStart(body.userId);
  }

  @Post('break-end')
  async breakEnd(@Body() body: ClockInDto) {
    return this.attendanceService.breakEnd(body.userId);
  }
}
