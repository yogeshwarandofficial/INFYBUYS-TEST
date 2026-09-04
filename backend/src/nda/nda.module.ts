import { Module } from '@nestjs/common';
import { NdaController } from './nda.controller';
import { NdaService } from './nda.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [NdaController],
  providers: [NdaService],
  exports: [NdaService],
})
export class NdaModule {}
