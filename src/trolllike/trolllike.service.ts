import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TrollLike, TrollLikeModel } from './schemas/troll.like.schema';
import { Model } from 'mongoose';
import { TrollLikeDto } from 'src/troll/dto/like.dto';
import {ITrollLike} from 'src/interface/interfaces';

@Injectable()
export class TrolllikeService {
    constructor(
        @InjectModel(TrollLike.name) private trollLikeModel:Model<TrollLikeModel>
    ) {}

    // like troll
    async likeTroll(trollLike:TrollLikeDto):Promise<ITrollLike | any> {
        const newTrollLike = new this.trollLikeModel(trollLike);
        return await newTrollLike.save();
    }

    // unlike troll
    async unlikeTroll(id:string):Promise<ITrollLike | any> {
        return await this.trollLikeModel.findByIdAndDelete(id);
    }

    // get the troll likes
    async getTrollLikes(trollId:string):Promise<ITrollLike[] | any[]> {
        // get all likes
        const trollLikes = await this.trollLikeModel.find({troll:trollId});
        return trollLikes;
    }
}
