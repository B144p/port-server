import { Module } from '@nestjs/common';
import { AboutMeModule } from './about-me/about-me.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactModule } from './contact/contact.module';
import { EducationModule } from './education/education.module';
import { ExperienceModule } from './experience/experience.module';
import { HttpModule } from './http/http.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectModule } from './project/project.module';
import { StatisticModule } from './statistic/statistic.module';

@Module({
  imports: [
    PrismaModule,
    HttpModule,
    AboutMeModule,
    EducationModule,
    ExperienceModule,
    ProjectModule,
    ContactModule,
    StatisticModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
