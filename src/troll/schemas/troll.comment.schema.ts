import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId } from 'mongoose';
import { IsString } from "class-validator";
import * as mongoose from 'mongoose';
import { Client } from '../../client/schemas/client.schema';
import { Type, Transform } from 'class-transformer';
import { Troll } from './troll.schema';

export type TrollCommentModel = TrollComment & Document;

@Schema({ timestamps: true })
export class TrollComment {
    @Transform(({ value }) => value.toString())
    _id: ObjectId;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Client.name })
    @Type(() => Client)
    user: Client;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Troll.name  })
    @Type(() => Troll) 
    troll: Troll;

    @IsString()
    @Prop({ required: false })
    comment: string;

    @Prop({ required: false })
    images: string[];

    @Prop({ required: false })
    videos: string[];

}

export const TrollCommentSchema = SchemaFactory.createForClass(TrollComment);