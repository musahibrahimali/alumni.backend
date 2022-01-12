import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';

export type NewsModel = New & Document;

@Schema({timestamps: true })
export class New{
    @Transform(({ value }) => value.toString())
    _id: ObjectId;

    @IsString()
    @Prop({required: true})
    title: string

    @IsString()
    @Prop({required:true})
    snippet: string

    @IsString()
    @Prop({required:true})
    details: string

    @Prop({required:false})
    images: string[]

    @Prop({required:false})
    videos: string[]
}

export const NewsSchema = SchemaFactory.createForClass(New);
