import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TrollShare, TrollShareModel } from './schemas/troll.share.schema';
import { Model } from 'mongoose';
import { TrollShareDto } from 'src/troll/dto/share.dto';
import { Client } from 'src/client/schemas/client.schema';
import {ITrollShare} from 'src/interface/interfaces';

@Injectable()
export class TrollshareService {
    constructor(@InjectModel(TrollShare.name) private trollShareModel: Model<TrollShareModel | any>) {}

    // share troll
    async shareTroll(trollShare: TrollShareDto): Promise<ITrollShare> {
        const newTrollShare = new this.trollShareModel(trollShare);
        return await newTrollShare.save();
    }

    // get the troll shares
    async getTrollShares(trollId: string): Promise<ITrollShare[] | any[]> {
        const trollShares = await this.trollShareModel.find({ troll: trollId });
        return trollShares;
    }
}
