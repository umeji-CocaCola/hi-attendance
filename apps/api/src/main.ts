import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // web(Next.js) からのアクセスを許可
    credentials: true,
  });
  await app.listen(3001); // APIは3001に固定
}
void bootstrap();
