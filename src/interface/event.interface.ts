import { Document } from "mongoose";

interface IEvent extends Document{
    readonly _id?: string;
    readonly title: string; 
    readonly details: string;
    readonly snippet: string; 
    readonly startDate: string; 
    readonly endDate: string; 
    readonly time: string; 
    readonly venue: string;
    readonly images?:string[];
    readonly videos?:string[];
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
}

export default IEvent;