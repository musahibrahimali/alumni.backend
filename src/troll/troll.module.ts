import { Module } from '@nestjs/common';
import { TrollService } from './troll.service';
import { TrollController } from './troll.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Troll, TrollSchema } from './schemas/troll.schema';
import { MulterModule } from '@nestjs/platform-express';
import { GridFsMulterConfigService } from './multer/gridfs.multer.service';
import { TrollLike, TrollLikeSchema } from './schemas/troll.like.schema';
import { TrollShare, TrollShareSchema } from './schemas/troll.share.schema';
import { TrollComment, TrollCommentSchema } from './schemas/troll.comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Troll.name, schema: TrollSchema,
        discriminators:[
          {name: TrollComment.name, schema: TrollCommentSchema},
          {name: TrollLike.name, schema: TrollLikeSchema},
          {name: TrollShare.name, schema: TrollShareSchema},
        ],
      },
    ]),
    MulterModule.registerAsync({
      useClass: GridFsMulterConfigService,
    }),
  ],
  providers: [TrollService],
  controllers: [TrollController],
  exports: [TrollService],
})
export class TrollModule {}
