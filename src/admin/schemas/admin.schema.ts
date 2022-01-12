import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsPhoneNumber, IsString, IsBoolean } from 'class-validator';
import { ObjectId } from 'mongoose';
import { Transform } from 'class-transformer';

export type AdminModel = Admin & Document;

@Schema({timestamps: true })
export class Admin{
    @Transform(({ value }) => value.toString())
    _id: ObjectId;

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

    @IsString()
    @Prop({required: false})
    salt: string;

    @Prop({required:false, default:'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'})
    image: string

    @IsString()
    @Prop({required: false, default: ["user", "admin"]})
    roles: string[];

    @IsBoolean()
    @Prop({required: false, default: true })
    isAdmin: boolean;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
