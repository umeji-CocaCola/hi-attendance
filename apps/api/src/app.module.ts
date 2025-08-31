import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [], // ← ここを空にする
})
export class AppModule {}
