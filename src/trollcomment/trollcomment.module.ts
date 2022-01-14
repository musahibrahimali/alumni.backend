import { Module } from '@nestjs/common';
import { TrollcommentService } from './trollcomment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TrollComment, TrollCommentSchema } from './schemas/troll.comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TrollComment.name, schema: TrollCommentSchema },
    ]),
  ],
  providers: [TrollcommentService],
  exports: [TrollcommentService],
})
export class TrollcommentModule {}
