import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Type } from 'class-transformer';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Troll } from "src/troll/schemas/troll.schema";
import { Client } from "src/client/schemas/client.schema";

export type TrollLikeModel = TrollLike & Document;

@Schema({ timestamps: true })
export class TrollLike {
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Client.name })
    @Type(() => Client)
    user: Client;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "Troll" })
    @Type(() => Troll)
    troll: Troll;
}

export const TrollLikeSchema = SchemaFactory.createForClass(TrollLike);
