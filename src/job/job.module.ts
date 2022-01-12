import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from './schemas/job.schema';
import { MulterModule } from '@nestjs/platform-express';
import { GridFsMulterConfigService } from './multer/gridfs.multer.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Job.name, schema: JobSchema},
    ]),
    MulterModule.registerAsync({
      useClass: GridFsMulterConfigService,
    }),
  ],
  providers: [JobService],
  controllers: [JobController],
  exports: [JobService],
})
export class JobModule {}
