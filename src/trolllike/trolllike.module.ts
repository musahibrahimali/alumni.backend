import { Module } from '@nestjs/common';
import { TrolllikeService } from './trolllike.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TrollLike, TrollLikeSchema } from './schemas/troll.like.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TrollLike.name, schema: TrollLikeSchema },
    ]),
  ],
  providers: [TrolllikeService],
  exports: [TrolllikeService],
})

export class TrolllikeModule {}
