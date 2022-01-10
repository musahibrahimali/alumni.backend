import { Document } from "mongoose";

interface IEvent extends Document{
    readonly title: string;
    readonly details: string;
    readonly date: string;
    readonly image: string | any;
}

export default IEvent;