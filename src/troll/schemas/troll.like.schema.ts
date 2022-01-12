import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Type, Transform } from 'class-transformer';
import { Document, ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';
import { Client } from '../../client/schemas/client.schema';
import { Troll } from './troll.schema';

export type TrollLikeModel = TrollLike & Document;

@Schema({ timestamps: true })
export class TrollLike {
    @Transform(({ value }) => value.toString())
    _id: ObjectId;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Client.name })
    @Type(() => Client)
    user: Client;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Troll.name  })
    @Type(() => Troll) 
    troll: Troll;
}

export const TrollLikeSchema = SchemaFactory.createForClass(TrollLike);
