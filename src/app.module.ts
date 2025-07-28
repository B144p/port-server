import { Module } from '@nestjs/common';
import { AboutMeModule } from './about-me/about-me.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EducationModule } from './education/education.module';
import { PrismaModule } from './prisma/prisma.module';
import { ExperienceModule } from './experience/experience.module';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [
    PrismaModule,
    AboutMeModule,
    EducationModule,
    ExperienceModule,
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
