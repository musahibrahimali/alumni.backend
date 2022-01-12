import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { New, NewsSchema } from './schemas/news.schema';
import { MulterModule } from '@nestjs/platform-express';
import { GridFsMulterConfigService } from './multer/gridfs.multer.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: New.name, schema: NewsSchema},
    ]),
    MulterModule.registerAsync({
      useClass: GridFsMulterConfigService,
    }),
  ],
  providers: [NewsService],
  controllers: [NewsController],
  exports: [NewsService],
})
export class NewsModule {}
