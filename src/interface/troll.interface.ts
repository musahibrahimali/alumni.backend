import { Document } from "mongoose";

interface ITroll extends Document{
    readonly post: string;
    readonly user: string;
    readonly images: string[];
    readonly videos: string[];
    readonly likes: any[];
    readonly comments: any[];
    readonly shares: any[];
}

export default ITroll;