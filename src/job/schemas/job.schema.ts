import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';

export type JobModel = Job & Document;

@Schema({timestamps: true })
export class Job{

    @Transform(({ value }) => value.toString())
    _id: ObjectId;

    @IsString()
    @Prop({required: true})
    title: string

    @IsString()
    @Prop({required:true})
    company: string

    @IsString()
    @Prop({required:true})
    url: string

    @IsString()
    @Prop({required:true})
    snippet: string

    @IsString()
    @Prop({required:true})
    details: string

    @IsString()
    @Prop({required:true})
    location: string

    @IsString()
    @Prop({required:true})
    expireDate: string

    @IsString()
    @Prop({required:false})
    logo: string

    @Prop({required:false})
    images: string[]
}

export const JobSchema = SchemaFactory.createForClass(Job);
