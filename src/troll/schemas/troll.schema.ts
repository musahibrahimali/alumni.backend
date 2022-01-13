import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';
import * as mongoose from 'mongoose';
import { Client } from '../../client/schemas/client.schema';
import { Type, Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';
import { TrollLike } from 'src/trolllike/schemas/troll.like.schema';
import { TrollComment } from 'src/trollcomment/schemas/troll.comment.schema';
import { TrollShare } from '../../trollshare/schemas/troll.share.schema';

export type TrollModel = Troll & Document;

@Schema({timestamps: true })
export class Troll{
    @Transform(({ value }) => value.toString())
    _id: ObjectId;

    @IsString()
    @Prop({required: false})
    post: string

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Client.name })
    @Type(() => Client)
    user: Client;

    @Prop({required:false})
    images: string[]

    @Prop({required:false})
    videos: string[]

    @Prop({required:false, type: [{ type: mongoose.Schema.Types.ObjectId, ref: TrollLike.name }]})
    @Type(() => TrollLike)
    likes: TrollLike[]

    @Prop({required:false, type: [{ type: mongoose.Schema.Types.ObjectId, ref: TrollComment.name }]})
    @Type(() => TrollComment)
    comments: [TrollComment]

    @Prop({required:false, type: [{ type: mongoose.Schema.Types.ObjectId, ref: TrollShare.name }]})
    @Type(() => TrollShare)
    shares: [TrollShare]
}

export const TrollSchema = SchemaFactory.createForClass(Troll);
