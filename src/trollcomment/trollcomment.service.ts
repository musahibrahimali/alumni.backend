import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TrollComment, TrollCommentModel } from './schemas/troll.comment.schema';
import { Model } from 'mongoose';
import { TrollCommentDto } from '../troll/dto/comment.dto';
import * as mongoose from 'mongoose';

@Injectable()
export class TrollcommentService {
    constructor(@InjectModel(TrollComment.name) private trollCommentModel:Model<TrollCommentModel>) {}

    // comment troll
    async commentTroll(trollComment: TrollCommentDto): Promise<TrollComment> {
        // convert the user id to object id
        const user = new mongoose.Types.ObjectId(trollComment.user);
        const troll = new mongoose.Types.ObjectId(trollComment.troll);
        const commentDto = {
            user,
            troll,
            comment: trollComment.comment,
            images: trollComment.images,
            videos: trollComment.videos,
        };
        const newTrollComment = await new this.trollCommentModel(commentDto);
        return await newTrollComment.save();
    }

    // delete troll comment
    async deleteTrollComment(id: string): Promise<TrollComment> {
        return await this.trollCommentModel.findByIdAndDelete(id);
    }
}
