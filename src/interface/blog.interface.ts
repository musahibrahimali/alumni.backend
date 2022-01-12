import { Document } from "mongoose";

interface IBlog extends Document{
    readonly blogTitle: string;
    readonly blogDescription: string;
    readonly blogSnippet: string; 
    readonly blogCategory: string;
    readonly blogDate?: string; 
    readonly images?: string[]; 
    readonly videos?: string[]; 
    readonly comments?: string[];
}

export default IBlog;