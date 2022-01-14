import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsBoolean, IsString } from "class-validator";

export type ClientModel = Client & Document;

@Schema({timestamps: true })
export class Client{
    @IsString()
    @Prop({required: false, default: '' })
    socialId: string;

    @IsString()
    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: false, })
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
    @Prop({required: false})
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
