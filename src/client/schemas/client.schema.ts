import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Transform } from "class-transformer";
import { IsBoolean, IsString } from "class-validator";
import { ObjectId } from "mongoose";

export type ClientModel = Client & Document;

@Schema({timestamps: true })
export class Client{
    @Transform(({ value }) => value.toString())
    _id: ObjectId;

    @IsString()
    @Prop({required: false, unique: true, default: '' })
    socialId: string;

    @IsString()
    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: false, select: false })
    password: string;

    @IsString()
    @Prop({required: false})
    displayName: string;

    @IsString()
    @Prop({ required: false })
    firstName: string;

    @IsString()
    @Prop({required: false})
    lastName: string;

    @IsString()
    @Prop({required: false,unique: true})
    email: string;

    @IsString()
    @Prop({required: false, select: false})
    salt: string;

    @Prop({required: false, default: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'})
    image: string;

    @IsString()
    @Prop({required: false, default: ["user"]})
    roles: string[];

    @IsBoolean()
    @Prop({required: false, default: false })
    isAdmin: boolean;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
