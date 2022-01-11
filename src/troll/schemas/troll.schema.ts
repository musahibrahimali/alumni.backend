import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';

export type TrollModel = Troll & Document;

@Schema({timestamps: true })
export class Troll{
    @IsString()
    @Prop({required: true})
    title: string
}

export const TrollSchema = SchemaFactory.createForClass(Troll);
