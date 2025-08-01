import { HttpModule as AxiosHttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [AxiosHttpModule],
  exports: [AxiosHttpModule],
})
export class HttpModule {}
