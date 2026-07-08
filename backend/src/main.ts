import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.enableCors({
  origin: true, // reflects the request origin — fine for dev
  credentials: true,
  }); // allow the frontend to call the API
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
