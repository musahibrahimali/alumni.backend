import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TrollLike, TrollLikeModel } from './schemas/troll.like.schema';
import { Model } from 'mongoose';
import { TrollLikeDto } from '../troll/dto/like.dto';

@Injectable()
export class TrolllikeService {
    constructor(@InjectModel(TrollLike.name) private trollLikeModel:Model<TrollLikeModel>) {}

    // like troll
    async likeTroll(trollLike:TrollLikeDto):Promise<TrollLike> {
        const newTrollLike = new this.trollLikeModel(trollLike);
        return await newTrollLike.save();
    }

    // unlike troll
    async unlikeTroll(id:string):Promise<TrollLike> {
        return await this.trollLikeModel.findByIdAndDelete(id);
    }
}
