export class CreateEventDto{
    title: string; 
    details: string;
    snippet: string; 
    startDate: string; 
    endDate: string; 
    time: string; 
    venue: string;
    images?:string[];
    videos?:string[];
}