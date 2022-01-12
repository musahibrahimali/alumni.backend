import { Document } from "mongoose";

interface INews extends Document{
    readonly newsTitle: string;
    readonly newsSnippet: string;
    readonly newsDescription: string;
    readonly images?: string[];
    readonly videos?: string[];
}

export default INews;
