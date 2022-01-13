import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';
import { Type, Transform } from 'class-transformer';
import { Troll } from "src/troll/schemas/troll.schema";
import { Client } from "src/client/schemas/client.schema";

export type TrollShareModel = TrollShare & Document;

@Schema({ timestamps: true })
export class TrollShare {
    @Transform(({ value }) => value.toString())
    _id: ObjectId;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Client.name })
    @Type(() => Client)
    user: Client;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "Troll" })
    @Type(() => Troll)
    troll: Troll;
}

export const TrollShareSchema = SchemaFactory.createForClass(TrollShare);
