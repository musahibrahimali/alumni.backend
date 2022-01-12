import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';

export type AdminModel = Admin & Document;

@Schema({timestamps: true })
export class Admin{
    @IsEmail()
    @Prop({required:true})
    username: string
    
    @IsString()
    @Prop({required:true})
    password: string

    @IsEmail()
    @Prop({required:false})
    email: string

    @IsString()
    @Prop({required:true})
    firstName: string

    @IsString()
    @Prop({required:true})
    lastName: string

    @IsString()
    @Prop({required:false})
    displayName: string

    @IsPhoneNumber()
    @Prop({required:true})
    phone: string

    @Prop({required:false, default:'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'})
    image: string
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
