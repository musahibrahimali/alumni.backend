import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsDate, IsString } from "class-validator";
import { Document, ObjectId } from 'mongoose';
import { Transform } from 'class-transformer';

export type BlogModel = Blog & Document;

@Schema({timestamps: true})
export class Blog{

    @Transform(({ value }) => value.toString())
    _id: ObjectId;

    @IsString()
    @Prop({required: true})
    title: string

    @IsString()
    @Prop({required: true})
    category: string

    @IsString()
    @Prop({required: true})
    snippet: string

    @IsString()
    @Prop({required: true})
    details: string

    @IsDate()
    @Prop({required: false})
    date: Date

    @Prop({required: false})
    images:string[]

    @Prop({required: false})
    videos: string[]

    @Prop({required: false})
    Comments: any[]
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
