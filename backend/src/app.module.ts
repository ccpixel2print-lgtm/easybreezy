import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CatalogModule } from './catalog/catalog.module';
import { ServiceabilityModule } from './serviceability/serviceability.module';

@Module({
  imports: [PrismaModule, CatalogModule, ServiceabilityModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
