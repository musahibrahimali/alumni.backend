import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';

export type AdminModel = Admin & Document;

@Schema({timestamps: true })
export class Admin{
    @IsString()
    @Prop({required: true})
    title: string
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
