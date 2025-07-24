import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AboutMeModule } from './about-me/about-me.module';

@Module({
  imports: [PrismaModule, AboutMeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
