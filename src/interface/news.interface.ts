import { Document } from "mongoose";

interface INews extends Document{
    readonly title: string;
    readonly snippet: string;
    readonly details: string;
    readonly images: string[];
    readonly videos: string[];
}

export default INews;
