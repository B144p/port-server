import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AboutMeModule } from './about-me/about-me.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ContactModule } from './contact/contact.module';
import { CorsOriginModule } from './cors-origin/cors-origin.module';
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
    AuthModule,
    AboutMeModule,
    EducationModule,
    ExperienceModule,
    ProjectModule,
    ContactModule,
    StatisticModule,
    CorsOriginModule,
    RouterModule.register([
      {
        path: 'v1',
        children: [
          { path: '', module: AuthModule },
          { path: '', module: AboutMeModule },
          { path: '', module: EducationModule },
          { path: '', module: ExperienceModule },
          { path: '', module: ProjectModule },
          { path: '', module: ContactModule },
          { path: '', module: StatisticModule },
          { path: '', module: CorsOriginModule },
        ],
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
