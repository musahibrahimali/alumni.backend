import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';

export type TrollModel = Troll & Document;

@Schema({timestamps: true })
export class Troll{
    @IsString()
    @Prop({required: false})
    title: string

    @IsString()
    @Prop({required: false})
    post: string

    @IsString()
    @Prop({required: true})
    user: string

    @Prop({required:false})
    images: string[]

    @Prop({required:false})
    videos: string[]

    @Prop({required:false})
    likes: any[]

    @Prop({required:false})
    comments: any[]

    @Prop({required:false})
    shares: any[]
}

export const TrollSchema = SchemaFactory.createForClass(Troll);
