import { Document } from "mongoose";

interface IEvent extends Document{
    readonly eventTitle: string; 
    readonly eventDescription: string;
    readonly eventSnippet: string; 
    readonly eventDate: Date; 
    readonly eventTime: Date; 
    readonly eventVenue: string;
    readonly images?:string[];
    readonly videos?:string[];
}

export default IEvent;