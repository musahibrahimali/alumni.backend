import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';
import { Client } from '../../client/schemas/client.schema';
import { Troll } from './troll.schema';
import { Type, Transform } from 'class-transformer';

export type TrollShareModel = TrollShare & Document;

@Schema({ timestamps: true })
export class TrollShare {
    @Transform(({ value }) => value.toString())
    _id: ObjectId;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Client.name })
    @Type(() => Client)
    user: Client;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Troll.name  })
    @Type(() => Troll) 
    troll: Troll;
}

export const TrollShareSchema = SchemaFactory.createForClass(TrollShare);
