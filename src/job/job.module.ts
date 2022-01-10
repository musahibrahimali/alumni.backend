import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';

@Module({
  imports: [],
  providers: [JobService],
  controllers: [JobController],
  exports: [JobService],
})
export class JobModule {}
