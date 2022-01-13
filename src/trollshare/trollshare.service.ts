import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TrollShare, TrollShareModel } from './schemas/troll.share.schema';
import { Model } from 'mongoose';
import { TrollShareDto } from '../troll/dto/share.dto';

@Injectable()
export class TrollshareService {
    constructor(@InjectModel(TrollShare.name) private trollShareModel: Model<TrollShareModel>) {}

    // share troll
    async shareTroll(trollShare: TrollShareDto): Promise<TrollShare> {
        const newTrollShare = new this.trollShareModel(trollShare);
        return await newTrollShare.save();
    }
}
