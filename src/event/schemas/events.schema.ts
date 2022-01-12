import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDate, IsString } from 'class-validator';

export type EventsModel = Event & Document;

@Schema({timestamps: true })
export class Event{
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

    @IsDate()
    @Prop({required:true})
    date: Date

    @IsDate()
    @Prop({required:true})
    time: Date
}

export const EventsSchema = SchemaFactory.createForClass(Event);
