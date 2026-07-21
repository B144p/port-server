import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ViewInterceptor } from './view.interceptor';
import { ViewService } from './view.service';

@Module({
  providers: [
    ViewService,
    { provide: APP_INTERCEPTOR, useClass: ViewInterceptor },
  ],
  exports: [ViewService],
})
export class ViewModule {}
