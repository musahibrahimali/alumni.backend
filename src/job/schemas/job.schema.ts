import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';

export type JobModel = Job & Document;

@Schema({timestamps: true })
export class Job{
    @IsString()
    @Prop({required: true})
    title: string
}

export const JobSchema = SchemaFactory.createForClass(Job);
