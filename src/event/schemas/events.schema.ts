import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';
import { ObjectId } from 'mongoose';
import { Transform } from 'class-transformer';

export type EventsModel = Event & Document;

@Schema({timestamps: true })
export class Event{
    @Transform(({ value }) => value.toString())
    _id: ObjectId;

    @IsString()
    @Prop({required: true})
    title: string

    @IsString()
    @Prop({required: true})
    details: string

    @IsString()
    @Prop({required:true})
    snippet: string

    @IsString()
    @Prop({required:true})
    venue: string

    @Prop({required:false})
    images: string[]

    @Prop({required:false})
    videos: string[]

    @IsString()
    @Prop({required:true})
    startDate: string

    @IsString()
    @Prop({required:true})
    endDate: string

    @IsString()
    @Prop({required:true})
    time: string
}

export const EventsSchema = SchemaFactory.createForClass(Event);
