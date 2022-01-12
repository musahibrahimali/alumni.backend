import { Document } from "mongoose";

interface IJob extends Document{
    readonly jobTitle: string; 
    readonly jobDescription: string;
    readonly jobSnippet: string; 
    readonly expireDate: string; 
    readonly jobLocation: string;
    readonly companyName: string;
    readonly companyUrl: string;
    readonly companyLogo?: string;
    readonly images?:string[];
}

export default IJob;