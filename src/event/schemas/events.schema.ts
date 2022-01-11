import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';

export type EventsModel = Events & Document;

@Schema({timestamps: true })
export class Events{
    @IsString()
    @Prop({required: true})
    title: string
}

export const EventsSchema = SchemaFactory.createForClass(Events);
