import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';

export type NewsModel = News & Document;

@Schema({timestamps: true })
export class News{
    @IsString()
    @Prop({required: true})
    title: string
}

export const NewsSchema = SchemaFactory.createForClass(News);
