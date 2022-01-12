export class CreateJobDto{
    jobTitle: string; 
    jobDescription: string;
    jobSnippet: string; 
    expireDate: string; 
    jobLocation: string;
    companyName: string;
    companyUrl: string;
    companyLogo?: string;
    images?:string[];
}