import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.enableCors(); // allow the frontend to call the API
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
