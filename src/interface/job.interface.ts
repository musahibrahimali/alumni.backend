import { Document } from "mongoose";

interface IJob extends Document{
    readonly _id?: string;
    readonly title: string; 
    readonly details: string;
    readonly snippet: string; 
    readonly expireDate: string; 
    readonly location: string;
    readonly company: string;
    readonly url: string;
    readonly logo?: string;
    readonly images?:string[];
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
}

export default IJob;