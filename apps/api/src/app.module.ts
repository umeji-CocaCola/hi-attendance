import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AttendanceController } from './attendance.controller';

@Module({
  imports: [],
  controllers: [AppController, AttendanceController], // ← ここに登録されていること
  providers: [],
})
export class AppModule {}
