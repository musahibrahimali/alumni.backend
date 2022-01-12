import { Document } from "mongoose";

interface IBlog extends Document{
    readonly _id: string;
    readonly title: string;
    readonly details: string;
    readonly snippet: string; 
    readonly category: string;
    readonly date?: Date; 
    readonly images?: string[]; 
    readonly videos?: string[]; 
    readonly comments?: string[];
    readonly createdAt?: string;
    readonly updatedAt?: string;
}

export default IBlog;