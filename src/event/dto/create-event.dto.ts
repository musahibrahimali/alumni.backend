export class CreateEventDto{
    eventTitle: string; 
    eventDescription: string;
    eventSnippet: string; 
    eventDate: Date; 
    eventTime: Date; 
    eventVenue: string;
    images?:string[];
    videos?:string[];
}