export class CreateEventDto{
    title: string; 
    details: string;
    snippet: string; 
    startDate: Date; 
    endDate: Date; 
    time: Date; 
    venue: string;
    images?:string[];
    videos?:string[];
}