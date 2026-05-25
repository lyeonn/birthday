import 'dotenv/config'; // .env 로딩 (DATABASE_URL 등)
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // 프론트에서 백엔드(3001) 호출 가능하게 CORS 열기
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3007'],
    credentials: true,
  });
  // DTO 클래스 데코레이터 기반 자동 검증 + 화이트리스트(허용되지 않은 필드는 제거)
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  // 업로드된 파일을 /uploads/* 로 정적 서빙
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });
  // 백엔드는 3001 (프론트 next dev가 3000 점유)
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
