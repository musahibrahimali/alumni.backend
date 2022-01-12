import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { GridFsMulterConfigService } from './multer/gridfs.multer.service';
import { Blog, BlogSchema } from './schemas/blog.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      {name: Blog.name, schema: BlogSchema},
    ]),
    MulterModule.registerAsync({
      useClass: GridFsMulterConfigService,
    }),
  ],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService]
})
export class BlogModule {}
