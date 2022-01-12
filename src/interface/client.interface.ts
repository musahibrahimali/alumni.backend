import { Document } from "mongoose";

interface IClient extends Document {
    readonly socialId?: string;
    readonly username: string;
    readonly email?: string;
    readonly firstName?: string;
    readonly lastName?: string;
    readonly password?: string;
    readonly image?: string;
    readonly salt?: string;
    readonly roles?: string[],
    readonly isAdmin?: boolean,
}

export default IClient;