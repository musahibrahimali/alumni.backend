import { Module } from '@nestjs/common';
import { TrollcommentService } from './trollcomment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { GridFsMulterConfigService } from './multer/gridfs.multer.service';
import { TrollComment, TrollCommentSchema } from './schemas/troll.comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TrollComment.name, schema: TrollCommentSchema },
    ]),
    MulterModule.registerAsync({
      useClass: GridFsMulterConfigService,
    }),
  ],
  providers: [TrollcommentService],
  exports: [TrollcommentService],
})
export class TrollcommentModule {}
