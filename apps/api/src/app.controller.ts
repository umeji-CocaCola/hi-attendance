import { Controller, Get } from '@nestjs/common';

@Controller('')
export class AppController {
  // ← default ではなく named export
  @Get('health')
  health() {
    return { ok: true };
  }
}
