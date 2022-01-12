export class CreateJobDto{
    title: string; 
    details: string;
    snippet: string; 
    expireDate: string; 
    location: string;
    company: string;
    url: string;
    logo?: string;
    images?:string[];
}