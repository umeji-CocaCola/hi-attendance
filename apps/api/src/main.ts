import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // DTO バリデーションを全体に適用
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTOに無いプロパティを除去
      forbidNonWhitelisted: true, // 余計なプロパティが来たら400
      transform: true, // ペイロードをDTO型に変換
    }),
  );

  // CORS（Next.jsローカルを許可）
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // もしプレフィックスを付けたい場合はコメントを外す（/api/health などに変わる）
  // app.setGlobalPrefix('api');

  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  await app.listen(port);
}

void bootstrap();
