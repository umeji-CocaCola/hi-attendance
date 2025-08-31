import { Controller, Post, Body } from '@nestjs/common';
import { ClockInDto } from './dto/clock-in.dto';

@Controller('attendance')
export class AttendanceController {
  @Post('clock-in')
  clockIn(@Body() body: ClockInDto) {
    const now = new Date().toISOString();
    return {
      userId: body.userId,
      clockInAt: now, // 後でDBに入れる想定
      message: `User ${body.userId} clocked in.`,
    };
  }
}
