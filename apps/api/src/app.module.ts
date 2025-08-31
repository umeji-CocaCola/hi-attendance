import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

@Module({
  imports: [],
  controllers: [AppController], // ← ここに登録されていること
  providers: [],
})
export class AppModule {}
