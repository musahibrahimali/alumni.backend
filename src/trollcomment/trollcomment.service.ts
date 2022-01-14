import { Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TrollComment, TrollCommentModel } from './schemas/troll.comment.schema';
import { Model } from 'mongoose';
import { TrollCommentDto } from 'src/troll/dto/comment.dto';
import {ITrollComment} from 'src/interface/interfaces';

@Injectable()
export class TrollcommentService {
    constructor(
        @InjectModel(TrollComment.name) private trollCommentModel:Model<TrollCommentModel>,
    ) {}

    // comment troll
    async commentTroll(trollComment: TrollCommentDto): Promise<ITrollComment | any> {
        const commentDto = {
            user: trollComment.user,
            troll : trollComment.troll,
            comment: trollComment.comment,
        };
        const newTrollComment = new this.trollCommentModel(commentDto);
        return await newTrollComment.save();
    }

    // delete troll comment
    async deleteTrollComment(id: string): Promise<TrollComment> {
        return await this.trollCommentModel.findByIdAndDelete(id);
    }

    // get troll comments
    async getTrollComments(trollId: string): Promise<TrollComment[]> {
        try{
            const comments = await this.trollCommentModel.find({troll: trollId});
            return comments;
        }catch(error){
            return error;
        }
    }
}
