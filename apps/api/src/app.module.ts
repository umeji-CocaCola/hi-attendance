import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AppController, AttendanceController],
  providers: [AttendanceService],
})
export class AppModule {}
