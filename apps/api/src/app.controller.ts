import { Controller, Get } from '@nestjs/common';

@Controller('') // 空でルートにぶら下げる
export class AppController {
  @Get('health')
  health() {
    return { ok: true };
  }
}
