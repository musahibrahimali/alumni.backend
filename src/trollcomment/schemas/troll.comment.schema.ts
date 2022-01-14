import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { IsString } from "class-validator";
import { Type } from "class-transformer";
import { Client } from 'src/client/schemas/client.schema';
import { Troll } from 'src/troll/schemas/troll.schema';
import * as mongoose from 'mongoose';

export type TrollCommentModel = TrollComment & Document;

@Schema({ timestamps: true })
export class TrollComment {
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Client.name })
    @Type(() => Client)
    user: Client;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "Troll" })
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