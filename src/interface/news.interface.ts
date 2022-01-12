import { Document } from "mongoose";

interface INews extends Document{
    readonly _id?: string;
    readonly title: string;
    readonly snippet: string;
    readonly details: string;
    readonly images?: string[];
    readonly videos?: string[];
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
}

export default INews;
