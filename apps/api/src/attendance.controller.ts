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
}
