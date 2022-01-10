import { Document } from "mongoose";

interface IJob extends Document{
    readonly title: string;
    readonly url: string;
    readonly snippet: string;
    readonly details: string;
    readonly date: string;
    readonly logo: string | any;
}

export default IJob;