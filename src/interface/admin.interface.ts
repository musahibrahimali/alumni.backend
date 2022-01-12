import { Document } from "mongoose";

interface IAdmin extends Document{
    readonly _id?: string;
    readonly username: string;
    readonly password: string;
    readonly email?: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly displayName?: string;
    readonly salt?: string;
    readonly phone?: string;
    readonly address?: string;
    readonly city?: string;
    readonly previousImages?: string[];
    readonly image?: string | any;
    readonly roles: string[];
    readonly isAdmin: boolean;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
}

export default IAdmin;